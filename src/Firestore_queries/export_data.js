// generate_datasets.js
import fs from 'fs';
import path from 'path';
import { db } from './config.js';
import { collection, doc, writeBatch } from 'firebase/firestore';

// Helper function to save products to Firestore in batches
const saveProductsToFirestore = async (products, collectionName) => {
    const batch = writeBatch(db); // Initialize batch

    products.forEach((product) => {
        const docRef = doc(collection(db, collectionName), product.product_id); // Reference the document
        batch.set(docRef, product); // Add set operation to the batch
    });

    await batch.commit(); // Commit the batch
    console.log(`Saved ${products.length} products to Firestore collection ${collectionName}`);
};

// Function to read and process dataset in chunks
const processDataset = async (filePath) => {
    // Read the file and parse the data
    const rawData = fs.readFileSync(filePath);
    const products = JSON.parse(rawData);

    // Get collection name from the filename (e.g., 'ecommerce_1m' from 'ecommerce_1m.json')
    const collectionName = path.basename(filePath, '.json');

    console.log(`Processing dataset from ${filePath}...`);

    // Process the data in chunks of 10,000
    const chunkSize = 10000;
    for (let i = 0; i < products.length; i += chunkSize) {
        const chunk = products.slice(i, i + chunkSize); // Slice the chunk of products
        try {
            await saveProductsToFirestore(chunk, collectionName); // Save chunk to Firestore
        } catch (error) {
            console.error(`Error saving products to collection ${collectionName}: ${error.message}`);
        }
    }

    console.log(`All products from ${filePath} have been saved to Firestore.`);
};

// Main function to run the process
const runDatasetProcessing = async () => {
    const datasetFilePaths = [
        './data/ecommerce_5k.json',
        //'./data/ecommerce_10k.json',
        //'./data/ecommerce_100k.json',
        //'./data/ecommerce_500k.json',
        //'./data/ecommerce_1m.json',
    ];

    for (const filePath of datasetFilePaths) {
        await processDataset(filePath); // Process each dataset file
    }
};

runDatasetProcessing().catch((error) => {
    console.error('Error processing datasets:', error);
});
