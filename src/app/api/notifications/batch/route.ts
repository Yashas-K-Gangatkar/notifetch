import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * POST /api/notifications/batch
 * Batch create notifications from the Android app.
 *
 * Body: {
 *   notifications: [{
 *     source, platform, title, body, orderValue?, pickupLocation?,
 *     dropoffLocation?, distance?, receivedAt?, packageName?,
 *     category?, bigText?, subText?
 *   }],
 *   deviceId?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Try NextAuth session first (web app)
    const session = await getServerSession(authOptions);
    let userId: string | null = session?.user?.id || null;

    // If no session, try device auth (Android app)
    if (!userId) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        const device = await db.deviceAuth.findFirst({
          where: {
            OR: [
              { deviceId: token },
              { firebaseUid: token },
            ],
          },
        });
        if (device?.userId) {
          userId = device.userId;
        } else if (device) {
          return NextResponse.json(
            { error: "Device not linked to user account. Please sign in first." },
            { status: 403 }
          );
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notifications, deviceId } = body;

    if (!Array.isArray(notifications) || notifications.length === 0) {
      return NextResponse.json(
        { error: "notifications array is required and must not be empty" },
        { status: 400 }
      );
    }

    // Limit batch size to prevent abuse
    if (notifications.length > 100) {
      return NextResponse.json(
        { error: "Batch size cannot exceed 100 notifications" },
        { status: 400 }
      );
    }

    // Validate each notification
    for (let i = 0; i < notifications.length; i++) {
      const n = notifications[i];
      if (!n.title || typeof n.title !== "string") {
        return NextResponse.json(
          { error: `notifications[${i}].title is required` },
          { status: 400 }
        );
      }
      if (!n.body || typeof n.body !== "string") {
        return NextResponse.json(
          { error: `notifications[${i}].body is required` },
          { status: 400 }
        );
      }
      if (!n.source || typeof n.source !== "string") {
        return NextResponse.json(
          { error: `notifications[${i}].source is required` },
          { status: 400 }
        );
      }
    }

    // Create all notifications
    const created = await db.$transaction(
      notifications.map((n: Record<string, unknown>) =>
        db.notification.create({
          data: {
            userId,
            title: n.title as string,
            body: n.body as string,
            source: n.source as string,
            sourceIcon: (n.sourceIcon as string) || null,
            platform: (n.platform as string) || null,
            packageName: (n.packageName as string) || null,
            bigText: (n.bigText as string) || null,
            subText: (n.subText as string) || null,
            orderValue: typeof n.orderValue === "number" ? n.orderValue : null,
            pickupLocation: (n.pickupLocation as string) || null,
            dropoffLocation: (n.dropoffLocation as string) || null,
            distance: (n.distance as string) || null,
            category: (n.category as string) || null,
            deviceId: deviceId || null,
            receivedAt: n.receivedAt ? new Date(n.receivedAt as string) : null,
          },
        })
      )
    );

    // Update device last active time if deviceId provided
    if (deviceId) {
      await db.deviceAuth.updateMany({
        where: { deviceId },
        data: { lastActiveAt: new Date() },
      }).catch(() => {
        // Ignore if device not found
      });
    }

    return NextResponse.json({
      success: true,
      created: created.length,
      ids: created.map((n: { id: string }) => n.id),
    }, { status: 201 });
  } catch (error) {
    console.error("[API] Error creating batch notifications:", error);
    return NextResponse.json(
      { error: "Failed to create batch notifications" },
      { status: 500 }
    );
  }
}
