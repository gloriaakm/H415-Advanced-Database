import { db } from './config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


export const scalabilityTest = async (db, numRequests) => {
  const writeTimes = [];
  for (let i = 0; i < 6; i++) {
    const start = performance.now();
    for (let j = 0; j < numRequests; j++) {
      await addDoc(collection(db, "products"), {
        name: `Product ${j}`,
        price: Math.random() * 100,
        timestamp: new Date()
      });
    }
    const end = performance.now();
    if (i > 0) writeTimes.push(end - start);
  }
  return writeTimes.reduce((a, b) => a + b, 0) / writeTimes.length;
};

export const realTimeSyncTest = async () => { 
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

export const schemaFlexibilityTest = async (numRequests) => { 
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

export const globalAvailabilityTest = async (dataset) => { 
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

export const runBenchmark = async () => {
  const datasetSizes = ['ecommerce_1k', 'ecommerce_2k', 'ecommerce_4k', 'ecommerce_8k', 'ecommerce_16k'];
  const results = { scalability: [], realTimeSync: [], schemaFlexibility: [], globalAvailability: [] };

  for (const dataset of datasetSizes) {
    const scalabilityTime = await scalabilityTest(100);
    const realTimeSyncTime = await realTimeSyncTest();
    const schemaFlexTime = await schemaFlexibilityTest(100);
    const globalAvailabilityTime = await globalAvailabilityTest(dataset);

    results.scalability.push(scalabilityTime);
    results.realTimeSync.push(realTimeSyncTime);
    results.schemaFlexibility.push(schemaFlexTime);
    results.globalAvailability.push(globalAvailabilityTime);
    console.log("benchmark.js chargé correctement !");
  }
  
  return results;
};