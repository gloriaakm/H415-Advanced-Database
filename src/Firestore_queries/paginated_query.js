import { db } from '../config.js';
import { collection, query, orderBy, limit, startAfter, getDocs } from "firebase/firestore";

// Function to perform paginated query
const paginatedQueryTest = async (collectionName, pageSize, lastDoc) => {
    const collectionRef = collection(db, collectionName);
    let q;

    // If lastDoc is provided, fetch the next page
    if (lastDoc) {
        q = query(collectionRef, orderBy("price"), startAfter(lastDoc), limit(pageSize));
    } else {
        q = query(collectionRef, orderBy("price"), limit(pageSize));
    }
    try {
        const querySnapshot = await getDocs(q);
        
        // Return last document and document data for next pagination
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        
        // Optionally return data for benchmarking or verification
        const documents = querySnapshot.docs.map((doc) => doc.data());
        return { lastVisible, documents };
    } catch (error) {
        console.error("Error in paginated query:", error.message);
        throw error;  // Ensure error propagation for benchmarking
    }
};

export default paginatedQueryTest;
