// filepath: c:\Users\PRINCE\Documents\GitHub\audihealth-backend\src\firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB98K4_Zn1Y2GDTdqpc6QPZZvHW_nW1mtg",
    authDomain: "audihealth-6d4f6.firebaseapp.com",
    projectId: "audihealth-6d4f6",
    storageBucket: "audihealth-6d4f6.appspot.com",
    messagingSenderId: "750505178558",
    appId: "1:750505178558:web:402d5a9988d8e7b387f5ef",
    measurementId: "G-0XCJ331E4Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore and Auth instances
export const db = getFirestore(app);
export const auth = getAuth(app);