// paginated_query.js
import { client } from './config.js';

export const paginatedQueryTest = async (datasetName, pageSize, pageNumber) => {
  const offset = pageNumber ? (pageNumber - 1) * pageSize : 0;
  const query = `SELECT * FROM ${datasetName} LIMIT $1 OFFSET $2;`;
  const res = await client.query(query, [pageSize, offset]);
  return res.rows;
};
