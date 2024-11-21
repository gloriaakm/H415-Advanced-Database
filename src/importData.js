import { db } from "./config.js";
import fs from "fs";
import { collection, addDoc } from "firebase/firestore";

const importData = async () => {
  try {
    // Reading and parsing the JSON data
    const data = JSON.parse(fs.readFileSync("./data/products.json", "utf-8"));
    
    // Log the data to ensure it's read properly
    //console.log("Data being imported:", data);

    const collectionRef = collection(db, "products");

    // Looping through the data and adding to Firestore
    for (const product of data) {
      await addDoc(collectionRef, product);
      console.log(`Uploaded: ${product.item_id}`);  // Log the item_id to track success
    }
  } catch (error) {
    console.error("Error importing data:", error.message);
  }
};

importData();
