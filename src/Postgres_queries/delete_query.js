// delete_query.js
import { client } from './config.js';

export const deleteQuery = async (datasetName, productId) => {
  const query = `DELETE FROM ${datasetName} WHERE product_id = $1;`;
  await client.query(query, [productId]);
};
