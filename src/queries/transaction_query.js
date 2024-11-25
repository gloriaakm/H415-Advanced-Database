import { db } from "./config.js";
import { runTransaction, doc, getDoc } from "firebase/firestore";


const transactionTest = async (collectionName, docId) => {
    const docRef = doc(db, collectionName, docId);

    try {
        //const start = Date.now();
        await runTransaction(db, async (transaction) => {
            const docSnapshot = await transaction.get(docRef);
            // Transactions allow you to perform multiple reads and writes atomically.
            if (!docSnapshot.exists()) {
            throw new Error("Document does not exist!");
            }

            const newPrice = docSnapshot.data().price * 1.1;
            transaction.update(docRef, { price: newPrice });
        });
        //const end = Date.now();
        //console.log(`Transaction completed in ${end - start}ms`);
    } catch (error) {
        console.error("Error in transaction:", error.message);
    }
};

// Verify if the script is run with the correct number of arguments
if (process.argv.length !== 4) {
    console.error("Usage: node src/queries/transaction_query.js <collection_name> <doc_id>");
    process.exit(1);
}
// Retrieve the arguments from the command line and pass them to the function
const collectionName = process.argv[2];
const docId = process.argv[3];
transactionTest(collectionName, docId);
