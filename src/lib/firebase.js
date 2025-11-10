// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth'; // Fixed import

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdUYJTb3XjeJpDPM3mQeIgH5yZzC2E3_M",
  authDomain: "mentora-de85e.firebaseapp.com",
  projectId: "mentora-de85e",
  storageBucket: "mentora-de85e.firebasestorage.app",
  messagingSenderId: "636741346413",
  appId: "1:636741346413:web:776bd3e073af53cb598b64",
  measurementId: "G-FSXXZNQZ2C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); // Fixed this line

export default app;