import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyFirebaseToken, getOrCreateUserFromFirebase } from "@/lib/firebase-admin";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { audit } from "@/lib/audit";

/**
 * Authenticate a request via NextAuth session or Firebase Bearer token.
 * Returns userId or null.
 */
async function authenticateRequest(request: Request): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const idToken = authHeader.substring(7);
    const firebaseUid = await verifyFirebaseToken(idToken);
    if (firebaseUid) {
      try {
        const userInfo = await getOrCreateUserFromFirebase(firebaseUid, undefined);
        if (userInfo) return userInfo.id;
      } catch { /* fall through */ }
    }
  }
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}

/**
 * GET /api/notifications
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

    const unreadCount = await db.notification.count({ where: { userId, isRead: false } });
    const platformStats = await db.notification.groupBy({
      by: ["platform"],
      where: { userId, platform: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCount = await db.notification.count({ where: { userId, createdAt: { gte: todayStart } } });
    const todayEarnings = await db.notification.aggregate({
      where: { userId, createdAt: { gte: todayStart }, orderValue: { not: null } },
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
      platformStats: platformStats.map((s) => ({ platform: s.platform, count: s._count.id })),
    });
  } catch (error) {
    console.error("[API] Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

/**
 * POST /api/notifications
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Rate limiting (60 requests / minute / user) ───────────────────────
    if (!rateLimit("notification-single", userId, 60, 60 * 1000)) {
      await audit({
        userId,
        action: "notification.rejected.rate_limit",
        entity: "notification",
        details: "Single rate limit exceeded"
      });
      return NextResponse.json({ error: "Rate limit exceeded" }, {
        status: 429,
        headers: { "Retry-After": "60" }
      });
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

    // Required fields validation
    if (!title || typeof title !== "string" || title.length > 255) {
      await audit({ userId, action: "notification.rejected.invalid", entity: "notification", details: "Title invalid/too long" });
      return NextResponse.json({ error: "title is required (max 255)" }, { status: 400 });
    }
    if (!messageBody || typeof messageBody !== "string" || messageBody.length > 2048) {
      await audit({ userId, action: "notification.rejected.invalid", entity: "notification", details: "Body invalid/too long" });
      return NextResponse.json({ error: "body is required (max 2048)" }, { status: 400 });
    }
    if (!source || typeof source !== "string" || source.length > 100) {
      await audit({ userId, action: "notification.rejected.invalid", entity: "notification", details: "Source invalid/too long" });
      return NextResponse.json({ error: "source is required (max 100)" }, { status: 400 });
    }

    // Optional fields length limits
    if (bigText && bigText.length > 4096) {
      await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: "bigText too long" });
      return NextResponse.json({ error: "bigText too long" }, { status: 400 });
    }
    if (subText && subText.length > 4096) {
      await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: "subText too long" });
      return NextResponse.json({ error: "subText too long" }, { status: 400 });
    }
    if (pickupLocation && pickupLocation.length > 500) {
      await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: "pickupLocation too long" });
      return NextResponse.json({ error: "pickupLocation too long" }, { status: 400 });
    }
    if (dropoffLocation && dropoffLocation.length > 500) {
      await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: "dropoffLocation too long" });
      return NextResponse.json({ error: "dropoffLocation too long" }, { status: 400 });
    }
    if (distance && distance.length > 500) {
      await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: "distance too long" });
      return NextResponse.json({ error: "distance too long" }, { status: 400 });
    }
    if (platform && platform.length > 100) {
      await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: "platform too long" });
      return NextResponse.json({ error: "platform too long" }, { status: 400 });
    }
    if (packageName && packageName.length > 100) {
      await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: "packageName too long" });
      return NextResponse.json({ error: "packageName too long" }, { status: 400 });
    }
    if (category && category.length > 100) {
      await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: "category too long" });
      return NextResponse.json({ error: "category too long" }, { status: 400 });
    }
    if (sourceIcon && sourceIcon.length > 100) {
      await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: "sourceIcon too long" });
      return NextResponse.json({ error: "sourceIcon too long" }, { status: 400 });
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
        receivedAt: (receivedAt && !isNaN(Date.parse(receivedAt))) ? new Date(receivedAt) : null,
      },
    });

    return NextResponse.json({ success: true, notification }, { status: 201 });
  } catch (error) {
    console.error("[API] Error creating notification:", error);
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}
