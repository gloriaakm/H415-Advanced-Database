import pkg from 'pg';
import { performance } from 'perf_hooks';
const { Client } = pkg;

const client = new Client({
  user: 'h415_user',
  database: 'h415_db',
  password: '1234',
  port: 5432,
});

await client.connect();

// Scalability & Load Testing
const scalabilityTest = async (table, numRequests) => {
  const writeTimes = [];
  for (let i = 0; i < 6; i++) {  // Run the test 6 times (discard first run)
    const start = performance.now();
    for (let j = 0; j < numRequests; j++) {
      await client.query(`INSERT INTO ${table} (name, price) VALUES ($1, $2)`, [`Product ${j}`, Math.random() * 100]);
    }
    const end = performance.now();
    if (i > 0) writeTimes.push(end - start); // Discard the first execution
  }
  return writeTimes.reduce((a, b) => a + b, 0) / writeTimes.length; // Average time
};

// Real-Time Synchronization (Multi-Client Updates)
const realTimeSyncTest = async (table) => {
  const writeTimes = [];
  for (let i = 0; i < 6; i++) {  // Run the test 6 times
    const start = performance.now();
    // Simulate concurrent writes/updates to the same product
    await client.query(`INSERT INTO ${table} (name, price) VALUES ($1, $2)`, [`Product ${i}`, Math.random() * 100]);
    const end = performance.now();
    if (i > 0) writeTimes.push(end - start); // Discard the first execution
  }
  return writeTimes.reduce((a, b) => a + b, 0) / writeTimes.length; // Average time
};

// Unstructured Data & Schema Flexibility
const schemaFlexibilityTest = async (table, numRequests) => {
  const writeTimes = [];
  for (let i = 0; i < 6; i++) {  // Run the test 6 times
    const start = performance.now();
    for (let j = 0; j < numRequests; j++) {
      await client.query(`INSERT INTO ${table} (name, price, description) VALUES ($1, $2, $3)`, 
        [`Product ${j}`, Math.random() * 100, JSON.stringify({ color: "red", size: "M" })]);  // Unstructured data in JSONB
    }
    const end = performance.now();
    if (i > 0) writeTimes.push(end - start); // Discard the first execution
  }
  return writeTimes.reduce((a, b) => a + b, 0) / writeTimes.length; // Average time
};

// Global Availability, Replication & Latency
const globalAvailabilityTest = async (table) => {
  const writeTimes = [];
  for (let i = 0; i < 6; i++) {  // Run the test 6 times
    const start = performance.now();
    // Simulate multi-region writes (PostgreSQL replication handled manually or with read replicas)
    await client.query(`INSERT INTO ${table} (name, price) VALUES ($1, $2)`, ['Smartphone', Math.random() * 100]);
    const end = performance.now();
    if (i > 0) writeTimes.push(end - start); // Discard the first execution
  }
  return writeTimes.reduce((a, b) => a + b, 0) / writeTimes.length; // Average time
};

const main = async () => {
  const results = { scalability: [], realTimeSync: [], schemaFlexibility: [], globalAvailability: []  };
  const tables = ['ecommerce_1k', 'ecommerce_2k', 'ecommerce_4k', 'ecommerce_8k', 'ecommerce_16k', 'ecommerce_32k', 'ecommerce_64k', 'ecommerce_128k',];

  for (const table of tables) {
    console.log(`Running PostgreSQL benchmarks for table: ${table}`);
    
    const scalabilityTime = await scalabilityTest(table, 1000);  // Test with 1000 writes
    const realTimeSyncTime = await realTimeSyncTest(table);
    const schemaFlexTime = await schemaFlexibilityTest(table, 1000);  // Test with 1000 writes
    const globalAvailabilityTime = await globalAvailabilityTest(table);
  
    console.log(`Scalability Test Time (1000 writes): ${scalabilityTime.toFixed(2)} ms`);
    console.log(`Real-Time Sync Test Time: ${realTimeSyncTime.toFixed(2)} ms`);
    console.log(`Schema Flexibility Test Time (1000 writes): ${schemaFlexTime.toFixed(2)} ms`);
    console.log(`Global Availability Test Time: ${globalAvailabilityTime.toFixed(2)} ms\n`);
    
    results.scalability.push(scalabilityTime);
    results.realTimeSync.push(realTimeSyncTime);
    results.schemaFlexibility.push(schemaFlexTime);
    results.globalAvailability.push(globalAvailabilityTime);
  }

  await client.end();
  console.log(results);
};

main().catch((error) => console.error('Error during benchmarking:', error));
