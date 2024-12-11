// update_query.js
import { client } from './config.js';

export const updateQuery = async (datasetName, productId, newPrice) => {
  const query = `UPDATE ${datasetName} SET price = $1 WHERE product_id = $2;`;
  await client.query(query, [newPrice, productId]);
};
