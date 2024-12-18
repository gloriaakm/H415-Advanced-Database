import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  user: 'h415_user',
  database: 'h415_db',
  password: '1234',
  port: 5432,
});

await client.connect();


const main = async () => {
  const tables = ['ecommerce_1k', 'ecommerce_2k', 'ecommerce_4k', 'ecommerce_8k', 'ecommerce_16k', 'ecommerce_32k', 'ecommerce_64k', 'ecommerce_128k',];
  const results = { test1: [], test2: [], test3: [], test4: [], test5: [] };

  for (const table of tables) {
    console.log(`Running PostgreSQL benchmarks for table: ${table}`);
    
  }

  await client.end();
  console.log(results);
};

main().catch((error) => console.error('Error during benchmarking:', error));
