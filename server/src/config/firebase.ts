import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
  throw new Error('Firebase configuration missing. Please check your environment variables.');
}

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Initialize Firebase Admin SDK only if it hasn't been initialized already
let app;
if (!getApps().length) {
  app = initializeApp({
    credential: cert(firebaseConfig),
  });
} else {
  app = getApps()[0]!;
}

// Initialize Firestore
export const db = getFirestore(app);

// Export the app for other uses if needed
export default app;