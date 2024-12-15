import { collection, query, where, getDocs } from 'firebase/firestore';

const retrieveDocQuery = async (db, collectionName, productId) => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, where("product_id", "==", productId));

  try {
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null; // No document found
    }

    // Assume product_id is unique, so return the first matching document
    return querySnapshot.docs[0].data();
  } catch (error) {
    console.error(`Error retrieving document: ${error.message}`);
    return null;
  }
};

export default retrieveDocQuery;
