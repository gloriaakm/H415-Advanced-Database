// Import dependencies
import fs from 'fs';
import path from 'path';
import { db } from './config.js';
import { collection, doc, writeBatch } from 'firebase/firestore';

// Helper function to introduce a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry mechanism with exponential backoff
const retryWithBackoff = async (fn, retries = 5, delayMs = 1000) => {
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

// Helper function to save products to Firestore in batches
const saveProductsToFirestore = async (products, collectionName) => {
    await retryWithBackoff(async () => {
        const batch = writeBatch(db); // Initialize batch

        products.forEach((product) => {
            const docRef = doc(collection(db, collectionName), product.product_id); // Reference the document
            batch.set(docRef, product); // Add set operation to the batch
        });

        await batch.commit(); // Commit the batch
        console.log(`Saved ${products.length} products to Firestore collection ${collectionName}`);
    });
};

// Function to read and process dataset in chunks
const processDataset = async (filePath) => {
    // Read the file and parse the data
    const rawData = fs.readFileSync(filePath);
    const products = JSON.parse(rawData);

    // Get collection name from the filename (e.g., 'ecommerce_100k' from 'ecommerce_100k.json')
    const collectionName = path.basename(filePath, '.json');

    console.log(`Processing dataset from ${filePath} into collection ${collectionName}...`);

    // Process the data in chunks of 1000
    const chunkSize = 1000; // Smaller chunk size to prevent quota issues
    for (let i = 5000; i < products.length; i += chunkSize) {
        const chunk = products.slice(i, i + chunkSize); // Slice the chunk of products
        console.log(`Processing products ${i + 1} to ${i + chunk.length}...`);

        try {
            await saveProductsToFirestore(chunk, collectionName); // Save the chunk to Firestore
        } catch (error) {
            console.error(`Error saving products ${i + 1} to ${i + chunk.length}: ${error.message}`);
            break; // Exit on error
        }

        // Add a delay between batches to avoid exceeding quotas
        await delay(500); // 500ms delay
    }

    console.log(`All products from ${filePath} have been saved to Firestore.`);
};

// Main function to process multiple datasets
const runDatasetProcessing = async () => {
    const datasetFilePaths = [
        //'./data/ecommerce_5k.json',
        //'./data/ecommerce_10k.json',
        './data/ecommerce_100k.json',
        //'./data/ecommerce_500k.json',
        //'./data/ecommerce_1m.json',
    ];

    for (const filePath of datasetFilePaths) {
        await processDataset(filePath); // Process each dataset file
    }
};

// Execute the script
runDatasetProcessing().catch((error) => {
    console.error('Error processing datasets:', error);
});