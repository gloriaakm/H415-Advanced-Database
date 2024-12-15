import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';

// Function to delete documents based on category
const deleteDocuments = async (db, collectionName, categoryToDelete) => {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where("category", "==", categoryToDelete));

    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { success: false, message: `No documents found for category: ${categoryToDelete}` };
        }

        console.log(`Deleting ${querySnapshot.size} documents...`);

        for (const docSnapshot of querySnapshot.docs) {
            await deleteDoc(docSnapshot.ref);
            console.log(`Deleted document ID: ${docSnapshot.id}`);
        }

        return { success: true, message: "All matching documents deleted successfully." };
    } catch (error) {
        return { success: false, message: `Error deleting documents: ${error.message}` };
    }
};

export default deleteDocuments;
