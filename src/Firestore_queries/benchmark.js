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
};return endTime - startTime;
};

const testScaling = async () => {
  const startTime = performance.now();
  const collectionRef = collection(db, "scaling_test");

  for (let i = 0; i < 1000; i++) {
    await setDoc(doc(collectionRef, `doc_${i}`), { field: `value_${i}` });
  }

  console.log("Automatic scaling test completed.");
  const endTime = performance.now();
  return endTime - startTime;
};

const main = async () => {
  const datasetSizes = ['ecommerce_1k', 'ecommerce_2k', 'ecommerce_4k', 'ecommerce_8k', 'ecommerce_16k', 'ecommerce_25k'];
  const results = {
    schema_less_structure: [],
    real_time_sync: [],
    offline_capabilities: [],
    flexible_data_model: [],
    query_capabilities: [],
    scaling: [],
  };

  for (const dataset of datasetSizes) {
    console.log(`\nBenchmarking on dataset: ${dataset}`);
    results.schema_less_structure.push(await testSchemaLessStructure());
    results.real_time_sync.push(await testRealTimeSync());
    results.offline_capabilities.push(await testOfflineCapabilities());
    results.flexible_data_model.push(await testFlexibleDataModel());
    results.query_capabilities.push(await testQueryCapabilities());
    results.scaling.push(await testScaling());
  }

  console.log(results);
};

main().catch((error) => console.error('Error during benchmarking:', error));

