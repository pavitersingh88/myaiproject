import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAU2HVjePsbrGVx368mCW2GfDIpsOsAxqY",
  authDomain: "asksarai34.firebaseapp.com",
  projectId: "asksarai34",
  storageBucket: "asksarai34.firebasestorage.app",
  messagingSenderId: "490376429122",
  appId: "1:490376429122:web:bab49ab8f969071e77b7db",
  measurementId: "G-PNGW5YZYTZ"
};

let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { auth, db };
