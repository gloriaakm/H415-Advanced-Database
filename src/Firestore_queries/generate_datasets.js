import fs from 'fs';
import path from 'path';

// Helper functions
const getRandomValue = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomNumber = (min, max) => Math.random() * (max - min) + min;

// Sample data
const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Toys'];
const sampleNames = ['Wireless Headphones', 'Smartphone', 'Laptop', 'Book', 'T-shirt', 'Microwave'];
const sampleDescriptions = [
    'High-quality product with excellent features.',
    'Reliable and affordable.',
    'Top-rated by customers.',
    'Limited edition and exclusive design.',
    'Durable and long-lasting.',
];
const sampleImages = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg'];

// Function to generate a single product
const generateProduct = (id) => ({
    product_id: id.toString(),
    name: getRandomValue(sampleNames),
    description: getRandomValue(sampleDescriptions),
    price: parseFloat(getRandomNumber(5, 500).toFixed(2)),
    category: [getRandomValue(categories)],
    rating: parseFloat(getRandomNumber(1, 5).toFixed(1)),
    reviews: Array.from({ length: Math.floor(getRandomNumber(1, 10)) }, () => ({
        user: `user${Math.floor(getRandomNumber(1, 1000))}`,
        comment: getRandomValue(sampleDescriptions),
        rating: parseFloat(getRandomNumber(1, 5).toFixed(1)),
    })),
    images: [getRandomValue(sampleImages), getRandomValue(sampleImages)],
    stock: Math.floor(getRandomNumber(0, 500)),
    date_added: new Date(Date.now() - Math.floor(getRandomNumber(0, 1e10))).toISOString(),
});

// Function to generate dataset in chunks
const generateDatasetInChunks = async (size, filename, chunkSize = 10000) => {
    console.log(`Generating dataset of size ${size}...`);

    // Ensure the /data/ directory exists
    const dataDir = path.resolve('./data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, filename);
    const stream = fs.createWriteStream(filePath, { flags: 'w' });

    // Start JSON array
    stream.write('[');

    for (let i = 0; i < size; i++) {
        const product = JSON.stringify(generateProduct(i + 1));
        stream.write(product);

        if (i < size - 1) {
            stream.write(','); // Add a comma between elements
        }

        // Log progress for large files
        if (i % chunkSize === 0) {
            console.log(`Generated ${i}/${size} records...`);
        }
    }

    // End JSON array
    stream.write(']');
    stream.end();

    console.log(`Dataset of size ${size} saved to ${filePath}`);
};

// Generate datasets
const datasetSizes = [
    { size: 1000, filename: 'ecommerce_1k.json' },
    { size: 2000, filename: 'ecommerce_2k.json' },
    { size: 4000, filename: 'ecommerce_4k.json' },
    { size: 8000, filename: 'ecommerce_8k.json' },
    { size: 16000, filename: 'ecommerce_16k.json' },
    { size: 32000, filename: 'ecommerce_32k.json' },
    { size: 64000, filename: 'ecommerce_64k.json' },
    { size: 120000, filename: 'ecommerce_128k.json' },
];

(async () => {
    for (const { size, filename } of datasetSizes) {
        await generateDatasetInChunks(size, filename);
    }
})();