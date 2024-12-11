// add_query.js
import { client } from './config.js';

export const addQuery = async (datasetName, productData) => {
  const query = `
    INSERT INTO ${datasetName} (product_id, name, description, price, category, stock)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING product_id;
  `;
  const values = [
    productData.product_id,
    productData.name,
    productData.description,
    productData.price,
    productData.category,
    productData.stock
  ];
  const res = await client.query(query, values);
  return res.rows[0].product_id;
};
