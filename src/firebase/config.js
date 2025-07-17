import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCcwzWDF3pWSWKcsdtwFLWka4_WsR1bumQ",
  authDomain: "aquafresh-bc761.firebaseapp.com",
  projectId: "aquafresh-bc761",
  storageBucket: "aquafresh-bc761.firebasestorage.app",
  messagingSenderId: "951497534096",
  appId: "1:951497534096:web:3270223c832aa1d2cfc615"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export the app instance if needed
export default app; 