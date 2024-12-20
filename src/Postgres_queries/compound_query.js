<<<<<<< HEAD
// compound_query.js
import { client } from './config.js';

export const compoundQueryTest = async (datasetName, category) => {
  const query = `
    SELECT * FROM ${datasetName} WHERE category = $1 AND price > 100;
  `;
  const res = await client.query(query, [category]);
  return res.rows;
};
=======
// compound_query.js
import { client } from './config.js';

export const compoundQueryTest = async (datasetName, category) => {
  const query = `
    SELECT * FROM ${datasetName} WHERE category = $1 AND price > 100;
  `;
  const res = await client.query(query, [category]);
  return res.rows;
};
>>>>>>> 0d40d6cf02cb407d9dee99d5753c758023ab05e8
