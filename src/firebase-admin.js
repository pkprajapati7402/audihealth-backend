// filepath: c:\Users\PRINCE\Documents\GitHub\audihealth-backend\src\firebase-admin.js
import admin from "firebase-admin";

// Parse the service account key from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default admin;