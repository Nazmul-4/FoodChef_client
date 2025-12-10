import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // This import is crucial

// PASTE YOUR FIREBASE CONFIG OBJECT HERE AGAIN
const firebaseConfig = {
  apiKey: "AIzaSyAh7LzpjboqMsLjjZ3OnD_B5SLWaaww_14",
  authDomain: "foodmate-acaf3.firebaseapp.com",
  projectId: "foodmate-acaf3",
  storageBucket: "foodmate-acaf3.firebasestorage.app",
  messagingSenderId: "612204560730",
  appId: "1:612204560730:web:b444f63c8c46f9d5f7f363"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// --- THIS IS THE PART YOU WERE MISSING ---
export const auth = getAuth(app);