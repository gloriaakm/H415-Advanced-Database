import { db } from '../config.js';
import { collection, getDocs } from "firebase/firestore";

// Function to retrieve all documents
const retrieveAllDocuments = async (collectionName) => {
    try {
        const collectionRef = collection(db, collectionName);
        const querySnapshot = await getDocs(collectionRef);

        // Return the size of documents retrieved (or just resolve the promise)
        return querySnapshot.size;
    } catch (error) {
        console.error("Error retrieving all documents:", error.message);
        throw error; // Ensure errors are propagated for benchmarking
    }
};

export default retrieveAllDocuments;
