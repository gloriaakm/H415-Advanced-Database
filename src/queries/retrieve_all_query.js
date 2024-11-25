import { db } from "../config.js";
import { collection, getDocs } from "firebase/firestore";

const retrieveAllDocuments = async (collectionName) => {
    try {
        const collectionRef = collection(db, collectionName);
        const querySnapshot = await getDocs(collectionRef);

        console.log(`Retrieved ${querySnapshot.size} documents:`);

        querySnapshot.forEach((doc) => {
            console.log(`ID: ${doc.id}, Data:`, doc.data());
        });
    } catch (error) {
        console.error("Error retrieving all documents:", error.message);
    }
};

// Verify if the script is run with the correct number of arguments
if (process.argv.length !== 3) {
    console.error("Usage: node src/queries/retrieve_all_query.js <collection_name>");
    process.exit(1);
}

// We retreive the argument from the command line and pass it to the function
const collectionName = process.argv[2];
retrieveAllDocuments(collectionName);
