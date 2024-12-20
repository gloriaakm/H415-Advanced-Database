// add_query.js
import { client } from './config.js';

export const addQuery = async (dataset, doc) => {
  const query = `
    INSERT INTO ${dataset} (product_id, name, category, price, stock) 
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (product_id) 
    DO UPDATE SET 
      name = EXCLUDED.name, 
      category = EXCLUDED.category, 
      price = EXCLUDED.price, 
      stock = EXCLUDED.stock
    RETURNING product_id;
  `;

  const values = [doc.product_id, doc.name, doc.category, doc.price, doc.stock];
  const res = await client.query(query, values);
  return res.rows[0].product_id;
};
