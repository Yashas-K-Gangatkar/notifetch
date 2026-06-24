import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyFirebaseToken, getOrCreateUserFromFirebase } from "@/lib/firebase-admin";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
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
 */
export async function POST(request: NextRequest) {
  try {
    // ── Payload size guard (2MB) ──────────────────────────────────────────
    const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
    if (contentLength > 2_000_000) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Rate limiting (10 requests / minute / user) ───────────────────────
    if (!rateLimit("notification-batch", userId, 10, 60 * 1000)) {
      await audit({
        userId,
        action: "notification.rejected.rate_limit",
        entity: "notification",
        details: "Batch rate limit exceeded"
      });
      return NextResponse.json({ error: "Rate limit exceeded" }, {
        status: 429,
        headers: { "Retry-After": "60" }
      });
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

      // Required fields
      if (!n.title || typeof n.title !== "string" || n.title.length > 255) {
        await audit({ userId, action: "notification.rejected.invalid", entity: "notification", details: `Batch: notifications[${i}].title invalid/too long` });
        return NextResponse.json({ error: `notifications[${i}].title is required (max 255)` }, { status: 400 });
      }
      if (!n.body || typeof n.body !== "string" || n.body.length > 2048) {
        await audit({ userId, action: "notification.rejected.invalid", entity: "notification", details: `Batch: notifications[${i}].body invalid/too long` });
        return NextResponse.json({ error: `notifications[${i}].body is required (max 2048)` }, { status: 400 });
      }
      if (!n.source || typeof n.source !== "string" || n.source.length > 100) {
        await audit({ userId, action: "notification.rejected.invalid", entity: "notification", details: `Batch: notifications[${i}].source invalid/too long` });
        return NextResponse.json({ error: `notifications[${i}].source is required (max 100)` }, { status: 400 });
      }

      // Optional fields length limits
      if (n.bigText && n.bigText.length > 4096) {
        await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: `Batch: notifications[${i}].bigText too long` });
        return NextResponse.json({ error: `notifications[${i}].bigText too long` }, { status: 400 });
      }
      if (n.subText && n.subText.length > 4096) {
        await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: `Batch: notifications[${i}].subText too long` });
        return NextResponse.json({ error: `notifications[${i}].subText too long` }, { status: 400 });
      }
      if (n.pickupLocation && n.pickupLocation.length > 500) {
        await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: `Batch: notifications[${i}].pickupLocation too long` });
        return NextResponse.json({ error: `notifications[${i}].pickupLocation too long` }, { status: 400 });
      }
      if (n.dropoffLocation && n.dropoffLocation.length > 500) {
        await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: `Batch: notifications[${i}].dropoffLocation too long` });
        return NextResponse.json({ error: `notifications[${i}].dropoffLocation too long` }, { status: 400 });
      }
      if (n.distance && n.distance.length > 500) {
        await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: `Batch: notifications[${i}].distance too long` });
        return NextResponse.json({ error: `notifications[${i}].distance too long` }, { status: 400 });
      }
      if (n.platform && n.platform.length > 100) {
        await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: `Batch: notifications[${i}].platform too long` });
        return NextResponse.json({ error: `notifications[${i}].platform too long` }, { status: 400 });
      }
      if (n.packageName && n.packageName.length > 100) {
        await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: `Batch: notifications[${i}].packageName too long` });
        return NextResponse.json({ error: `notifications[${i}].packageName too long` }, { status: 400 });
      }
      if (n.category && n.category.length > 100) {
        await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: `Batch: notifications[${i}].category too long` });
        return NextResponse.json({ error: `notifications[${i}].category too long` }, { status: 400 });
      }
      if (n.sourceIcon && n.sourceIcon.length > 100) {
        await audit({ userId, action: "notification.rejected.oversized", entity: "notification", details: `Batch: notifications[${i}].sourceIcon too long` });
        return NextResponse.json({ error: `notifications[${i}].sourceIcon too long` }, { status: 400 });
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
      }).catch(() => {});
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
