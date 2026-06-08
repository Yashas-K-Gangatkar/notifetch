import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * POST /api/notifications/register-token
 *
 * Register an FCM push token for the authenticated user.
 * This token is saved to the User record and used for sending push notifications.
 *
 * Body: { fcmToken: string }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fcmToken } = body;

    if (!fcmToken || typeof fcmToken !== "string") {
      return NextResponse.json(
        { error: "fcmToken is required and must be a string" },
        { status: 400 }
      );
    }

    // Validate token format (FCM tokens are typically long strings)
    if (fcmToken.length < 10) {
      return NextResponse.json(
        { error: "Invalid FCM token format" },
        { status: 400 }
      );
    }

    // Update the user's FCM token
    await db.user.update({
      where: { id: session.user.id },
      data: { fcmToken },
    });

    // Log the token registration
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "REGISTER_FCM_TOKEN",
        entity: "User",
        entityId: session.user.id,
        details: "FCM push token registered/updated",
      },
    });

    console.log(
      "[API] FCM token registered for user:",
      session.user.id,
      "token:",
      fcmToken.substring(0, 20) + "..."
    );

    return NextResponse.json({
      success: true,
      message: "FCM token registered successfully",
    });
  } catch (error) {
    console.error("[API] Error registering FCM token:", error);
    return NextResponse.json(
      { error: "Failed to register FCM token" },
      { status: 500 }
    );
  }
}
