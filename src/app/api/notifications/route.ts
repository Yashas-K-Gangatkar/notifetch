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

/**
 * GET /api/notifications
 * List the authenticated user's notifications with optional filters.
 * Query params: source, isRead, category, platform, page, limit
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source");
    const isRead = searchParams.get("isRead");
    const category = searchParams.get("category");
    const platform = searchParams.get("platform");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { userId };
    if (source && source !== "all") where.source = source;
    if (isRead !== null && isRead !== undefined && isRead !== "") where.isRead = isRead === "true";
    if (category) where.category = category;
    if (platform) where.platform = platform;

    const [notifications, total] = await Promise.all([
      db.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.notification.count({ where }),
    ]);

    // Get unread count
    const unreadCount = await db.notification.count({
      where: { userId, isRead: false },
    });

    // Get platform stats
    const platformStats = await db.notification.groupBy({
      by: ["platform"],
      where: { userId, platform: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    // Get today's stats
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCount = await db.notification.count({
      where: {
        userId,
        createdAt: { gte: todayStart },
      },
    });

    const todayEarnings = await db.notification.aggregate({
      where: {
        userId,
        createdAt: { gte: todayStart },
        orderValue: { not: null },
      },
      _sum: { orderValue: true },
    });

    return NextResponse.json({
      notifications,
      total,
      page,
      limit,
      unreadCount,
      todayCount,
      todayEarnings: todayEarnings._sum.orderValue || 0,
      platformStats: platformStats.map((s) => ({
        platform: s.platform,
        count: s._count.id,
      })),
    });
  } catch (error) {
    console.error("[API] Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications
 * Create a notification. Supports both web app (NextAuth session) and
 * Android app (Firebase token / device auth) authentication.
 *
 * Android app sends:
 * { source, platform, title, body, orderValue?, pickupLocation?,
 *   dropoffLocation?, distance?, receivedAt?, packageName?,
 *   category?, bigText?, subText? }
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const result = notificationSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: result.error.format() },
        { status: 400 }
      );
    }

    const {
      title,
      body: messageBody,
      source,
      sourceIcon,
      platform,
      packageName,
      bigText,
      subText,
      orderValue,
      pickupLocation,
      dropoffLocation,
      distance,
      category,
      receivedAt,
      deviceId,
    } = result.data;

    const notification = await db.notification.create({
      data: {
        userId,
        title,
        body: messageBody,
        source,
        sourceIcon: sourceIcon || null,
        platform: platform || null,
        packageName: packageName || null,
        bigText: bigText || null,
        subText: subText || null,
        orderValue: orderValue || null,
        pickupLocation: pickupLocation || null,
        dropoffLocation: dropoffLocation || null,
        distance: distance || null,
        category: category || null,
        deviceId: deviceId || null,
        receivedAt: receivedAt ? new Date(receivedAt) : null,
      },
    });

    return NextResponse.json({ success: true, notification }, { status: 201 });
  } catch (error) {
    console.error("[API] Error creating notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
