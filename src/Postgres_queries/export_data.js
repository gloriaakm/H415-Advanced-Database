import pkg from 'pg';
const { Client } = pkg;

// PostgreSQL client setup
const client = new Client({
  user: 'h415_user',
  password: '1234',
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
      `{${images[Math.floor(Math.random() * images.length)]}, ${images[Math.floor(Math.random() * images.length)]}}`, // Use a valid PostgreSQL array format
      Math.floor(Math.random() * 500),
      new Date().toISOString()
    ]);
  }
  return products;
};

// Function to insert bulk data into the dynamically named table
const insertBulkData = async (datasetSize) => {
  let tableName;
  tableName = `ecommerce_${datasetSize / 1000}k`;

  const products = generateProductData(datasetSize);
  
  // Prepare the query base string
  const queryBase = `
    INSERT INTO ${tableName} (name, description, price, category, rating, reviews, images, stock, date_added)
    VALUES
  `;

  // Split data into smaller batches (e.g., 1000 products per batch)
  const batchSize = 1000;
  let batchStart = 0;
  const totalBatches = Math.ceil(products.length / batchSize);
  
  // Process in batches
  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const batchEnd = Math.min(batchStart + batchSize, products.length);
    const batchProducts = products.slice(batchStart, batchEnd);

    // Build placeholders for the batch
    const valuePlaceholders = [];
    const queryValues = [];

    batchProducts.forEach((product, index) => {
      const offset = index * 9;
      valuePlaceholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9})`);
      queryValues.push(...product); // Push each product's 9 values
    });

    const fullQuery = queryBase + valuePlaceholders.join(', ');

    try {
      // Execute the batch insert
      await client.query(fullQuery, queryValues);
      console.log(`Batch ${batchIndex + 1} inserted successfully.`);
    } catch (error) {
      console.error('Error during bulk insert', error);
    }

    batchStart = batchEnd; // Move to the next batch
  }
};

// Insert datasets of different sizes
//await insertBulkData(1000); 
//await insertBulkData(2000); 
//await insertBulkData(4000); 
//await insertBulkData(8000); 
//await insertBulkData(16000);
await insertBulkData(25000);

await client.end();
