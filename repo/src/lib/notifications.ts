/**
 * Push notification helper using firebase-admin.
 *
 * Delegates to the centralized Firebase Admin SDK initialization
 * in @/lib/firebase-admin for consistent credential handling.
 */

import { getFirebaseMessaging, sendFCMMessage } from "@/lib/firebase-admin";

/**
 * Send a push notification to a single FCM token.
 *
 * Uses the centralized Firebase Admin SDK from @/lib/firebase-admin.
 */
export async function sendPushNotification(params: {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}): Promise<string | null> {
  const result = await sendFCMMessage(params);

  if (!result.success) {
    console.error("[FCM] Failed to send push notification:", result.error);
    return null;
  }

  return result.messageId || null;
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

  const messaging = getFirebaseMessaging();

  if (!messaging) {
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

    const response = await messaging.sendEachForMulticast(message);
    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
    };
  } catch (error) {
    console.error("[FCM] Failed to send multicast notification:", error);
    return null;
  }
}
