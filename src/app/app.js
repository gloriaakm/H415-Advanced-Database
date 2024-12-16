import { searchProductsByName, getProductsByCategory, getAllProductsSortedByPrice } from './firestore.js';

// Display products in the HTML
const displayProducts = (products) => {
  const productList = document.getElementById("productList");
  productList.innerHTML = '';  // Clear previous results

  if (products.length === 0) {
    productList.innerHTML = '<p>No products found.</p>';
    return;
  }

  products.forEach(product => {
    const productItem = document.createElement('div');
    productItem.innerHTML = `
      <h4>${product.name}</h4>
      <p>Category: ${product.category.join(', ')}</p>
      <p>Price: $${product.price}</p>
      <p>${product.description}</p>
    `;
    productList.appendChild(productItem);
  });
};

// Search products by name
const searchProducts = async () => {
  const searchTerm = document.getElementById("searchTerm").value;
  console.log(`Searching for products with term: "${searchTerm}"`);
  const products = await searchProductsByName(searchTerm);
  console.log("Search results:", products);
  displayProducts(products);
};

// Search products by category
const searchByCategory = async () => {
  const category = document.getElementById("categorySelect").value;
  console.log(`Searching for products in category: "${category}"`);
  const products = await getProductsByCategory(category);
  console.log("Category search results:", products);
  displayProducts(products);
};
