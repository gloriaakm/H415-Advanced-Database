// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // Firestore import
import { getDatabase } from "firebase/database";    // Realtime Database import

// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAwHs-mFSlSMR1ap09noDvMcgtlLiZ2hHI",
  authDomain: "h415-98f20.firebaseapp.com",
  databaseURL: "https://h415-98f20-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "h415-98f20",
  storageBucket: "h415-98f20.firebasestorage.app",
  messagingSenderId: "325975965064",
  appId: "1:325975965064:web:a45015bef3e8d4f64e4e3d",
  measurementId: "G-XK1XKYMLEM"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Realtime Database
export const db = getFirestore(app);        // Firestore instance
export const realtimeDB = getDatabase(app);  // Realtime Database instance
