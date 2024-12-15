// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkq1hVXmPn0WUDToDN9AwiBy7S-3eNk8Q",
  authDomain: "info-f415.firebaseapp.com",
  projectId: "info-f415",
  storageBucket: "info-f415.firebasestorage.app",
  messagingSenderId: "395303504113",
  appId: "1:395303504113:web:9eaea7b8759424c6cdc150",
  measurementId: "G-G1N6VZ2LRT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// Initialize Firestore (only for live Firestore service)
export const db = getFirestore(app);
// add this at start of each query file
// import { db } from './config.js';
// and delete the db arg in each query function
