<<<<<<< HEAD
// delete_query.js
import { client } from './config.js';

export const deleteQuery = async (datasetName, productId) => {
  const query = `DELETE FROM ${datasetName} WHERE product_id = $1 RETURNING product_id;`;
  
  try {
    const result = await client.query(query, [productId]);
    if (result.rowCount === 0) {
      console.warn(`Warning: No record found with product_id = ${productId} in ${datasetName}`);
    }
  } catch (error) {
    console.error(`Error deleting record with product_id = ${productId} from ${datasetName}:`, error);
    throw error;
  }
};
=======
// delete_query.js
import { client } from './config.js';

export const deleteQuery = async (datasetName, productId) => {
  const query = `DELETE FROM ${datasetName} WHERE product_id = $1 RETURNING product_id;`;
  
  try {
    const result = await client.query(query, [productId]);
    if (result.rowCount === 0) {
      console.warn(`Warning: No record found with product_id = ${productId} in ${datasetName}`);
    }
  } catch (error) {
    console.error(`Error deleting record with product_id = ${productId} from ${datasetName}:`, error);
    throw error;
  }
};
>>>>>>> 0d40d6cf02cb407d9dee99d5753c758023ab05e8
