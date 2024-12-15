import { collection, getDocs } from "firebase/firestore";

// Function to retrieve all documents
const retrieveAllDocuments = async (db, collectionName) => {
    try {
        const collectionRef = collection(db, collectionName);
        const querySnapshot = await getDocs(collectionRef);

        // Print the size of documents retrieved (or just resolve the promise)
        console.log(querySnapshot.size);
    } catch (error) {
        console.error("Error retrieving all documents:", error.message);
        throw error; // Ensure errors are propagated for benchmarking
    }
};

export default retrieveAllDocuments;
