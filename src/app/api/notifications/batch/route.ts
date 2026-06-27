import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { z } from "zod";

// Zod schema for notification validation to prevent DoS and DB bloat
const notificationSchema = z.object({
  title: z.string().min(1).max(255),
  body: z.string().min(1).max(2048),
  source: z.string().min(1).max(100),
  sourceIcon: z.string().max(255).optional().nullable(),
  platform: z.string().max(100).optional().nullable(),
  packageName: z.string().max(255).optional().nullable(),
  bigText: z.string().max(4096).optional().nullable(),
  subText: z.string().max(1000).optional().nullable(),
  orderValue: z.number().optional().nullable(),
  pickupLocation: z.string().max(512).optional().nullable(),
  dropoffLocation: z.string().max(512).optional().nullable(),
  distance: z.string().max(100).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  receivedAt: z.string().optional().nullable(),
  deviceId: z.string().max(255).optional().nullable(),
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
        { error: "Invalid request payload", details: result.error.format() },
        { status: 400 }
      );
    }

    const { notifications, deviceId } = result.data;

    // Create all notifications in a single batch operation for performance
    const created = await db.notification.createManyAndReturn({
      data: notifications.map((n) => ({
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
      })),
      skipDuplicates: false,
    });

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
