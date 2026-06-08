import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/preferences
 * Get the authenticated user's notification preferences.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let preferences = await db.preferences.findUnique({
      where: { userId: session.user.id },
    });

    // Create default preferences if not exists
    if (!preferences) {
      preferences = await db.preferences.create({
        data: { userId: session.user.id },
      });
    }

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error("[API] Error fetching preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/preferences
 * Update the authenticated user's notification preferences.
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const allowedFields = [
      "darkMode",
      "notificationsEnabled",
      "swiggyEnabled",
      "zomatoEnabled",
      "amazonEnabled",
    ] as const;

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body && typeof body[field] === "boolean") {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const preferences = await db.preferences.upsert({
      where: { userId: session.user.id },
      update: updateData,
      create: { userId: session.user.id, ...updateData },
    });

    // Also update the user's darkMode field
    if ("darkMode" in updateData) {
      await db.user.update({
        where: { id: session.user.id },
        data: { darkMode: updateData.darkMode as boolean },
      });
    }

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error("[API] Error updating preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
