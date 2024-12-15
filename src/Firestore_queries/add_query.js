import { collection, addDoc } from 'firebase/firestore';

const addQuery = async (db, collectionName, document) => {
  const collectionRef = collection(db, collectionName);

  try {
    const docRef = await addDoc(collectionRef, document);
    return docRef.id;
  } catch (error) {
    console.error(`Error re-adding document: ${error.message}`);
    return null;
  }
};

export default addQuery;
