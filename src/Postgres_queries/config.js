// config_psql.js
import pkg from 'pg';
const { Client } = pkg;

// PostgreSQL client setup
const client = new Client({
  user: 'h415_user',
  password: '1234',
  database: 'h415_db'
});

await client.connect();

export { client };
