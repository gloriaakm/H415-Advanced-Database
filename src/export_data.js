import { db } from "./config.js";
import fs from "fs";
import { collection, writeBatch, doc } from "firebase/firestore";

const importData = async () => {
  try {
    // Reading and parsing the JSON data
    const data = JSON.parse(fs.readFileSync("./data/products.json", "utf-8"));

    const collectionRef = collection(db, "products");
    const batchSize = 500; // Firestore limits batch writes to 500 operations
    let batch = writeBatch(db); // Initialize the first batch
    let counter = 0; // Track the number of items in the current batch
    let totalCount = 0; // Track the total number of items uploaded

    for (const product of data) {
      // Create a document reference with an auto-generated ID
      const docRef = doc(collectionRef);

      // Add the product to the batch
      batch.set(docRef, product);
      counter++;
      totalCount++;

      // If the batch is full, commit it and start a new one
      if (counter === batchSize) {
        await batch.commit(); // Commit the batch
        console.log(`Batch committed: ${totalCount} items uploaded so far.`);
        // Add a delay to prevent overloading Firestore
        await delay(200); // Adjust delay (in ms) based on Firestore limits
        batch = writeBatch(db); // Start a new batch
        counter = 0;
      }
    }

    // Commit any remaining documents in the final batch
    if (counter > 0) {
      await batch.commit();
      console.log(`Final batch committed: ${totalCount} items uploaded in total.`);
    }

    console.log("All data successfully uploaded.");
  } catch (error) {
    console.error("Error importing data:", error.message);
  }
};

importData();
