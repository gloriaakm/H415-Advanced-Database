import { performance } from 'perf_hooks';

// Import queries
import retrieveAllQuery from './retrieve_all_query.js';
import retrieveRecordQuery from './retrieve_record_query.js';
import deleteQuery from './delete_query.js';
import addQuery from './add_query.js';
import updateQuery from './update_query.js';
import compoundQueryTest from './compound_query.js';
import paginatedQueryTest from './paginated_query.js';

// Utility function to measure execution time
const measureTime = async (queryFn, ...args) => {
  const start = performance.now();
  await queryFn(...args);
  const end = performance.now();
  return end - start;
};

// Benchmark runner
const runBenchmark = async (queryFn, queryName, args = [], iterations = 6) => {
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

// Main function
const main = async () => {
  const datasetSizes = ['ecommerce_1k', 'ecommerce_2k', 'ecommerce_4k', 'ecommerce_8k', 'ecommerce_16k', 'ecommerce_25k']; // Datasets
  const product_ids = ['3', '1924', '3124', '5456', '15129', '21742'];
  const result = { retrieveAllQuery: [], retrieveRecordQuery: [], deleteQuery: [], addQuery: [], updateQuery: [], compoundQueryTest: [], paginatedQueryTest: [] };
  
  for (let i = 0; i < datasetSizes.length; i++) {
    console.log(`\nBenchmarking on dataset: ${datasetSizes[i]}`);

    result.retrieveAllQuery.push(await runBenchmark(retrieveAllQuery, 'Retrieve All Query', [datasetSizes[i]]));
    
    result.retrieveRecordQuery.push(await runBenchmark(retrieveRecordQuery, 'Retrieve Record Query', [datasetSizes[i], product_ids[i]]));

    const retrievedDoc = await retrieveRecordQuery(datasetSizes[i], product_ids[i]);

    result.compoundQueryTest.push(await runBenchmark(compoundQueryTest, 'Compound Query', [datasetSizes[i], 'Home']));

    result.paginatedQueryTest.push(await runBenchmark(paginatedQueryTest, 'Paginated Query', [datasetSizes[i], 100, null]));

    result.deleteQuery.push(await runBenchmark(deleteQuery, 'Delete Query', [datasetSizes[i], product_ids[i]]));

    let newDocId = null; // To capture the new document ID
    const readDocumentFn = async () => {newDocId = await addQuery(datasetSizes[i], retrievedDoc);};
    result.addQuery.push(await runBenchmark(readDocumentFn, 'Re-add Query', []));

    result.updateQuery.push(await runBenchmark(updateQuery, 'Update Query', [datasetSizes[i], newDocId, 299.99]));
  }
  console.log('Benchmarking completed for dataset with results:', result);
};

main().catch((error) => console.error('Error during benchmarking:', error));
