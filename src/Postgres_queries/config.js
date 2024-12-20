<<<<<<< HEAD
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
=======
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
>>>>>>> 0d40d6cf02cb407d9dee99d5753c758023ab05e8
