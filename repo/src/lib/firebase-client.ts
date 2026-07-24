/**
 * Firebase Client SDK initialization for NotiFetch.
 *
 * This module is used on the client side to:
 *   - Request notification permission
 *   - Get FCM registration tokens
 *   - Receive foreground messages
 *
 * Environment variables used:
 *   - NEXT_PUBLIC_FIREBASE_VAPID_KEY (required for FCM token generation)
 *   - NEXT_PUBLIC_FIREBASE_PROJECT_ID (auto-set from FIREBASE_PROJECT_ID in .env)
 *   - NEXT_PUBLIC_FIREBASE_API_KEY (Firebase web API key)
 *   - NEXT_PUBLIC_FIREBASE_APP_ID (Firebase web app ID)
 *   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID (Firebase messaging sender ID)
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ""}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ""}.appspot.com`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Initialize Firebase app (singleton pattern for hot-reload safety)
let firebaseApp: ReturnType<typeof initializeApp> | null = null;

function getFirebaseApp() {
  if (firebaseApp) return firebaseApp;

  if (getApps().length > 0) {
    firebaseApp = getApp();
  } else {
    firebaseApp = initializeApp(firebaseConfig);
  }

  return firebaseApp;
}

/**
 * Returns the Firebase Cloud Messaging instance for the client.
 * Returns null if the browser doesn't support FCM or config is missing.
 */
export async function getFirebaseMessagingClient(): Promise<Messaging | null> {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn("[Firebase Client] Browser does not support FCM messaging");
      return null;
    }

    const app = getFirebaseApp();
    return getMessaging(app);
  } catch (error) {
    console.error("[Firebase Client] Failed to initialize messaging:", error);
    return null;
  }
}

/**
 * Returns the VAPID key for FCM token generation.
 * This must be set as NEXT_PUBLIC_FIREBASE_VAPID_KEY in the environment.
 */
export function getVapidKey(): string {
  return process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";
}

/**
 * Check if Firebase client is properly configured.
 */
export function isFirebaseClientConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
  );
}

export { getFirebaseApp };
