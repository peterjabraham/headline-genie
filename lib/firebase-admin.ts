import { initFirestore } from "@next-auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import admin from "firebase-admin";

// Enhanced private key formatting function
const formatPrivateKey = (key: string) => {
  try {
    // Remove any surrounding quotes
    let formattedKey = key.replace(/^\"|\"$/g, "");

    // Check if the key already contains actual newlines
    if (!formattedKey.includes("\\n")) {
      return formattedKey;
    }

    // Replace literal \n with actual newlines
    formattedKey = formattedKey.replace(/\\n/g, "\n");

    // Verify the key has the correct format
    if (
      !formattedKey.includes("-----BEGIN PRIVATE KEY-----") ||
      !formattedKey.includes("-----END PRIVATE KEY-----")
    ) {
      throw new Error("Private key is missing BEGIN/END markers");
    }

    return formattedKey;
  } catch (error) {
    console.error("Error formatting private key:", error);
    throw error;
  }
};

// Get and verify the private key
const privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (!privateKey) {
  throw new Error("FIREBASE_PRIVATE_KEY is not set in environment variables");
}

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  try {
    const formattedKey = formatPrivateKey(privateKey);
    admin.initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: formattedKey,
      }),
    });
  } catch (error) {
    console.error("Error initializing admin app:", error);
    throw error;
  }
}

const adminDb = admin.firestore();
const firestore = initFirestore({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: formatPrivateKey(privateKey),
  }),
});

export { adminDb, firestore };
