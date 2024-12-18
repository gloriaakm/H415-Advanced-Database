import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, query, orderBy, where, limit, getDocs } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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

// Load selected collection
document.getElementById("loadCollectionButton").addEventListener("click", () => {
  const selectedCollection = document.getElementById("collectionSelect").value;
  collectionName = selectedCollection;

  // Feedback to the user
  productList.innerHTML = `<p>Collection <strong>${collectionName}</strong> loaded. You can now apply filters or search.</p>`;
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

// Fetch products from Firestore
async function fetchProducts(queryFunction) {
  productList.innerHTML = "";

  try {
    const productsRef = collection(db, collectionName); // Use the current collection
    const q = queryFunction(productsRef);
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      productList.innerHTML = "<p>No products found.</p>";
      return;
    }

    snapshot.forEach((doc) => {
      const product = doc.data();
      productList.innerHTML += renderProduct(product);
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    productList.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

// Search Products by Name
document.getElementById("searchButton").addEventListener("click", () => {
  const searchTerm = document.getElementById("searchTerm").value.trim();

  if (!searchTerm) {
    productList.innerHTML = "<p>Please enter a product name to search.</p>";
    return;
  }

  fetchProducts((productsRef) =>
    query(
      productsRef,
      where("name", ">=", searchTerm),
      where("name", "<=", searchTerm + "\uf8ff")
    )
  );
});

// Fetch products by category
document.getElementById("categoryButton").addEventListener("click", () => {
  const category = document.getElementById("categorySelect").value.trim();

  if (!category) {
    productList.innerHTML = "<p>Please select a category.</p>";
    return;
  }

  fetchProducts((productsRef) =>
    query(productsRef, where("category", "array-contains", category))
  );
});

// Search by Price Range
document.getElementById("priceButton").addEventListener("click", () => {
  const minPrice = parseFloat(document.getElementById("minPrice").value);
  const maxPrice = parseFloat(document.getElementById("maxPrice").value);

  if (isNaN(minPrice) || isNaN(maxPrice)) {
    productList.innerHTML = "<p>Please enter valid price values.</p>";
    return;
  }

  fetchProducts((productsRef) =>
    query(productsRef, where("price", ">=", minPrice), where("price", "<=", maxPrice))
  );
});

// Filter by Rating
document.getElementById("ratingButton").addEventListener("click", () => {
  const rating = parseFloat(document.getElementById("ratingSelect").value);

  if (isNaN(rating)) {
    productList.innerHTML = "<p>Please select a valid rating.</p>";
    return;
  }

  fetchProducts((productsRef) =>
    query(productsRef, where("rating", ">=", rating))
  );
});

// Sort Products
document.getElementById("sortButton").addEventListener("click", () => {
  const sortOption = document.getElementById("sortSelect").value;

  fetchProducts((productsRef) => {
    if (sortOption === "newest") {
      return query(productsRef, orderBy("date_added", "desc"), limit(20));
    } else if (sortOption === "price-asc") {
      return query(productsRef, orderBy("price", "asc"), limit(20));
    } else if (sortOption === "price-desc") {
      return query(productsRef, orderBy("price", "desc"), limit(20));
    }
  });
});
