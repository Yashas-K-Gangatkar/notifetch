import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyFirebaseToken, getOrCreateUserFromFirebase } from "@/lib/firebase-admin";
import crypto from "crypto";

/**
 * POST /api/auth/token
 * Exchange a Firebase ID token for a NotiFetch session.
 * Used by the Android app to authenticate with the backend.
 *
 * Body: {
 *   token: string (Firebase ID token or device ID),
 *   provider: "firebase" | "anonymous",
 *   deviceId?: string,
 *   deviceModel?: string,
 *   androidVersion?: string,
 *   appVersion?: string,
 *   fcmToken?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, provider, deviceId, deviceModel, androidVersion, appVersion, fcmToken } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "token is required" }, { status: 400 });
    }

    if (!provider || typeof provider !== "string") {
      return NextResponse.json({ error: "provider is required" }, { status: 400 });
    }

    // Validate provider against whitelist
    if (!["firebase", "anonymous"].includes(provider)) {
      return NextResponse.json({ error: "Invalid provider. Must be 'firebase' or 'anonymous'." }, { status: 400 });
    }

    // For anonymous/device-based auth, use the deviceId as the identifier
    const effectiveDeviceId = deviceId || `device_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    let verifiedFirebaseUid: string | null = null;
    let verifiedEmail: string | undefined;
    let linkedUserId: string | null = null;

    // ── Verify Firebase ID token if provider is "firebase" ──────────────────
    if (provider === "firebase") {
      verifiedFirebaseUid = await verifyFirebaseToken(token);

      if (!verifiedFirebaseUid) {
        return NextResponse.json(
          { error: "Invalid Firebase ID token." },
          { status: 401 }
        );
      }

      // Ensure user exists in our database and get the user ID
      const userInfo = await getOrCreateUserFromFirebase(verifiedFirebaseUid, verifiedEmail);
      if (userInfo) {
        linkedUserId = userInfo.id;
        verifiedEmail = undefined; // Already handled in getOrCreateUserFromFirebase
      }
    }

    // Find or create device auth record
    let device = await db.deviceAuth.findFirst({
      where: {
        OR: [
          { deviceId: effectiveDeviceId },
          ...(verifiedFirebaseUid ? [{ firebaseUid: verifiedFirebaseUid }] : []),
        ],
      },
    });

    if (device) {
      // Update existing device
      device = await db.deviceAuth.update({
        where: { id: device.id },
        data: {
          firebaseUid: verifiedFirebaseUid || device.firebaseUid,
          userId: linkedUserId || device.userId,
          fcmToken: fcmToken || device.fcmToken,
          deviceModel: deviceModel || device.deviceModel,
          androidVersion: androidVersion || device.androidVersion,
          appVersion: appVersion || device.appVersion,
          lastActiveAt: new Date(),
        },
      });
    } else {
      // Create new device
      device = await db.deviceAuth.create({
        data: {
          deviceId: effectiveDeviceId,
          firebaseUid: verifiedFirebaseUid || null,
          userId: linkedUserId || null,
          fcmToken: fcmToken || null,
          deviceModel: deviceModel || null,
          androidVersion: androidVersion || null,
          appVersion: appVersion || null,
          lastActiveAt: new Date(),
        },
      });
    }

    // Generate a cryptographically secure session token and STORE it in the DB
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const sessionTokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await db.deviceAuth.update({
      where: { id: device.id },
      data: { sessionToken },
    });

    return NextResponse.json({
      success: true,
      customToken: sessionToken,
      expiresAt: sessionTokenExpires.toISOString(),
      uid: device.id,
      deviceId: device.deviceId,
      isLinked: !!device.userId,
      message: device.userId
        ? "Device authenticated and linked to user account"
        : "Device authenticated. Link to a user account by signing in.",
    });
  } catch (error) {
    console.error("[API] Error authenticating device:", error);
    return NextResponse.json(
      { error: "Failed to authenticate device" },
      { status: 500 }
    );
  }
}
