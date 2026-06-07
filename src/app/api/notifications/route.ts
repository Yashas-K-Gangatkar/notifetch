import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * POST /api/notifications
 * Register an FCM push token for the authenticated user.
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

    if (!fcmToken) {
      return NextResponse.json(
        { error: "fcmToken is required" },
        { status: 400 }
      );
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { fcmToken },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "REGISTER_FCM_TOKEN",
        entity: "User",
        entityId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Error registering FCM token:", error);
    return NextResponse.json(
      { error: "Failed to register FCM token" },
      { status: 500 }
    );
  }
}
