import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/platforms
 * List the authenticated user's notification sources.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sources = await db.notificationSource.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ sources });
  } catch (error) {
    console.error("[API] Error fetching notification sources:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification sources" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/platforms
 * Enable a notification source for the authenticated user.
 *
 * Body: { platformId, platformName, category, packageName? }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { platformId, platformName, category, packageName } = body;

    if (!platformId || !platformName || !category) {
      return NextResponse.json(
        { error: "platformId, platformName, and category are required" },
        { status: 400 }
      );
    }

    // Check if already exists
    const existing = await db.notificationSource.findUnique({
      where: {
        userId_platformId: {
          userId: session.user.id,
          platformId,
        },
      },
    });

    if (existing) {
      // Update existing source — re-enable listening
      const updated = await db.notificationSource.update({
        where: { id: existing.id },
        data: {
          listening: true,
          packageName: packageName ?? existing.packageName,
          lastSyncAt: new Date(),
        },
      });

      return NextResponse.json({ source: updated });
    }

    // Create new notification source
    const source = await db.notificationSource.create({
      data: {
        userId: session.user.id,
        platformId,
        platformName,
        category,
        listening: true,
        packageName,
        lastSyncAt: new Date(),
      },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ENABLE_NOTIFICATION_SOURCE",
        entity: "NotificationSource",
        entityId: source.id,
        details: JSON.stringify({ platformId, platformName, category, packageName }),
      },
    });

    return NextResponse.json({ source }, { status: 201 });
  } catch (error) {
    console.error("[API] Error enabling notification source:", error);
    return NextResponse.json(
      { error: "Failed to enable notification source" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/platforms
 * Disable a notification source for the authenticated user.
 *
 * Body: { platformId } or query param ?platformId=...
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Support both body and query param
    let platformId: string | undefined;

    const url = new URL(request.url);
    platformId = url.searchParams.get("platformId") ?? undefined;

    if (!platformId) {
      const body = await request.json().catch(() => ({}));
      platformId = body.platformId;
    }

    if (!platformId) {
      return NextResponse.json(
        { error: "platformId is required" },
        { status: 400 }
      );
    }

    const existing = await db.notificationSource.findUnique({
      where: {
        userId_platformId: {
          userId: session.user.id,
          platformId,
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Notification source not found" },
        { status: 404 }
      );
    }

    // Set listening to false instead of deleting the record
    await db.notificationSource.update({
      where: { id: existing.id },
      data: {
        listening: false,
      },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DISABLE_NOTIFICATION_SOURCE",
        entity: "NotificationSource",
        entityId: existing.id,
        details: JSON.stringify({ platformId }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Error disabling notification source:", error);
    return NextResponse.json(
      { error: "Failed to disable notification source" },
      { status: 500 }
    );
  }
}
