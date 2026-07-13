import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

/**
 * GET /api/user
 * Return the current authenticated user's profile.
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await authenticateRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
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
    const userId = await authenticateRequest(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Whitelist updatable fields with their expected types
    // v2.9.81 SECURITY FIX: Previously the whitelist allowed any value type —
    // user could send {darkMode: "yes", minValue: "abc"} and corrupt the DB.
    // Now each field is type-checked before being added to updateData.
    const STRING_FIELDS = {
      name: 100,
      phone: 20,
      region: 10,
      currency: 3,        // ISO 4217
      language: 10,       // BCP 47 like "en", "hi-IN"
      distanceUnit: 5,    // "mi" or "km"
    } as const;

    const BOOLEAN_FIELDS = [
      "rideSafeMode",
      "soundAlerts",
      "vibration",
      "voiceAlerts",
      "autoAccept",
      "darkMode",
    ] as const;

    const NUMBER_FIELDS = {
      minValue: { min: 0, max: 1_000_000 },
      maxDistance: { min: 0, max: 100_000 },
    } as const;

    const updateData: Record<string, unknown> = {};

    // Validate string fields
    for (const [field, maxLen] of Object.entries(STRING_FIELDS)) {
      if (field in body) {
        const val = body[field];
        if (typeof val !== "string") {
          return NextResponse.json(
            { error: `${field} must be a string` },
            { status: 400 }
          );
        }
        if (val.length > maxLen) {
          return NextResponse.json(
            { error: `${field} too long (max ${maxLen} chars)` },
            { status: 400 }
          );
        }
        if (field === "currency" && val && !/^[A-Z]{3}$/.test(val.toUpperCase())) {
          return NextResponse.json(
            { error: "currency must be a 3-letter ISO 4217 code" },
            { status: 400 }
          );
        }
        updateData[field] = field === "currency" ? val.toUpperCase() : val;
      }
    }

    // Validate boolean fields
    for (const field of BOOLEAN_FIELDS) {
      if (field in body) {
        if (typeof body[field] !== "boolean") {
          return NextResponse.json(
            { error: `${field} must be a boolean` },
            { status: 400 }
          );
        }
        updateData[field] = body[field];
      }
    }

    // Validate number fields
    for (const [field, bounds] of Object.entries(NUMBER_FIELDS)) {
      if (field in body) {
        const val = body[field];
        const num = typeof val === "number" ? val : parseFloat(String(val));
        if (!Number.isFinite(num) || num < bounds.min || num > bounds.max) {
          return NextResponse.json(
            { error: `${field} must be a finite number between ${bounds.min} and ${bounds.max}` },
            { status: 400 }
          );
        }
        updateData[field] = num;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
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
        userId,
        action: "UPDATE_SETTINGS",
        entity: "User",
        entityId: userId,
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
