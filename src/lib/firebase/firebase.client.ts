// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp, deleteApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, inMemoryPersistence, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Don't really need to import these from .env
// Just doing it since I'm following a tutorial
const firebaseConfig = {
    apiKey: "AIzaSyB7oIn_MSyFPirNdnBl5UFhFZBuDGPYZHI",
    authDomain: "automating-video-1685338158314.firebaseapp.com",
    projectId: "automating-video-1685338158314",
    storageBucket: "automating-video-1685338158314.appspot.com",
    messagingSenderId: "800196419306",
    appId: "1:800196419306:web:a0d4e10c0f978f78140193",
    measurementId: "G-BSG6Z6FQ77"
  };
// Initialize Firebase
let firebaseApp;

if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApp();
    deleteApp(firebaseApp);
    firebaseApp = initializeApp(firebaseConfig);
}

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp); // for email and password sign in
export const googleAuth = new GoogleAuthProvider(); // for Google sign in