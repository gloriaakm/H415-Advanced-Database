import { Client } from 'pg';

// PostgreSQL client setup
const client = new Client({
  user: 'h415_user',
  password: 'your_db_password',
  database: 'h415_db'
});

await client.connect();

// Generate random data for products
const generateProductData = (count) => {
    const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Toys'];
    const names = ['Wireless Headphones', 'Smartphone', 'Laptop', 'Book', 'T-shirt', 'Microwave'];
    const descriptions = ['High-quality product', 'Reliable and affordable', 'Top-rated by customers'];
    const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
  
    const products = [];
    for (let i = 0; i < count; i++) {
      products.push([
        names[Math.floor(Math.random() * names.length)],
        descriptions[Math.floor(Math.random() * descriptions.length)],
        (Math.random() * 500).toFixed(2),
        categories[Math.floor(Math.random() * categories.length)],
        (Math.random() * 5).toFixed(2),
        JSON.stringify([`Review ${i}`]),
        `[${images[Math.floor(Math.random() * images.length)]}, ${images[Math.floor(Math.random() * images.length)]}]`,
        Math.floor(Math.random() * 500),
        new Date().toISOString()
      ]);
    }
    return products;
  };
  
  // Function to insert bulk data into the dynamically named table
  const insertBulkData = async (datasetSize) => {
    const tableName = `ecommerce_${datasetSize / 1000}k`; // Dynamically create the table name
    const products = generateProductData(datasetSize);
    const query = `
      INSERT INTO ${tableName} (name, description, price, category, rating, reviews, images, stock, date_added)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
  
    const queryValues = [];
    for (let i = 0; i < products.length; i++) {
      queryValues.push(...products[i]);
    }
  
    // Run the bulk insert in chunks of 1000
    const chunkSize = 1000;
    for (let i = 0; i < products.length; i += chunkSize) {
      const chunk = products.slice(i, i + chunkSize);
      const chunkQueryValues = [];
      chunk.forEach(product => {
        chunkQueryValues.push(...product);
      });
  
      try {
        await client.query(query, chunkQueryValues);
        console.log(`Inserted batch ${i / chunkSize + 1}`);
      } catch (error) {
        console.error('Error during bulk insert', error);
      }
    }
  
    console.log(`Inserted ${datasetSize} products into ${tableName}`);
  };
  
  // Insert datasets of different sizes
  await insertBulkData(1000);    // Insert 1k products into ecommerce_1k
  await insertBulkData(5000);    // Insert 5k products into ecommerce_5k
  await insertBulkData(10000);   // Insert 10k products into ecommerce_10k
  await insertBulkData(100000);  // Insert 100k products into ecommerce_100k
  await insertBulkData(1000000); // Insert 1M products into ecommerce_1000k
  
  await client.end();
  