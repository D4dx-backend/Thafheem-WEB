// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, signOut, onAuthStateChanged, deleteUser } from "firebase/auth";
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

// Initialize Analytics only if available and in browser environment
let analytics = null;
try {
  // Only initialize analytics in browser environment
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  // Silently fail if analytics cannot be initialized (e.g., network issues, ad blockers, DNS failures)
  // This prevents the app from breaking when analytics cannot connect
  console.warn('Firebase Analytics initialization failed:', error.message);
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// Configure Google provider to reduce CORS issues
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Configure Apple provider
appleProvider.addScope('email');
appleProvider.addScope('name');

// Export auth functions
export { auth, googleProvider, appleProvider, signInWithPopup, signOut, onAuthStateChanged, deleteUser };
export default app;