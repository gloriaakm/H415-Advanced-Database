// benchmark.js
import { db, realtimeDB } from './config.js';
import { performance } from "perf_hooks";
import { collection } from "firebase/firestore";
import { addDoc } from "firebase/firestore";

// Scalability & Load Testing
const scalabilityTest = async (numRequests) => {
  const writeTimes = [];
  for (let i = 0; i < 6; i++) {  // Run the test 6 times (discard first run)
    const start = performance.now();
    for (let j = 0; j < numRequests; j++) {
      await addDoc(collection(db, "products"), {
        name: `Product ${j}`,
        price: Math.random() * 100,
        timestamp: new Date()
      });
    }
    const end = performance.now();
    if (i > 0) writeTimes.push(end - start); // Discard the first execution
  }
  return writeTimes.reduce((a, b) => a + b, 0) / writeTimes.length; // Average time
};

// Real-Time Synchronization (Multi-Client Updates)
const realTimeSyncTest = async () => {
  const productRef = collection(db, "products");
  const writeTimes = [];
  for (let i = 0; i < 6; i++) {  // Run the test 6 times
    const start = performance.now();
    // Simulate concurrent writes/updates to the same product
    await addDoc(productRef, { name: `Product RealTime`, price: Math.random() * 100 });
    const end = performance.now();
    if (i > 0) writeTimes.push(end - start); // Discard the first execution
  }
  return writeTimes.reduce((a, b) => a + b, 0) / writeTimes.length; // Average time
};

// Unstructured Data & Schema Flexibility
const schemaFlexibilityTest = async (numRequests) => {
  const writeTimes = [];
  for (let i = 0; i < 6; i++) {  // Run the test 6 times
    const start = performance.now();
    for (let j = 0; j < numRequests; j++) {
      await addDoc(collection(db, "products"), {
        name: `Product ${j}`,
        price: Math.random() * 100,
        extraInfo: { color: "red", size: "M" },  // Unstructured data
        timestamp: new Date()
      });
    }
    const end = performance.now();
    if (i > 0) writeTimes.push(end - start); // Discard the first execution
  }
  return writeTimes.reduce((a, b) => a + b, 0) / writeTimes.length; // Average time
};

// Global Availability, Replication & Latency
const globalAvailabilityTest = async (dataset) => {
  const writeTimes = [];
  for (let i = 0; i < 6; i++) {  // Run the test 6 times
    const start = performance.now();
    // Simulate multi-region writes (Firestore handles this natively)
    await addDoc(collection(db, dataset), {
      name: `Smartphone`,
      price: Math.random() * 100,
      timestamp: new Date()
    });
    const end = performance.now();
    if (i > 0) writeTimes.push(end - start); // Discard the first execution
  }
  return writeTimes.reduce((a, b) => a + b, 0) / writeTimes.length; // Average time
};

const main = async () => {
  const datasetSizes = ['ecommerce_1k', 'ecommerce_2k', 'ecommerce_4k', 'ecommerce_8k', 'ecommerce_16k']//, 'ecommerce_32k', 'ecommerce_64k', 'ecommerce_128k'];

  const results = { scalability: [], realTimeSync: [], schemaFlexibility: [], globalAvailability: []};

  for (const dataset of datasetSizes) {
    console.log(`\nBenchmarking on dataset: ${dataset}`);
    const scalabilityTime = await scalabilityTest(dataset, 1000);  // Test with 1000 writes
    const realTimeSyncTime = await realTimeSyncTest(dataset);
    const schemaFlexTime = await schemaFlexibilityTest(dataset, 1000);  // Test with 1000 writes
    const globalAvailabilityTime = await globalAvailabilityTest(dataset);

  
    console.log(`Firestore Benchmark Results:`);
    console.log(`Scalability Test Time (1000 writes): ${scalabilityTime.toFixed(2)} ms`);
    console.log(`Real-Time Sync Test Time: ${realTimeSyncTime.toFixed(2)} ms`);
    console.log(`Schema Flexibility Test Time (1000 writes): ${schemaFlexTime.toFixed(2)} ms`);
    console.log(`Global Availability Test Time: ${globalAvailabilityTime.toFixed(2)} ms`);

    results.scalability.push(scalabilityTime);
    results.realTimeSync.push(realTimeSyncTime);
    results.schemaFlexibility.push(schemaFlexTime);
    results.globalAvailability.push(globalAvailabilityTime);
  }

  console.log(results);
};

main().catch((error) => console.error('Error during benchmarking:', error));
