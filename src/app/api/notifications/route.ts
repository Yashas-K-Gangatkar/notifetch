import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/notifications
 * List the authenticated user's notifications with optional filters.
 * Query params: source, isRead, category, platform, page, limit
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
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

    const where: Record<string, unknown> = { userId: session.user.id };
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
      where: { userId: session.user.id, isRead: false },
    });

    // Get platform stats
    const platformStats = await db.notification.groupBy({
      by: ["platform"],
      where: { userId: session.user.id, platform: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    // Get today's stats
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCount = await db.notification.count({
      where: {
        userId: session.user.id,
        createdAt: { gte: todayStart },
      },
    });

    const todayEarnings = await db.notification.aggregate({
      where: {
        userId: session.user.id,
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
    // Try NextAuth session first (web app)
    const session = await getServerSession(authOptions);
    let userId: string | null = session?.user?.id || null;

    // If no session, try device auth (Android app)
    if (!userId) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        // Check if it's a device ID based token
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
          // Device exists but not linked to user - store notification with device ref
          // For now, we'll still create the notification but need a userId
          // Create a temporary user or link later
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
    } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }
    if (!messageBody || typeof messageBody !== "string") {
      return NextResponse.json({ error: "body is required" }, { status: 400 });
    }
    if (!source || typeof source !== "string") {
      return NextResponse.json({ error: "source is required" }, { status: 400 });
    }

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
        orderValue: typeof orderValue === "number" ? orderValue : null,
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

/**
 * DELETE /api/notifications
 * Delete ALL notifications for the authenticated user (DPDP Act §8 / GDPR Art. 17).
 * Supports both NextAuth session (web) and Firebase token (Android) auth.
 */
export async function DELETE(request: NextRequest) {
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
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db.notification.deleteMany({
      where: { userId },
    });

    console.log(`[API] Deleted ${result.count} notifications for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.count} notifications`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("[API] Error deleting notifications:", error);
    return NextResponse.json(
      { error: "Failed to delete notifications" },
      { status: 500 }
    );
  }
}
