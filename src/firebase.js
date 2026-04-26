// Import Firebase
import { initializeApp } from "firebase/app";

// Firestore
import { getFirestore } from "firebase/firestore";

// Auth
import { getAuth } from "firebase/auth";


// 🔑 بيانات مشروعك من Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCVNCRq4OidknyB49fMWLU9-omPzR4_GSI",
  authDomain: "trendx-system.firebaseapp.com",
  projectId: "trendx-system",
  storageBucket: "trendx-system.firebasestorage.app",
  messagingSenderId: "332356655332",
  appId: "1:332356655332:web:c3b6bc905345d33ad2b4f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const auth = getAuth(app);