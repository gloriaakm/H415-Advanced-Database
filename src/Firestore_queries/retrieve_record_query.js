import { db } from './config.js';
import { collection, query, where, getDocs } from "firebase/firestore";

const retrieveSpecificDocument = async (collectionName, product_item) => {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where("product_id", "==", product_item));

    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null; // No document found
        }

        return querySnapshot.docs[0].data();
    } catch (error) {
        console.error("Error retrieving document:", error.message);
        return null;
    }
};

export default retrieveSpecificDocument;
