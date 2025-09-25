// Centralized Firebase initialization using the v8 compatibility layer.
// This file ensures a single instance of Firebase is used throughout the application.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database"; // Switched from Firestore to Realtime Database
import "firebase/compat/storage"; // Add storage for file uploads

// Firebase configuration.
const firebaseConfig = {
  apiKey: "AIzaSyD6GVjbI8pZSv-rfJE92-3eI_q2EJGidHI",
  authDomain: "ferozai-c3a18.firebaseapp.com",
  databaseURL: "https://ferozai-c3a18-default-rtdb.firebaseio.com",
  projectId: "ferozai-c3a18",
  storageBucket: "ferozai-c3a18.appspot.com", // Corrected storage bucket URL
  messagingSenderId: "229224765532",
  appId: "1:229224765532:web:c9d35c83be6bfc5314ae99",
  measurementId: "G-PG6398MM1P"
};

// Initialize the Firebase app if it hasn't been initialized yet to avoid
// errors during hot-reloading.
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

// Get the auth and database services from the main firebase namespace.
// The db instance is now for the Realtime Database to match the firebaseConfig.
export const auth = firebase.auth();
export const db = firebase.database();
export const storage = firebase.storage(); // Export storage service

// Export the initialized firebase object as the default export. This allows other
// modules to import it and access types (e.g., firebase.User) and other
// auth-related utilities (e.g., firebase.auth.GoogleAuthProvider).
export default firebase;