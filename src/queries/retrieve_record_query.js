import { db } from "../config.js";
import { collection, query, where, getDocs } from "firebase/firestore";

const retrieveSpecificDocument = async (collectionName, itemId) => {
    try {
        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, where("item_id", "==", itemId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log(`No documents found for item_id: ${itemId}`);
            return;
        }

        querySnapshot.forEach((doc) => {
            console.log(`ID: ${doc.id}, Data:`, doc.data());
        });
    } catch (error) {
        console.error("Error retrieving specific document:", error.message);
    }
};

// Verify if the script is run with the correct number of arguments
if (process.argv.length !== 4) {
    console.error("Usage: node src/queries/retrieve_rcd_query.js <collection_name> <item_id>");
    process.exit(1);
}

// We retreive the argument from the command line and pass it to the function
const collectionName = process.argv[2];
const itemId = process.argv[3];
retrieveSpecificDocument(collectionName, itemId);
