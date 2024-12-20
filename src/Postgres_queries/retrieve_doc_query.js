<<<<<<< HEAD
import { client } from './config.js';

// Function to retrieve a document by product_id
export const retrieveDocQuery = async (datasetName, productId) => {
  try {
    const query = `SELECT * FROM ${datasetName} WHERE product_id = $1;`;
    const result = await client.query(query, [productId]);

    if (result.rows.length === 0) {
      console.error(`No document found with product_id: ${productId} in dataset: ${datasetName}`);
      return null;
    }

    return result.rows[0]; // Return the first matching document
  } catch (error) {
    console.error(`Error retrieving document from ${datasetName}:`, error);
    throw error;
  }
};
=======
import { client } from './config.js';

// Function to retrieve a document by product_id
export const retrieveDocQuery = async (datasetName, productId) => {
  try {
    const query = `SELECT * FROM ${datasetName} WHERE product_id = $1;`;
    const result = await client.query(query, [productId]);

    if (result.rows.length === 0) {
      console.error(`No document found with product_id: ${productId} in dataset: ${datasetName}`);
      return null;
    }

    return result.rows[0]; // Return the first matching document
  } catch (error) {
    console.error(`Error retrieving document from ${datasetName}:`, error);
    throw error;
  }
};
>>>>>>> 0d40d6cf02cb407d9dee99d5753c758023ab05e8
