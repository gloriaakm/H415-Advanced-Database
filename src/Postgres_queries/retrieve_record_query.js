<<<<<<< HEAD
// retrieve_record_query.js
import { client } from './config.js';

export const retrieveRecordQuery = async (datasetName, productId) => {
  const res = await client.query(`SELECT * FROM ${datasetName} WHERE product_id = $1;`, [productId]);
  return res.rows[0];
};
=======
// retrieve_record_query.js
import { client } from './config.js';

export const retrieveRecordQuery = async (datasetName, productId) => {
  const res = await client.query(`SELECT * FROM ${datasetName} WHERE product_id = $1;`, [productId]);
  return res.rows[0];
};
>>>>>>> 0d40d6cf02cb407d9dee99d5753c758023ab05e8
