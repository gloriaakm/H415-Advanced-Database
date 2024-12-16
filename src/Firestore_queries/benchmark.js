import { performance } from 'perf_hooks';
import { firebaseConfig } from './config.js'; // Firebase app configuration
import { initializeFirestore } from 'firebase/firestore';
import { getDatabase, ref, update, onValue } from 'firebase/database'; // For Firebase RTDB

// Firebase and Firestore-specific operations
const firestore = initializeFirestore(firebaseConfig, { experimentalForceLongPolling: true });
const realtimeDB = getDatabase(firebaseConfig);

// Utility function to measure execution time
const measureTime = async (queryFn, ...args) => {
  const start = performance.now();
  await queryFn(...args);
  const end = performance.now();
  return end - start;
};

// Benchmark runner
const runBenchmark = async (queryFn, queryName, args = [], iterations = 10) => {
  console.log(`Benchmarking ${queryName}...`);
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const time = await measureTime(queryFn, ...args);
    if (i > 0) { // Skip the first iteration (cache warming)
      times.push(time);
    }
  }

  // Calculate average time
  const avgTime = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  console.log(`${queryName} - Average Execution Time: ${avgTime.toFixed(2)} ms\n`);
  return avgTime;
};

// Firebase: Simultaneous Real-Time Updates
const simultaneousUpdatesTest = async (dbRef, numUpdates) => {
  const updates = {};
  for (let i = 0; i < numUpdates; i++) {
    updates[`product_${i}`] = { price: Math.random() * 100 };
  }
  await update(ref(realtimeDB, dbRef), updates);
};

// Firebase: Synchronization Performance
const synchronizationTest = async (dbRef, numClients) => {
  const clientRefs = [];
  for (let i = 0; i < numClients; i++) {
    clientRefs.push(ref(realtimeDB, `${dbRef}/client_${i}`));
  }

  const updateTimePromises = clientRefs.map((clientRef) => {
    return new Promise((resolve) => {
      onValue(clientRef, () => {
        const end = performance.now();
        resolve(end);
      });
    });
  });

  // Perform update
  const start = performance.now();
  await update(ref(realtimeDB, dbRef), { syncTest: 'test' });
  const updateTimes = await Promise.all(updateTimePromises);

  return updateTimes.map((time) => time - start);
};

// Firestore: Complex Query
const complexQueryTest = async (db, collection, filterConditions) => {
  let query = db.collection(collection);
  filterConditions.forEach(([field, operator, value]) => {
    query = query.where(field, operator, value);
  });
  const result = await query.get();
  return result.docs.length;
};

// Firestore: Large Dataset Query
const largeDatasetTest = async (db, collection, limit) => {
  const result = await db.collection(collection).limit(limit).get();
  return result.docs.length;
};

// Main function
const main = async () => {
  const datasetSizes = ['ecommerce_1k', 'ecommerce_2k', 'ecommerce_4k', 'ecommerce_8k', 'ecommerce_16k']//, 'ecommerce_32k', 'ecommerce_64k', 'ecommerce_128k'];
  const numUpdates = 100; // Simultaneous updates count
  const numClients = 10;  // Number of clients for sync test
  const filterConditions = [['category', '==', 'Electronics'], ['price', '<', 500]];

  for (const dataset of datasetSizes) {
    console.log(`\nBenchmarking on dataset: ${dataset}`);
    
    // Firebase Benchmarks
    console.log('Firebase Benchmarks:');
    await runBenchmark(() => simultaneousUpdatesTest(`realtimeDB/${dataset}`, numUpdates), 'Simultaneous Updates Test');
    await runBenchmark(() => synchronizationTest(`realtimeDB/${dataset}`, numClients), 'Synchronization Test');
    
    // Firestore Benchmarks
    console.log('Firestore Benchmarks:');
    await runBenchmark(() => complexQueryTest(firestore, dataset, filterConditions), 'Complex Query Test');
    await runBenchmark(() => largeDatasetTest(firestore, dataset, 1000), 'Large Dataset Query Test');
  }
};

main().catch((error) => console.error('Error during benchmarking:', error));
