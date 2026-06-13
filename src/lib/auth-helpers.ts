import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyFirebaseToken, getOrCreateUserFromFirebase } from "@/lib/firebase-admin";
import { db } from "@/lib/db";

/**
 * Authenticate a request via NextAuth session, Firebase Bearer token,
 * or device session token (Android app).
 *
 * Checks in order:
 * 1. Firebase Bearer token → verify with Firebase Admin, get/create user
 * 2. Device session token → look up DeviceAuth, find linked user
 * 3. NextAuth JWT session → getServerSession
 *
 * Returns userId or null.
 */
export async function authenticateRequest(request: Request): Promise<string | null> {
  // ── 1. Try Firebase Bearer token (Android app) ─────────────────────────────
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);

    // Try as Firebase ID token first
    const firebaseUid = await verifyFirebaseToken(token);
    if (firebaseUid) {
      try {
        const userInfo = await getOrCreateUserFromFirebase(firebaseUid, undefined);
        if (userInfo) return userInfo.id;
      } catch {
        // Fall through to device token check
      }
    }

    // Try as device session token
    try {
      const device = await db.deviceAuth.findUnique({
        where: { sessionToken: token },
        select: { id: true, userId: true },
      });
      if (device?.userId) {
        // Update last active time
        await db.deviceAuth.update({
          where: { id: device.id },
          data: { lastActiveAt: new Date() },
        }).catch(() => {});
        return device.userId;
      }
    } catch {
      // DB error, fall through
    }
  }

  // ── 2. Fallback to NextAuth session (web app) ───────────────────────────────
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}
