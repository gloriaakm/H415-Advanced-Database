import { db } from './config.js';
import { doc, updateDoc } from 'firebase/firestore';

// Function to update the price of a product document
const updateDocuments = async (collectionName, productId, newPrice) => {
    const docRef = doc(db, collectionName, productId);

    try {
        // Perform the update operation
        await updateDoc(docRef, { price: newPrice });

        // Return success message or data for benchmark tracking
        return { success: true, message: `Product ${productId} in ${collectionName} updated with new price: ${newPrice}` };
    } catch (error) {
        // Return error information
        return { success: false, message: `Error updating product ${productId}: ${error.message}` };
    }
};

export default updateDocuments;
