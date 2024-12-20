// retrieve_all_query.js
import { client } from './config.js';

export const retrieveAllQuery = async (datasetName) => {
  const query = `SELECT * FROM ${datasetName};`;  // Adjust the query based on your schema
  const res = await client.query(query);
  return res.rows;
};
