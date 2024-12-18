import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, query, orderBy, where, limit, startAfter, onSnapshot, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAwHs-mFSlSMR1ap09noDvMcgtlLiZ2hHI",
  authDomain: "h415-98f20.firebaseapp.com",
  databaseURL: "https://h415-98f20-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "h415-98f20",
  storageBucket: "h415-98f20.firebasestorage.app",
  messagingSenderId: "325975965064",
  appId: "1:325975965064:web:a45015bef3e8d4f64e4e3d",
  measurementId: "G-XK1XKYMLEM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const productList = document.getElementById("productList");
let collectionName = "ecommerce_1k"; // Default collection
let lastVisible = null; // Track the last document loaded for the current query
const batchSize = 3; // Number of products to load per batch
let currentQueryFunction = null; // Store the current query function
let unsubscribe = null; // Store the unsubscribe function for onSnapshot

// Load selected collection
document.getElementById("loadCollectionButton").addEventListener("click", () => {
  const selectedCollection = document.getElementById("collectionSelect").value;
  collectionName = selectedCollection;

  // Feedback to the user
  productList.innerHTML = `<p>Collection <strong>${collectionName}</strong> loaded. You can now apply filters or search.</p>`;
  lastVisible = null; // Reset pagination
  currentQueryFunction = defaultQuery;
  if (unsubscribe) unsubscribe(); // Stop any previous listener
  loadProducts(); // Load initial products for the new collection
});

// Helper function to render products
function renderProduct(product) {
  return `
    <div class="product-item">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
      <p><strong>Rating:</strong> ${product.rating}</p>
      <p><strong>Category:</strong> ${product.category?.join(", ") || "N/A"}</p>
    </div>
  `;
}

// Default query to load products
function defaultQuery(productsRef) {
  return query(productsRef, orderBy("date_added", "desc"), limit(batchSize));
}

// Load products based on the current query
async function loadProducts() {
  productList.innerHTML = lastVisible ? productList.innerHTML : ""; // Clear the list only on the first load

  try {
    const productsRef = collection(db, collectionName);
    const q = currentQueryFunction(productsRef);

    // Set up real-time listener for the initial query
    if (!lastVisible) {
      unsubscribe = onSnapshot(q, (snapshot) => {
        productList.innerHTML = ""; // Clear the list before rendering updates
        snapshot.docs.forEach((doc) => {
          const product = doc.data();
          productList.innerHTML += renderProduct(product);
        });
        lastVisible = snapshot.docs[snapshot.docs.length - 1];
      });
    } else {
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        if (!lastVisible) productList.innerHTML = "<p>No products found.</p>";
        return;
      }

      // Render products and set the last visible document
      snapshot.docs.forEach((doc) => {
        const product = doc.data();
        productList.innerHTML += renderProduct(product);
      });

      lastVisible = snapshot.docs[snapshot.docs.length - 1];
    }

  } catch (error) {
    console.error("Error loading products:", error);
    productList.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Load more products
document.getElementById("loadMoreButton").addEventListener("click", async () => {
  if (!lastVisible) return;

  try {
    const productsRef = collection(db, collectionName);
    const q = query(
      currentQueryFunction(productsRef),
      startAfter(lastVisible),
      limit(batchSize)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      productList.innerHTML += "<p>No more products to load.</p>";
      return;
    }

    // Render products and update the last visible document
    snapshot.docs.forEach((doc) => {
      const product = doc.data();
      productList.innerHTML += renderProduct(product);
    });

    lastVisible = snapshot.docs[snapshot.docs.length - 1];

  } catch (error) {
    console.error("Error loading more products:", error);
    productList.innerHTML += `<p>Error: ${error.message}</p>`;
  }
});

// Search Products by Name
document.getElementById("searchButton").addEventListener("click", () => {
  const searchTerm = document.getElementById("searchTerm").value.trim();

  if (!searchTerm) {
    productList.innerHTML = "<p>Please enter a product name to search.</p>";
    return;
  }

  currentQueryFunction = (productsRef) =>
    query(productsRef, where("name", ">=", searchTerm), where("name", "<=", searchTerm + "\uf8ff"), limit(batchSize));

  lastVisible = null;
  if (unsubscribe) unsubscribe();
  loadProducts();
});

// Fetch products by category
document.getElementById("categoryButton").addEventListener("click", () => {
  const category = document.getElementById("categorySelect").value.trim();

  if (!category) {
    productList.innerHTML = "<p>Please select a category.</p>";
    return;
  }

  currentQueryFunction = (productsRef) =>
    query(productsRef, where("category", "array-contains", category), limit(batchSize));

  lastVisible = null;
  if (unsubscribe) unsubscribe();
  loadProducts();
});

// Search by Price Range
document.getElementById("priceButton").addEventListener("click", () => {
  const minPrice = parseFloat(document.getElementById("minPrice").value);
  const maxPrice = parseFloat(document.getElementById("maxPrice").value);

  if (isNaN(minPrice) || isNaN(maxPrice)) {
    productList.innerHTML = "<p>Please enter valid price values.</p>";
    return;
  }

  currentQueryFunction = (productsRef) =>
    query(productsRef, where("price", ">=", minPrice), where("price", "<=", maxPrice), limit(batchSize));

  lastVisible = null;
  if (unsubscribe) unsubscribe();
  loadProducts();
});

// Filter by Rating
document.getElementById("ratingButton").addEventListener("click", () => {
  const rating = parseFloat(document.getElementById("ratingSelect").value);

  if (isNaN(rating)) {
    productList.innerHTML = "<p>Please select a valid rating.</p>";
    return;
  }

  currentQueryFunction = (productsRef) =>
    query(productsRef, where("rating", ">=", rating), limit(batchSize));

  lastVisible = null;
  if (unsubscribe) unsubscribe();
  loadProducts();
});

// Sort Products
document.getElementById("sortButton").addEventListener("click", () => {
  const sortOption = document.getElementById("sortSelect").value;

  currentQueryFunction = (productsRef) => {
    if (sortOption === "newest") {
      return query(productsRef, orderBy("date_added", "desc"), limit(batchSize));
    } else if (sortOption === "price-asc") {
      return query(productsRef, orderBy("price", "asc"), limit(batchSize));
    } else if (sortOption === "price-desc") {
      return query(productsRef, orderBy("price", "desc"), limit(batchSize));
    }
  };

  lastVisible = null;
  if (unsubscribe) unsubscribe();
  loadProducts();
});

// Load initial products when the page loads
document.addEventListener("DOMContentLoaded", () => {
  currentQueryFunction = defaultQuery;
  loadProducts();
});
