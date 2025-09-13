// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWyTreHqwF5X_AAAnP9CeIRQ-ggMcOtBY",
  authDomain: "thafheem-ul-quran.firebaseapp.com",
  projectId: "thafheem-ul-quran",
  storageBucket: "thafheem-ul-quran.firebasestorage.app",
  messagingSenderId: "69349166270",
  appId: "1:69349166270:web:2ffde7a6faea461edb62ef",
  measurementId: "G-D7NNTSQSD2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider to reduce CORS issues
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Export auth functions
export { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged };
export default app;