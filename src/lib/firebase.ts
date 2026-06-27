// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAuth, signInWithCustomToken } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTDqSwXSt3ya0thc6WvIPOUKc0V7hmwxI",
  authDomain: "bikincode-d8156.firebaseapp.com",
  databaseURL: "https://bikincode-d8156-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bikincode-d8156",
  storageBucket: "bikincode-d8156.firebasestorage.app",
  messagingSenderId: "872537452643",
  appId: "1:872537452643:web:9d1c0c9979954150b94856",
  measurementId: "G-5H514SX728"
};

// Initialize Firebase (avoid multiple initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const storage = getStorage(app);
export const database = getDatabase(app);
export const auth = getAuth(app);

// Function to authenticate with Firebase using NextAuth session
export const authenticateWithFirebase = async (session: any) => {
  if (!session?.user) {
    throw new Error('No session found')
  }
  
  // For now, we'll use a simple approach
  // In production, you'd want to generate a custom token on your backend
  return session.user
}

export default app;