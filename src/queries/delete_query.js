import { db } from "./config.js";
import { collection, query, where, getDocs, deleteDoc } from "firebase/firestore";

const deleteDocuments = async (collectionName, categoryToDelete) => {
    try {
        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, where("category", "==", categoryToDelete));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log(`No documents found for category: ${categoryToDelete}`);
            return;
        }

        console.log(`Deleting ${querySnapshot.size} documents...`);

        for (const docSnapshot of querySnapshot.docs) {
            await deleteDoc(docSnapshot.ref);
            console.log(`Deleted document ID: ${docSnapshot.id}`);
        }

        console.log("All matching documents deleted successfully.");
    } catch (error) {
        console.error("Error deleting documents:", error.message);
    }
};

// Verify if the script is run with the correct number of arguments
if (process.argv.length !== 4) {
    console.error("Usage: node src/queries/delete_query.js <collection_name> <category>");
    process.exit(1);
}

// Retrieve the arguments from the command line and pass them to the function
const collectionName = process.argv[2];
const categoryToDelete = process.argv[3];
deleteDocuments(collectionName, categoryToDelete);
