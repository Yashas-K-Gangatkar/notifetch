import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/user
 * Return the current authenticated user's profile.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        image: true,
        emailVerified: true,
        phoneVerified: true,
        region: true,
        currency: true,
        language: true,
        distanceUnit: true,
        role: true,
        plan: true,
        stripeCustomerId: true,
        trialEndsAt: true,
        rideSafeMode: true,
        soundAlerts: true,
        vibration: true,
        voiceAlerts: true,
        autoAccept: true,
        minValue: true,
        maxDistance: true,
        darkMode: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[API] Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user
 * Update the current user's settings.
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Whitelist updatable fields
    const allowedFields = [
      "name",
      "phone",
      "region",
      "currency",
      "language",
      "distanceUnit",
      "rideSafeMode",
      "soundAlerts",
      "vibration",
      "voiceAlerts",
      "autoAccept",
      "minValue",
      "maxDistance",
      "darkMode",
    ] as const;

    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        image: true,
        region: true,
        currency: true,
        language: true,
        distanceUnit: true,
        role: true,
        plan: true,
        rideSafeMode: true,
        soundAlerts: true,
        vibration: true,
        voiceAlerts: true,
        autoAccept: true,
        minValue: true,
        maxDistance: true,
        darkMode: true,
        updatedAt: true,
      },
    });

    // Log the update in audit log
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "UPDATE_SETTINGS",
        entity: "User",
        entityId: session.user.id,
        details: JSON.stringify(updateData),
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("[API] Error updating user settings:", error);
    return NextResponse.json(
      { error: "Failed to update user settings" },
      { status: 500 }
    );
  }
}
