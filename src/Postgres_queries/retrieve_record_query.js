// retrieve_record_query.js
import { client } from './config.js';

export const retrieveRecordQuery = async (datasetName, productId) => {
  const query = `SELECT * FROM ${datasetName} WHERE product_id = $1;`;
  const res = await client.query(query, [productId]);
  return res.rows[0];
};
