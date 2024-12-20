// compound_query.js
import { client } from './config.js';

export const compoundQueryTest = async (datasetName, category) => {
  const query = `
    SELECT * FROM ${datasetName} WHERE category = $1 AND price > 100;
  `;
  const res = await client.query(query, [category]);
  return res.rows;
};
