// config_psql.js
import { Client } from 'pg';

// Initialize PostgreSQL connection
const client = new Client({
  user: 'postgres',
});

await client.connect();

export { client };
