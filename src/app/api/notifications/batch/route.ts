import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { z } from "zod";

const notificationSchema = z.object({
  title: z.string().min(1).max(255),
  body: z.string().min(1).max(2000),
  source: z.string().min(1).max(100),
  sourceIcon: z.string().max(500).optional().nullable(),
  platform: z.string().max(100).optional().nullable(),
  packageName: z.string().max(255).optional().nullable(),
  bigText: z.string().max(5000).optional().nullable(),
  subText: z.string().max(500).optional().nullable(),
  orderValue: z.number().optional().nullable(),
  pickupLocation: z.string().max(500).optional().nullable(),
  dropoffLocation: z.string().max(500).optional().nullable(),
  distance: z.string().max(100).optional().nullable(),
  category: z.string().max(50).optional().nullable(),
  receivedAt: z.string().datetime({ offset: true }).optional().nullable(),
});

const batchSchema = z.object({
  notifications: z.array(notificationSchema).min(1).max(100),
  deviceId: z.string().max(255).optional().nullable(),
});

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
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const result = batchSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: result.error.format() },
        { status: 400 }
      );
    }

    const { notifications, deviceId } = result.data;

    // Create all notifications
    const created = await db.$transaction(
      notifications.map((n) =>
        db.notification.create({
          data: {
            userId,
            title: n.title,
            body: n.body,
            source: n.source,
            sourceIcon: n.sourceIcon || null,
            platform: n.platform || null,
            packageName: n.packageName || null,
            bigText: n.bigText || null,
            subText: n.subText || null,
            orderValue: n.orderValue || null,
            pickupLocation: n.pickupLocation || null,
            dropoffLocation: n.dropoffLocation || null,
            distance: n.distance || null,
            category: n.category || null,
            deviceId: deviceId || null,
            receivedAt: n.receivedAt ? new Date(n.receivedAt) : null,
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
