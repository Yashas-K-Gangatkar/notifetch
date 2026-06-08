import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { deviceId } = body;

    if (!deviceId || typeof deviceId !== "string") {
      return NextResponse.json({ error: "deviceId is required" }, { status: 400 });
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
      data: { userId: session.user.id },
    });

    // Also update any notifications from this device that weren't linked
    const updateResult = await db.notification.updateMany({
      where: {
        deviceId: device.id,
        userId: { not: session.user.id },
      },
      data: { userId: session.user.id },
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
