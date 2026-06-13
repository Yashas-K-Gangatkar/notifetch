import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

/**
 * GET /api/preferences
 * Get the authenticated user's notification preferences.
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let preferences = await db.preferences.findUnique({
      where: { userId },
    });

    // Create default preferences if not exists
    if (!preferences) {
      preferences = await db.preferences.create({
        data: { userId },
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
    const userId = await authenticateRequest(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const allowedFields = [
      "darkMode",
      "notificationsEnabled",
      "swiggyEnabled",
      "zomatoEnabled",
      "amazonEnabled",
      "platformToggles",
    ] as const;

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        // Validate platformToggles is a proper object
        if (field === "platformToggles") {
          if (typeof body[field] === "object" && body[field] !== null && !Array.isArray(body[field])) {
            updateData[field] = body[field];
          }
        } else if (typeof body[field] === "boolean") {
          updateData[field] = body[field];
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const preferences = await db.preferences.upsert({
      where: { userId },
      update: updateData,
      create: { userId, ...updateData },
    });

    // Also update the user's darkMode field
    if ("darkMode" in updateData) {
      await db.user.update({
        where: { id: userId },
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
