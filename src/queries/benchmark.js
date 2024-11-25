import { db } from "../config.js";
import { collection, query, where, getDocs } from "firebase/firestore";

const benchmarkQuery = async (collectionName, category) => {
  const productsRef = collection(db, collectionName);
  const categoryQuery = query(productsRef, where("category", "==", category));

  const times = [];
  for (let i = 0; i < 6; i++) {
    const start = performance.now();
    const snapshot = await getDocs(categoryQuery);
    const end = performance.now();

    if (i > 0) times.push(end - start); // Ignore the first run
    console.log(`Run ${i + 1}: ${(end - start).toFixed(2)} ms`);
  }

  const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
  console.log(`Average query time for category "${category}" in collection "${collectionName}": ${averageTime.toFixed(2)} ms`);
};

// Verify if the script is run with the correct number of arguments
if (process.argv.length !== 4) {
  console.error("Usage: node src/queries/benchmark.js <collection_name> <category>");
  process.exit(1);
}

// Retrieve the arguments from the command line and pass them to the function
const collectionName = process.argv[2];
const category = process.argv[3];
benchmarkQuery(collectionName, category).catch(console.error);
