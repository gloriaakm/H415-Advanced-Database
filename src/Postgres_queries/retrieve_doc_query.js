// retrieve_doc_query.js
import { client } from './config.js';

export const retrieveDocQuery = async (tableName, productId) => {
  const res = await client.query(`SELECT * FROM ${tableName} WHERE product_id = $1`, [productId]);
  return res.rows[0];
};
