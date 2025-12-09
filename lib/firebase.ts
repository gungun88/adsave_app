import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase configuration
// These values should be replaced with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCMHNvKPAxxoycJuxhFerSpCAuRGjOAzKM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "adsave-app-4a51a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "adsave-app-4a51a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "adsave-app-4a51a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "42969918862",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:42969918862:web:e421ff6135822f113808df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
