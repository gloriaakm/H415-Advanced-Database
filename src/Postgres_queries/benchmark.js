// benchmark.js
import { performance } from 'perf_hooks';
import { retrieveAllQuery } from './retrieve_all_query.js';
import { retrieveRecordQuery } from './retrieve_record_query.js';
import { deleteQuery } from './delete_query.js';
import { addQuery } from './add_query.js';
import { updateQuery } from './update_query.js';
import { compoundQueryTest } from './compound_query.js';
import { paginatedQueryTest } from './paginated_query.js';

// Utility function to measure execution time
export const measureTime = async (queryFn, ...args) => {
  const start = performance.now();
  await queryFn(...args);
  const end = performance.now();
  return end - start;
};

// Benchmark runner
export const runBenchmark = async (queryFn, queryName, args = [], iterations = 10) => {
  console.log(`Benchmarking ${queryName}...`);
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const time = await measureTime(queryFn, ...args);
    if (i > 0) { // Skip the first iteration (cache warming)
      times.push(time);
    }
  }

  const avgTime = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  console.log(`${queryName} - Average Execution Time: ${avgTime.toFixed(2)} ms\n`);
  return avgTime;
};


const datasetSizes = ['ecommerce_1k', 'ecommerce_5k', 'ecommerce_10k', 'ecommerce_50k', 'ecommerce_100k', 'ecommerce_1m']; // Datasets
const productIs = ['3', '1924', '8124', '456', '129', '42'];

const main = async () => {
  for (let i = 0; i < datasetSizes.length; i++) {
    console.log(`\nBenchmarking on dataset: ${datasetSizes[i]}`);

    // Retrieve all documents
    await runBenchmark(retrieveAllQuery, 'Retrieve All Query', [datasetSizes[i]]);
    
    // Retrieve a specific record
    await runBenchmark(retrieveRecordQuery, 'Retrieve Record Query', [datasetSizes[i], productIds[i]]);

    // Retrieve a specific document by product_id
    const retrievedDoc = await retrieveDocQuery(datasetSizes[i], productIds[i]);

    // Benchmark deletion of the document
    await runBenchmark(deleteQuery, 'Delete Query', [datasetSizes[i], productIds[i]]);

    // Re-add the deleted document
    let newDocId = null; 
    const readdDocumentFn = async () => { newDocId = await addQuery(datasetSizes[i], retrievedDoc); };
    await runBenchmark(readdDocumentFn, 'Re-add Query', []);

    // Benchmark update query
    await runBenchmark(updateQuery, 'Update Query', [datasetSizes[i], newDocId, 299.99]);

    // Benchmark compound query
    await runBenchmark(compoundQueryTest, 'Compound Query', [datasetSizes[i], 'Home']);

    // Benchmark paginated query
    await runBenchmark(paginatedQueryTest, 'Paginated Query', [datasetSizes[i], 100, null]);
  }
};

main().catch((error) => console.error('Error during benchmarking:', error));
