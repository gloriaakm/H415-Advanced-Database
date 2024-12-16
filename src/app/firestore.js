import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from './firebase';

// Search products by name
const searchProductsByName = async (searchTerm) => {
  const productsRef = collection(db, "ecommerce_1k"); // Replace with your collection name
  const q = query(
    productsRef,
    where("name", ">=", searchTerm),
    where("name", "<=", searchTerm + '\uf8ff')
  );
  
  const querySnapshot = await getDocs(q);
  const products = [];
  
  querySnapshot.forEach((doc) => {
    products.push(doc.data());
  });

  return products;
};

// Get products by category
const getProductsByCategory = async (category) => {
  const productsRef = collection(db, "ecommerce_1k");
  const q = query(productsRef, where("category", "==", category));
  
  const querySnapshot = await getDocs(q);
  const products = [];

  querySnapshot.forEach((doc) => {
    products.push(doc.data());
  });

  return products;
};

// Get all products sorted by price
const getAllProductsSortedByPrice = async () => {
  const productsRef = collection(db, "ecommerce_1k");
  const q = query(productsRef, orderBy("price"), limit(10));

  const querySnapshot = await getDocs(q);
  const products = [];

  querySnapshot.forEach((doc) => {
    products.push(doc.data());
  });

  return products;
};

export { searchProductsByName, getProductsByCategory, getAllProductsSortedByPrice };
