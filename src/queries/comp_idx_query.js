import { db } from "./config.js";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

const compoundQueryTest = async (collectionName) => {
  const collectionRef = collection(db, collectionName);
  const q = query(
    collectionRef,
    where("price", ">", 50),
    where("category", "==", "electronics"),
    orderBy("price", "desc")
  );

  try {
    const start = Date.now();
    const querySnapshot = await getDocs(q);
    const end = Date.now();

    console.log(`Compound query retrieved ${querySnapshot.size} documents in ${end - start}ms`);
    querySnapshot.forEach((doc) => console.log(`ID: ${doc.id}, Data:`, doc.data()));
  } catch (error) {
    console.error("Error in compound query:", error.message);
  }
};

// Verify if the script is run with the correct number of arguments
if (process.argv.length !== 3) {
  console.error("Usage: node src/queries/comp_idx_query.js <collection_name>");
  process.exit(1);
}

// Retrieve the argument from the command line and pass it to the function
const collectionName = process.argv[2];
compoundQueryTest(collectionName);
