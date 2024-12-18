import fs from 'fs';
import path from 'path';
import { db } from './config.js';
import { collection, doc, writeBatch } from 'firebase/firestore';

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

const saveProductsToFirestore = async (products, collectionName) => {
    await retryWithBackoff(async () => {
        const batch = writeBatch(db);

        products.forEach((product) => {
            const docRef = doc(collection(db, collectionName), product.product_id);
            batch.set(docRef, product);
        });

        await batch.commit();
    });
};

const processDataset = async (filePath) => {
    const rawData = fs.readFileSync(filePath);
    const products = JSON.parse(rawData);

    // Get collection name from the filename
    const collectionName = path.basename(filePath, '.json');

    console.log(`Processing dataset from ${filePath} into collection ${collectionName}...`);

    const chunkSize = 2500; 
    for (let i = 5000; i < products.length; i += chunkSize) {
        const chunk = products.slice(i, i + chunkSize); // Slice the chunk of products
        console.log(`Processing products ${i + 1} to ${i + chunk.length}...`);

        try {
            await saveProductsToFirestore(chunk, collectionName); // Save the chunk to Firestore
        } catch (error) {
            console.error(`Error saving products ${i + 1} to ${i + chunk.length}: ${error.message}`);
            break;
        }

        // Add a delay between batches to avoid exceeding quotas
        await delay(500);
    }

    console.log(`All products from ${filePath} have been saved to Firestore.`);
};

const runDatasetProcessing = async () => {
    const datasetFilePaths = [
        //'./data/ecommerce_1k.json',
        //'./data/ecommerce_2k.json',
        //'./data/ecommerce_4k.json',
        //'./data/ecommerce_8k.json',
        './data/ecommerce_16k.json',
        //'./data/ecommerce_25k.json',
    ];

    for (const filePath of datasetFilePaths) {
        await processDataset(filePath); 
    }
};

runDatasetProcessing().catch((error) => {
    console.error('Error processing datasets:', error);
});