import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/notifications
 * List the authenticated user's notifications with optional filters.
 * Query params: source, isRead, page, limit
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
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { userId: session.user.id };
    if (source && source !== "all") where.source = source;
    if (isRead !== null && isRead !== undefined && isRead !== "") where.isRead = isRead === "true";

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

    return NextResponse.json({
      notifications,
      total,
      page,
      limit,
      unreadCount,
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
 * Create a notification for the authenticated user (for testing).
 * Body: { title, body, source, sourceIcon? }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, body: messageBody, source, sourceIcon } = body;

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
        userId: session.user.id,
        title,
        body: messageBody,
        source,
        sourceIcon: sourceIcon || null,
      },
    });

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    console.error("[API] Error creating notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
