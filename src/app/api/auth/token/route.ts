import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/auth/token
 * Exchange a Firebase ID token for a NotiFetch session.
 * Used by the Android app to authenticate with the backend.
 *
 * Body: {
 *   token: string (Firebase ID token or custom token),
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

    // For anonymous/device-based auth, use the deviceId as the identifier
    const effectiveDeviceId = deviceId || `device_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Find or create device auth record
    let device = await db.deviceAuth.findFirst({
      where: {
        OR: [
          { deviceId: effectiveDeviceId },
          ...(provider === "firebase" ? [{ firebaseUid: token }] : []),
        ],
      },
    });

    if (device) {
      // Update existing device
      device = await db.deviceAuth.update({
        where: { id: device.id },
        data: {
          firebaseUid: provider === "firebase" ? token : device.firebaseUid,
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
          firebaseUid: provider === "firebase" ? token : null,
          fcmToken: fcmToken || null,
          deviceModel: deviceModel || null,
          androidVersion: androidVersion || null,
          appVersion: appVersion || null,
          lastActiveAt: new Date(),
        },
      });
    }

    // Generate a simple session token for the device
    // In production, you'd verify the Firebase ID token using Firebase Admin SDK
    const sessionToken = `nf_${Buffer.from(`${device.id}:${Date.now()}`).toString("base64url")}`;

    return NextResponse.json({
      success: true,
      customToken: sessionToken,
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
