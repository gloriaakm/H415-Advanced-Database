import { db } from './config.js';
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

const compoundQueryTest = async (collectionName, categoryToWorkWith) => {
  const collectionRef = collection(db, collectionName);
  const priceThreshold = 50; // Example price filter

  const q = query(
    collectionRef,
    where("price", ">", priceThreshold),  // Use > for price field
    where("category", "array-contains", categoryToWorkWith),  // Use array-contains for category field
    orderBy("price", "desc")
  );

  try {
    const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => console.log(`ID: ${doc.id}, Product_id:`, doc.data().product_id));
  } catch (error) {
    console.error("Error in compound query:", error.message);
  }
};

export default compoundQueryTest;