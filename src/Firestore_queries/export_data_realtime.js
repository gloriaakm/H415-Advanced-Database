import fs from 'fs';
import path from 'path';
import { realtimeDB } from './config.js'; // Import the Realtime Database reference
import { ref, update } from 'firebase/database'; // Import Realtime DB functions

// Helper function to introduce a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry mechanism with exponential backoff
const retryWithBackoff = async (fn, retries = 5, delayMs = 100) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (error.code === 'resource-exhausted' && i < retries - 1) {
                console.warn(`Retrying in ${delayMs}ms... (Attempt ${i + 1})`);
                await delay(delayMs);
                delayMs *= 2; // Exponential backoff
            } else {
                throw error; // Rethrow if no retries left
            }
        }
    }
};

// Helper function to save products to Realtime Database
const saveProductsToRealtimeDB = async (products, dbRef) => {
    await retryWithBackoff(async () => {
        const updates = {};

        products.forEach((product) => {
            // Use the product ID as a key in Realtime Database
            updates[`/${dbRef}/${product.product_id}`] = product;
        });

        // Update the Realtime DB with the products
        await update(ref(realtimeDB), updates);
    });
};

// Function to read and process dataset in chunks
const processDataset = async (filePath) => {
    // Read the file and parse the data
    const rawData = fs.readFileSync(filePath);
    const products = JSON.parse(rawData);

    // Get collection name from the filename (e.g., 'ecommerce_100k' from 'ecommerce_100k.json')
    const collectionName = path.basename(filePath, '.json');
    const dbRef = `products/${collectionName}`; // Define Realtime DB reference

    console.log(`Processing dataset from ${filePath} into Realtime Database at ${dbRef}...`);

    // Process the data in chunks of 2500
    const chunkSize = 2500;
    for (let i = 0; i < products.length; i += chunkSize) {
        const chunk = products.slice(i, i + chunkSize); // Slice the chunk of products
        console.log(`Processing products ${i + 1} to ${i + chunk.length}...`);

        try {
            // Save the chunk to Realtime Database
            await saveProductsToRealtimeDB(chunk, dbRef); // Save to Realtime Database
        } catch (error) {
            console.error(`Error saving products ${i + 1} to ${i + chunk.length}: ${error.message}`);
            break; // Exit on error
        }

        // Add a delay between batches to avoid exceeding quotas
        await delay(500); // 500ms delay
    }

    console.log(`All products from ${filePath} have been saved to Realtime Database.`);
};

// Main function to process multiple datasets
const runDatasetProcessing = async () => {
    const datasetFilePaths = [
        './data/ecommerce_1k.json',
        './data/ecommerce_2k.json',
        './data/ecommerce_4k.json',
        './data/ecommerce_8k.json',
        './data/ecommerce_16k.json',
        './data/ecommerce_32k.json',
        './data/ecommerce_64k.json',
        './data/ecommerce_128k.json',
    ];

    for (const filePath of datasetFilePaths) {
        await processDataset(filePath); // Process each dataset file
    }
};

// Execute the script
runDatasetProcessing().catch((error) => {
    console.error('Error processing datasets:', error);
});
