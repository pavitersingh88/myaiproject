const admin = require('firebase-admin');

const firebaseConfig = {
  apiKey: "AIzaSyAU2HVjePsbrGVx368mCW2GfDIpsOsAxqY",
  authDomain: "asksarai34.firebaseapp.com",
  projectId: "asksarai34",
  storageBucket: "asksarai34.firebasestorage.app",
  messagingSenderId: "490376429122",
  appId: "1:490376429122:web:bab49ab8f969071e77b7db"
};

admin.initializeApp({
  projectId: firebaseConfig.projectId
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };
