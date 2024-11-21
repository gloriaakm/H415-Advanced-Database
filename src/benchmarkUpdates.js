import { db } from "./config.js";
import { doc, updateDoc } from "firebase/firestore";

const benchmarkUpdate = async (productId, decrementValue) => {
  const productRef = doc(db, "products", productId);

  const times = [];
  for (let i = 0; i < 6; i++) {
    const start = performance.now();
    await updateDoc(productRef, {
      quality: decrementValue,
    });
    const end = performance.now();

    if (i > 0) times.push(end - start); // Ignore the first run
    console.log(`Run ${i + 1}: ${(end - start).toFixed(2)} ms`);
  }

  const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
  console.log(`Average update time for product ${productId}: ${averageTime.toFixed(2)} ms`);
};

benchmarkUpdate("1", -1).catch(console.error);

/*
node src/benchmarkUpdates.js 
[2024-11-21T21:30:15.554Z]  @firebase/firestore: Firestore (11.0.2): GrpcConnection RPC 'Write' stream 0x6ca9da18 error. Code: 5 Message: 5 NOT_FOUND: No document to update: projects/info-f415/databases/(default)/documents/products/1
[FirebaseError: 5 NOT_FOUND: No document to update: projects/info-f415/databases/(default)/documents/products/1] {
  code: 'not-found',
  customData: undefined,
  toString: [Function (anonymous)]
}
*/
