/**
 * Push notification helper using firebase-admin.
 *
 * This module uses lazy imports to avoid firebase-admin crashes
 * when the package is not configured or the environment doesn't support it.
 */

let firebaseInitialized = false;
let messagingModule: {
  getMessaging: () => {
    send: (message: unknown) => Promise<string>;
    sendEachForMulticast: (message: unknown) => Promise<{
      successCount: number;
      failureCount: number;
    }>;
  };
} | null = null;

/**
 * Initialize the Firebase Admin SDK (placeholder).
 * Requires FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY env vars.
 */
async function initializeFCM(): Promise<boolean> {
  if (firebaseInitialized) {
    return messagingModule !== null;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      "[FCM] Firebase Admin environment variables are not set. Push notifications will not work."
    );
    firebaseInitialized = true;
    return false;
  }

  try {
    const admin = await import("firebase-admin");
    const messaging = await import("firebase-admin/messaging");

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }

    messagingModule = messaging;
    firebaseInitialized = true;
    return true;
  } catch (error) {
    console.error("[FCM] Failed to initialize Firebase Admin:", error);
    firebaseInitialized = true;
    return false;
  }
}

/**
 * Send a push notification to a single FCM token.
 */
export async function sendPushNotification(params: {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}): Promise<string | null> {
  const initialized = await initializeFCM();
  if (!initialized || !messagingModule) {
    console.warn("[FCM] Cannot send notification — Firebase not initialized");
    return null;
  }

  try {
    const message = {
      token: params.token,
      notification: {
        title: params.title,
        body: params.body,
      },
      data: params.data,
      android: {
        priority: "high" as const,
      },
    };

    const response = await messagingModule.getMessaging().send(message);
    return response;
  } catch (error) {
    console.error("[FCM] Failed to send push notification:", error);
    return null;
  }
}

/**
 * Send a push notification to multiple FCM tokens.
 */
export async function sendMulticastNotification(params: {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
}): Promise<{ successCount: number; failureCount: number } | null> {
  if (params.tokens.length === 0) {
    return null;
  }

  const initialized = await initializeFCM();
  if (!initialized || !messagingModule) {
    console.warn("[FCM] Cannot send multicast — Firebase not initialized");
    return null;
  }

  try {
    const message = {
      tokens: params.tokens,
      notification: {
        title: params.title,
        body: params.body,
      },
      data: params.data,
      android: {
        priority: "high" as const,
      },
    };

    const response = await messagingModule.getMessaging().sendEachForMulticast(message);
    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    console.error("[FCM] Failed to send multicast notification:", error);
    return null;
  }
}
