import { db } from "./config.js";
import { collection, query, orderBy, limit, startAfter, getDocs } from "firebase/firestore";

const paginatedQueryTest = async (collectionName, pageSize, lastDoc) => {
    const collectionRef = collection(db, collectionName);
    let q;

    if (lastDoc) {
        q = query(collectionRef, orderBy("price"), startAfter(lastDoc), limit(pageSize));
    } else {
        q = query(collectionRef, orderBy("price"), limit(pageSize));
    }

    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => console.log(`ID: ${doc.id}, Data:`, doc.data()));
        return querySnapshot.docs[querySnapshot.docs.length - 1]; // Return the last document for the next page
    } catch (error) {
        console.error("Error in paginated query:", error.message);
  }
};

// Verify if the script is run with the correct number of arguments
if (process.argv.length !== 3) {
    console.error("Usage: node src/queries/paginated_query.js <collection_name>");
    process.exit(1);
}

// Retrieve the arguments from the command line and pass them to the function
const collectionName = process.argv[2];

// First page
let lastDoc = await paginatedQueryTest(collectionName, 10, null);
// Next page
lastDoc = await paginatedQueryTest(collectionName, 10, lastDoc);
