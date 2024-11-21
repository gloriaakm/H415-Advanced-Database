import { db } from "./config.js";
import { collection, query, where, getDocs } from "firebase/firestore";

const benchmarkQuery = async (category) => {
  const productsRef = collection(db, "products");
  const categoryQuery = query(productsRef, where("category", "==", category));

  const times = [];
  for (let i = 0; i < 6; i++) {
    const start = performance.now();
    const snapshot = await getDocs(categoryQuery);
    const end = performance.now();

    if (i > 0) times.push(end - start); // Ignore the first run
    console.log(`Run ${i + 1}: ${(end - start).toFixed(2)} ms`);
  }

  const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
  console.log(`Average query time for category "${category}": ${averageTime.toFixed(2)} ms`);
};

benchmarkQuery("dresses").catch(console.error);
