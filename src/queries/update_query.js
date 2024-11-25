import { db } from "./config.js";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

const updateDocuments = async (collectionName, currentCategory, newCategory) => {
    try {
        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, where("category", "==", currentCategory));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log(`No documents found for category: ${currentCategory}`);
            return;
        }

        console.log(`Updating ${querySnapshot.size} documents...`);

        for (const docSnapshot of querySnapshot.docs) {
            await updateDoc(docSnapshot.ref, { category: newCategory });
            console.log(`Updated document ID: ${docSnapshot.id}`);
        }

        console.log("All matching documents updated successfully.");
    } catch (error) {
        console.error("Error updating documents:", error.message);
    }
};

// Verify if the script is run with the correct number of arguments
if (process.argv.length !== 5) {
    console.error("Usage: node src/queries/update_query.js <collection_name> <current_category> <new_category>");
    process.exit(1);
}

// Retrieve the arguments from the command line and pass them to the function
const collectionName = process.argv[2];
const currentCategory = process.argv[3];
const newCategory = process.argv[4];
updateDocuments(collectionName, currentCategory, newCategory);
