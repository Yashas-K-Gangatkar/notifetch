/**
 * Firebase Admin SDK initialization for NotiFetch.
 *
 * Uses environment variables:
 *   - FIREBASE_PROJECT_ID
 *   - FIREBASE_PRIVATE_KEY
 *   - FIREBASE_CLIENT_EMAIL
 *
 * Exports a lazily-initialized admin app and messaging instance.
 */

import * as admin from "firebase-admin";

let adminApp: admin.app.App | null = null;
let adminMessaging: admin.messaging.Messaging | null = null;

/**
 * Returns the initialized Firebase Admin app.
 * Lazily initializes on first call to avoid crashes when env vars are missing.
 */
export function getFirebaseAdminApp(): admin.app.App | null {
  if (adminApp) {
    return adminApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      "[Firebase Admin] Missing environment variables. " +
        "Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY " +
        "to enable push notifications."
    );
    return null;
  }

  try {
    // Reuse existing app if already initialized (hot-reload safety)
    if (admin.apps.length > 0) {
      adminApp = admin.apps[0]!;
    } else {
      adminApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }

    console.log("[Firebase Admin] Initialized successfully for project:", projectId);
    return adminApp;
  } catch (error) {
    console.error("[Firebase Admin] Failed to initialize:", error);
    adminApp = null;
    return null;
  }
}

/**
 * Returns the Firebase Cloud Messaging instance.
 * Returns null if Firebase Admin could not be initialized.
 */
export function getFirebaseMessaging(): admin.messaging.Messaging | null {
  if (adminMessaging) {
    return adminMessaging;
  }

  const app = getFirebaseAdminApp();
  if (!app) {
    return null;
  }

  try {
    adminMessaging = admin.messaging(app);
    return adminMessaging;
  } catch (error) {
    console.error("[Firebase Admin] Failed to get messaging instance:", error);
    return null;
  }
}

/**
 * Send a push notification to a single FCM token.
 */
export async function sendFCMMessage(params: {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const messaging = getFirebaseMessaging();

  if (!messaging) {
    return {
      success: false,
      error: "Firebase Cloud Messaging is not initialized. Check server environment variables.",
    };
  }

  try {
    const message: admin.messaging.Message = {
      token: params.token,
      notification: {
        title: params.title,
        body: params.body,
      },
      data: params.data,
      android: {
        priority: "high" as const,
        notification: {
          sound: "default",
          channelId: "notifetch-orders",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
          },
        },
      },
    };

    const messageId = await messaging.send(message);
    console.log("[FCM] Notification sent successfully, messageId:", messageId);
    return { success: true, messageId };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error sending FCM message";

    // Check for invalid token errors — caller should clear the token
    const isTokenError =
      errorMessage.includes("invalid-registration-token") ||
      errorMessage.includes("NotRegistered") ||
      errorMessage.includes("invalid-argument");

    console.error("[FCM] Failed to send notification:", errorMessage);

    return {
      success: false,
      error: errorMessage,
      ...(isTokenError ? { tokenInvalid: true } : {}),
    };
  }
}
