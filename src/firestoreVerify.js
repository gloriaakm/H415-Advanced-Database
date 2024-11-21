import { db } from "./config.js";

const firestoreVerify = async () => {
  try {
    console.log("Firestore initialized successfully:", db);
  } catch (error) {
    console.error("Error initializing Firestore:", error);
  }
};

firestoreVerify();
