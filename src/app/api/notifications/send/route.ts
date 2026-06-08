import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendFCMMessage } from "@/lib/firebase-admin";

/**
 * POST /api/notifications/send
 *
 * Send a push notification to a specific user.
 * Requires authentication. Takes { userId, title, body, data? }.
 * Looks up the target user's FCM token from the database.
 *
 * Body: { userId: string, title: string, body: string, data?: Record<string, string> }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, title, body: messageBody, data } = body;

    // Validate required fields
    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "title is required" },
        { status: 400 }
      );
    }

    if (!messageBody || typeof messageBody !== "string") {
      return NextResponse.json(
        { error: "body is required" },
        { status: 400 }
      );
    }

    // Look up the target user's FCM token
    const targetUser = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, fcmToken: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Target user not found" },
        { status: 404 }
      );
    }

    if (!targetUser.fcmToken) {
      return NextResponse.json(
        {
          error:
            "Target user does not have a registered FCM token. The user must enable push notifications first.",
        },
        { status: 400 }
      );
    }

    // Send the push notification via Firebase Admin
    const result = await sendFCMMessage({
      token: targetUser.fcmToken,
      title,
      body: messageBody,
      data: data || {},
    });

    // If the token is invalid, clear it from the database
    if (!result.success && (result as Record<string, unknown>).tokenInvalid) {
      console.warn(
        "[API] FCM token is invalid for user:",
        userId,
        "— clearing token"
      );
      await db.user.update({
        where: { id: userId },
        data: { fcmToken: null },
      });
    }

    // Log the notification send attempt
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: result.success ? "SEND_PUSH_NOTIFICATION" : "SEND_PUSH_NOTIFICATION_FAILED",
        entity: "User",
        entityId: userId,
        details: JSON.stringify({
          title,
          body: messageBody,
          success: result.success,
          error: result.error || null,
        }),
      },
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Failed to send push notification",
          details: result.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      message: "Push notification sent successfully",
    });
  } catch (error) {
    console.error("[API] Error sending push notification:", error);
    return NextResponse.json(
      { error: "Failed to send push notification" },
      { status: 500 }
    );
  }
}
