import { db } from './config.js';
import { collection, addDoc, doc, setDoc, getDocs, onSnapshot, enableIndexedDbPersistence } from 'firebase/firestore';

// Utility functions
const getRandomValue = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomNumber = (min, max) => Math.random() * (max - min) + min;

// Sample data arrays
const sampleNames = ["Product A", "Product B", "Product C"];
const sampleDescriptions = ["High quality", "Best seller", "Limited edition"];
const categories = ["Electronics", "Home", "Beauty"];
const sampleImages = ["image1.jpg", "image2.jpg", "image3.jpg"];

// Function to generate a single product
const generateProduct = (id) => ({
  product_id: id.toString(),
  name: getRandomValue(sampleNames),
  description: getRandomValue(sampleDescriptions),
  price: parseFloat(getRandomNumber(5, 500).toFixed(2)),
  category: [getRandomValue(categories)],
  rating: parseFloat(getRandomNumber(1, 5).toFixed(1)),
  reviews: Array.from({ length: Math.floor(getRandomNumber(1, 10)) }, () => ({
    user: `user${Math.floor(getRandomNumber(1, 1000))}`,
    comment: getRandomValue(sampleDescriptions),
    rating: parseFloat(getRandomNumber(1, 5).toFixed(1)),
  })),
  images: [getRandomValue(sampleImages), getRandomValue(sampleImages)],
  stock: Math.floor(getRandomNumber(0, 500)),
  date_added: new Date(Date.now() - Math.floor(getRandomNumber(0, 1e10))).toISOString(),
});

// Dataset sizes
const datasetSizes = ['ecommerce_1k', 'ecommerce_2k', 'ecommerce_4k', 'ecommerce_8k', 'ecommerce_16k', 'ecommerce_25k'];

// Utility function to run a benchmark multiple times and return the average time
const runMultipleTimes = async (func, dataset, times = 6) => {
    const results = [];
    for (let i = 0; i < times; i++) {
        const result = await func(dataset, `benchmark_func_${func.name}_${i}`);
        results.push(result);
    }
    // Calculate the average
    const averageTime = results.reduce((sum, value) => sum + value, 0) / results.length;
    return averageTime;
};

// Updated Flexible Data Model Benchmark to include multiple runs
const flexibleDataModelTest = async (dataset, id) => {
    const start = performance.now();

    // Create hierarchical data: products → reviews
    const productCollection = collection(db, dataset);
    const productRef = await addDoc(productCollection, generateProduct(id));
    const reviewsCollection = collection(productRef, "reviews");
    await addDoc(reviewsCollection, { user: "User1", comment: "Excellent product", rating: 5 });

    // Query nested data
    const querySnapshot = await getDocs(reviewsCollection);
    querySnapshot.forEach((doc) => console.log(doc.data()));

    const end = performance.now();
    return end - start;
};

// Updated Real-Time Sync Benchmark to include multiple runs
const realTimeSyncTest = async (dataset, id) => {
    const start = performance.now();

    // Listen for real-time updates
    const unsubscribe = onSnapshot(collection(db, dataset), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            console.log(`Change type: ${change.type}`);
        });
    });

    // Add data to trigger real-time updates
    await addDoc(collection(db, dataset), generateProduct(id));

    const end = performance.now();
    unsubscribe(); // Stop listening
    return end - start;
};

// Updated Automatic Scaling Benchmark to include multiple runs
const automaticScalingTest = async (dataset, numRequests, id) => {
    const writeTimes = [];

    for (let i = 0; i < numRequests; i++) {
        const start = performance.now();
        await addDoc(collection(db, dataset), generateProduct(id));
        const end = performance.now();
        writeTimes.push(end - start);
    }

    // Calculate average write time
    return writeTimes.reduce((a, b) => a + b, 0) / writeTimes.length;
};

// Updated Offline Support Benchmark to include multiple runs
const offlineSupportTest = async (dataset, id) => {
    // Enable offline persistence
    try {
        await enableIndexedDbPersistence(db);
        console.log("Offline persistence enabled.");
    } catch (err) {
        console.error("Persistence failed: ", err);
        return;
    }

    // Go offline
    await db.disableNetwork();

    const start = performance.now();

    // Add data while offline (it will sync when online)
    await addDoc(collection(db, dataset), generateProduct(id));

    const end = performance.now();
    console.log("Offline write complete. Changes will sync when online.");
    return end - start;
};

// Main Benchmark Runner with multiple runs per test
export const runBenchmark = async () => {
    const results = { flexibleDataModel: [], realTimeSync: [], automaticScaling: [], offlineSupport: [] };

    for (const dataset of datasetSizes) {
        console.log(`Running benchmarks for dataset: ${dataset}`);

        // Run each benchmark multiple times and calculate the average
        const flexTime = await runMultipleTimes(flexibleDataModelTest, dataset);
        results.flexibleDataModel.push(flexTime);

        const realTime = await runMultipleTimes(realTimeSyncTest, dataset);
        results.realTimeSync.push(realTime);

        const scalingTime = await runMultipleTimes(automaticScalingTest, dataset, 5); // 5 requests for scalability test
        results.automaticScaling.push(scalingTime);

        const offlineTime = await runMultipleTimes(offlineSupportTest, dataset);
        results.offlineSupport.push(offlineTime);

        console.log(`Finished benchmarks for dataset: ${dataset}`);
    }

    console.log("Benchmark results:", results);
    return results;
};

// Run the benchmarks
runBenchmark().then((results) => console.log("Final Results:", results)).catch((error) => console.error("Error during benchmarking:", error));
