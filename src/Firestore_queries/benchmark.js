// benchmark.js
import { db, realtimeDB } from './config.js';
import { performance } from "perf_hooks";
import { getDocs, collection, query, where, limit, setDoc, doc, updateDoc } from "firebase/firestore";
import { ref, update, goOffline, goOnline, onValue } from "firebase/database";

const testSchemaLessStructure = async () => {
  const startTime = performance.now();
  const testData = {
    doc_1: { field1: "value1", field2: 123 },
    doc_2: { fieldA: ["list", "of", "values"], fieldB: { nested: "object" } },
  };

  for (const [docId, docData] of Object.entries(testData)) {
    await setDoc(doc(db, "schema_less_test", docId), docData);
  }
  const endTime = performance.now();
  console.log("Schema-less structure test completed.");
  return endTime - startTime;
};

const testRealTimeSync = async () => {
  const startTime = performance.now();
  const syncRef = ref(realtimeDB, "real_time_sync_test");
  const data = { key1: "value1", key2: "value2" };

  const listener = (snapshot) => {
    console.log("Realtime update received:", snapshot.val());
  };

  onValue(syncRef, listener);
  await update(syncRef, data);
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Allow time for sync to occur
  const endTime = performance.now();
  console.log("Real-time synchronization test completed.");
  return endTime - startTime;
};

const testOfflineCapabilities = async () => {
  const startTime = performance.now();
  const offlineRef = ref(realtimeDB, "offline_test");
  const data = { offline_key: "offline_value" };

  goOffline(realtimeDB);
  await update(offlineRef, data);
  console.log("Data written offline.");

  goOnline(realtimeDB);
  console.log("Reconnected and data synced.");
  const endTime = performance.now();
  return endTime - startTime;
};

const testFlexibleDataModel = async () => {
  const startTime = performance.now();
  const docData = {
    user: {
      name: "John Doe",
      age: 30,
      preferences: { theme: "dark", notifications: true },
    },
    orders: [
      { order_id: "001", amount: 250.75 },
      { order_id: "002", amount: 450.50 },
    ],
  };

  await setDoc(doc(db, "flexible_model_test", "user_1"), docData);
  console.log("Flexible data model test completed.");
  const endTime = performance.now();
  return endTime - startTime;
};

const testQueryCapabilities = async () => {
  const startTime = performance.now();
  const collectionRef = collection(db, "query_test");

  for (let i = 0; i < 10; i++) {
    await setDoc(doc(collectionRef, `doc_${i}`), { value: i * 10 });
  }

  const queryResult = query(collectionRef, where("value", ">=", 50));
  const docs = await getDocs(queryResult);
  const results = docs.docs.map((doc) => doc.data());
  console.log("Query results:", results);
  const endTime = performance.now();
  return endTime - startTime;
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

