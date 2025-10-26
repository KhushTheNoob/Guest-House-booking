import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB5Y8DhBv3cp-dfbXlwao1A12PJiNGqQaE",
  authDomain: "iiitnr-guesthouse-11dcc.firebaseapp.com",
  projectId: "iiitnr-guesthouse-11dcc",
  storageBucket: "iiitnr-guesthouse-11dcc.firebasestorage.app",
  messagingSenderId: "269818320827",
  appId: "1:269818320827:web:dee2ddeb11bb689d0d169e"
};

// prevent duplicate initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
