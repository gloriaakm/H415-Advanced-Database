// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwHs-mFSlSMR1ap09noDvMcgtlLiZ2hHI",
  authDomain: "h415-98f20.firebaseapp.com",
  projectId: "h415-98f20",
  storageBucket: "h415-98f20.firebasestorage.app",
  messagingSenderId: "325975965064",
  appId: "1:325975965064:web:4914ddf2df8be2314e4e3d",
  measurementId: "G-3WTD6KZZM0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const db = getFirestore(app);