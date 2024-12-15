// add_query.js
import { client } from './config.js';

export const addQuery = async (tableName, productData) => {
  const queryText = `
  INSERT INTO ${tableName} (product_id, name, description, price, category, rating, stock, date_added)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  ON CONFLICT (product_id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    category = EXCLUDED.category,
    rating = EXCLUDED.rating,
    stock = EXCLUDED.stock,
    date_added = EXCLUDED.date_added
  RETURNING product_id`;
const values = [
  productData.product_id,
  productData.name,
  productData.description,
  productData.price,
  productData.category,
  productData.rating,
  productData.stock,
  productData.date_added,
];
const res = await client.query(queryText, values);
return res.rows[0].product_id;
};

