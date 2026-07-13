import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

/**
 * POST /api/devices/link
 * Link a device to the authenticated user account.
 * This allows notifications captured on the Android device to be
 * associated with the user's web account.
 *
 * Body: { deviceId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { deviceId } = body;

    if (!deviceId || typeof deviceId !== "string") {
      return NextResponse.json({ error: "deviceId is required" }, { status: 400 });
    }

    // v2.9.81 SECURITY FIX: Cap deviceId length to prevent DoS via huge strings.
    // Device IDs are UUID-like (~36 chars) or our generated format (~50 chars).
    // 200 chars is generous; anything longer is abuse.
    if (deviceId.length > 200) {
      return NextResponse.json(
        { error: "deviceId too long (max 200 chars)" },
        { status: 400 }
      );
    }

    // Find the device
    const device = await db.deviceAuth.findFirst({
      where: { deviceId },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    // Link device to user
    await db.deviceAuth.update({
      where: { id: device.id },
      data: { userId },
    });

    // Also update any notifications from this device that weren't linked
    const updateResult = await db.notification.updateMany({
      where: {
        deviceId: device.id,
        userId: { not: userId },
      },
      data: { userId },
    });

    return NextResponse.json({
      success: true,
      message: "Device linked to your account",
      notificationsLinked: updateResult.count,
    });
  } catch (error) {
    console.error("[API] Error linking device:", error);
    return NextResponse.json(
      { error: "Failed to link device" },
      { status: 500 }
    );
  }
}
