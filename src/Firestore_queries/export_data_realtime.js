import fs from 'fs';
import path from 'path';
import { realtimeDB } from './config.js';
import { ref, update } from 'firebase/database'; 

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

const saveProductsToRealtimeDB = async (products, dbRef) => {
    await retryWithBackoff(async () => {
        const updates = {};

        products.forEach((product) => {
            // Use the product ID as a key in Realtime Database
            updates[`/${dbRef}/${product.product_id}`] = product;
        });

        await update(ref(realtimeDB), updates);
    });
};

const processDataset = async (filePath) => {
    const rawData = fs.readFileSync(filePath);
    const products = JSON.parse(rawData);

    // Get collection name from the filename
    const collectionName = path.basename(filePath, '.json');
    const dbRef = `products/${collectionName}`; // Define Realtime DB reference

    console.log(`Processing dataset from ${filePath} into Realtime Database at ${dbRef}...`);

    // Process the data in chunks of 2500
    const chunkSize = 2500;
    for (let i = 0; i < products.length; i += chunkSize) {
        const chunk = products.slice(i, i + chunkSize); // Slice the chunk of products
        console.log(`Processing products ${i + 1} to ${i + chunk.length}...`);

        try {
            await saveProductsToRealtimeDB(chunk, dbRef);
        } catch (error) {
            console.error(`Error saving products ${i + 1} to ${i + chunk.length}: ${error.message}`);
            break; // Exit on error
        }
        await delay(500); // 500ms delay
    }

    console.log(`All products from ${filePath} have been saved to Realtime Database.`);
};

const runDatasetProcessing = async () => {
    const datasetFilePaths = [
        //'./data/ecommerce_1k.json',
        //'./data/ecommerce_2k.json',
        //'./data/ecommerce_4k.json',
        //'./data/ecommerce_8k.json',
        //'./data/ecommerce_16k.json',
        //'./data/ecommerce_25k.json',
    ];

    for (const filePath of datasetFilePaths) {
        await processDataset(filePath);
    }
};

runDatasetProcessing().catch((error) => {
    console.error('Error processing datasets:', error);
});
