// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Firebase Emulator Configuration
const firebaseConfig = {
  projectId: "info-f415", // Use projectId only for emulator setup; no API key or auth domain needed.
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Connect to Firestore Emulator
connectFirestoreEmulator(db, "localhost", 8080);

// Export the Firestore instance
export { db };

/* Prerequisites:
firebase --version
firebase login
firebase init emulators (Firestore Emulator)
firebase emulators:start --only firestore
(Open another terminal)
*/
