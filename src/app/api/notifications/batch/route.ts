import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyFirebaseToken, getOrCreateUserFromFirebase } from "@/lib/firebase-admin";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { audit } from "@/lib/audit";

/**
 * Authenticate via NextAuth session or Firebase Bearer token.
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
    const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
    if (contentLength > 2_000_000) { // 2 MB hard cap
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting: 10 requests per minute per user for batch
    const limiter = checkRateLimit("notifications.batch", userId, 10);
    if (!limiter.allowed) {
      await audit({
        userId,
        action: "notification.batch.rejected.rate_limit",
        entity: "notification",
        details: "Batch notification rate limit exceeded",
      });
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429, headers: { "Retry-After": "60" } }
      );
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
      if (n.title.length > 255) {
        await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: `notifications[${i}].title too long` });
        return NextResponse.json({ error: `notifications[${i}].title is too long` }, { status: 400 });
      }
      if (!n.body || typeof n.body !== "string") {
        return NextResponse.json(
          { error: `notifications[${i}].body is required` },
          { status: 400 }
        );
      }
      if (n.body.length > 2048) {
        await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: `notifications[${i}].body too long` });
        return NextResponse.json({ error: `notifications[${i}].body is too long` }, { status: 400 });
      }
      if (!n.source || typeof n.source !== "string") {
        return NextResponse.json(
          { error: `notifications[${i}].source is required` },
          { status: 400 }
        );
      }
      if (n.source.length > 100) {
        await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: `notifications[${i}].source too long` });
        return NextResponse.json({ error: `notifications[${i}].source is too long` }, { status: 400 });
      }

      // Optional fields length validation
      const limits: Record<string, number> = {
        bigText: 4096, subText: 4096,
        pickupLocation: 500, dropoffLocation: 500, distance: 500,
        platform: 100, packageName: 100, category: 100, sourceIcon: 100
      };

      for (const [field, limit] of Object.entries(limits)) {
        if (n[field] && typeof n[field] === "string" && n[field].length > limit) {
          await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: `notifications[${i}].${field} too long` });
          return NextResponse.json({ error: `notifications[${i}].${field} is too long` }, { status: 400 });
        }
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
