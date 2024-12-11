import { db } from "./config.js";

const verify_firestore_init = async () => {
  try {
    console.log("Firestore initialized successfully:", db);
  } catch (error) {
    console.error("Error initializing Firestore:", error);
  }
};

verify_firestore_init();
