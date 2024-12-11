import { db } from '../config.js';
import { collection, query, where, getDocs } from "firebase/firestore";

// Function to retrieve a specific document based on a product_id
const retrieveSpecificDocument = async (collectionName, product_item) => {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where("product_id", "==", product_item));

    try {
        const querySnapshot = await getDocs(q);

        // If no documents are found, return a message
        if (querySnapshot.empty) {
            return { found: false, message: `No documents found for product_id: ${product_item}` };
        }

        // Otherwise, return the document data
        const documents = querySnapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
        }));

        return { found: true, documents };
    } catch (error) {
        console.error("Error retrieving specific document:", error.message);
        throw error; // Ensure error is handled in the benchmark
    }
};

export default retrieveSpecificDocument;
