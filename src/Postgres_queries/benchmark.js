// benchmark.js
import { performance } from 'perf_hooks';
import { retrieveAllQuery } from './retrieve_all_query.js';
import { retrieveRecordQuery } from './retrieve_record_query.js';
import { retrieveDocQuery } from './retrieve_doc_query.js';
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
export const runBenchmark = async (queryFn, queryName, args = [], iterations = 6) => {
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    let time;
    if (queryName == 'Delete Query') {
      time = await measureTime(queryFn, args[0], args[1]); // Delete the document
      if(i < 5){
        await addQuery(args[0], args[2]); // Add the document back to the collection
      }
    } else {
      time = await measureTime(queryFn, ...args);
    }
    if (i > 0) { // Skip the first iteration (cache warming)
      times.push(time);
    }
  }

  const avgTime = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  console.log(`${queryName} - Average Execution Time: ${avgTime.toFixed(2)} ms\n`);
  return avgTime;
};

const datasetSizes = ['ecommerce_1k', 'ecommerce_2k', 'ecommerce_4k', 'ecommerce_8k', 'ecommerce_16k', 'ecommerce_25k']; // Datasets
const productIds = ['33', '1924', '3124', '5456', '15129', '21742'];
const result = { retrieveAllQuery: [], retrieveRecordQuery: [], deleteQuery: [], addQuery: [], updateQuery: [], compoundQueryTest: [], paginatedQueryTest: [] };

const main = async () => {
  for (let i = 0; i < datasetSizes.length; i++) {
    console.log(`\nBenchmarking on dataset: ${datasetSizes[i]}`);

    // Retrieve all documents
    result.retrieveAllQuery.push(await runBenchmark(retrieveAllQuery, 'Retrieve All Query', [datasetSizes[i]]));
    
    // Retrieve a specific record
    result.retrieveRecordQuery.push(await runBenchmark(retrieveRecordQuery, 'Retrieve Record Query', [datasetSizes[i], productIds[i]]));

    // Retrieve a specific document by product_id
    const retrievedDoc = await retrieveDocQuery(datasetSizes[i], productIds[i]);

    // Benchmark deletion of the document
    result.deleteQuery.push(await runBenchmark(deleteQuery, 'Delete Query', [datasetSizes[i], retrievedDoc.product_id, retrievedDoc]));

    // Re-add the deleted document
    let newDocId = null; 
    const readDocumentFn = async () => { newDocId = await addQuery(datasetSizes[i], retrievedDoc); };
    result.addQuery.push(await runBenchmark(readDocumentFn, 'Re-add Query', []));

    // Benchmark update query
    result.updateQuery.push(await runBenchmark(updateQuery, 'Update Query', [datasetSizes[i], newDocId, 299.99]));

    // Benchmark compound query
    result.compoundQueryTest.push(await runBenchmark(compoundQueryTest, 'Compound Query', [datasetSizes[i], 'Home']));

    // Benchmark paginated query
    result.paginatedQueryTest.push(await runBenchmark(paginatedQueryTest, 'Paginated Query', [datasetSizes[i], 100, null]));

  }
  console.log('Benchmarking completed for dataset with results:', result);
};

main().catch((error) => console.error('Error during benchmarking:', error));
