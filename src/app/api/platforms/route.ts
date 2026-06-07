import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/platforms
 * List the authenticated user's platform connections.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const connections = await db.platformConnection.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ connections });
  } catch (error) {
    console.error("[API] Error fetching platforms:", error);
    return NextResponse.json(
      { error: "Failed to fetch platform connections" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/platforms
 * Connect a new platform for the authenticated user.
 *
 * Body: { platformId, platformName, category, accessToken?, refreshToken? }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { platformId, platformName, category, accessToken, refreshToken } = body;

    if (!platformId || !platformName || !category) {
      return NextResponse.json(
        { error: "platformId, platformName, and category are required" },
        { status: 400 }
      );
    }

    // Check if already connected
    const existing = await db.platformConnection.findUnique({
      where: {
        userId_platformId: {
          userId: session.user.id,
          platformId,
        },
      },
    });

    if (existing) {
      // Update existing connection
      const updated = await db.platformConnection.update({
        where: { id: existing.id },
        data: {
          connected: true,
          accessToken: accessToken ?? existing.accessToken,
          refreshToken: refreshToken ?? existing.refreshToken,
          lastSyncAt: new Date(),
        },
      });

      return NextResponse.json({ connection: updated });
    }

    // Create new connection
    const connection = await db.platformConnection.create({
      data: {
        userId: session.user.id,
        platformId,
        platformName,
        category,
        connected: true,
        accessToken,
        refreshToken,
        lastSyncAt: new Date(),
      },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "CONNECT_PLATFORM",
        entity: "PlatformConnection",
        entityId: connection.id,
        details: JSON.stringify({ platformId, platformName, category }),
      },
    });

    return NextResponse.json({ connection }, { status: 201 });
  } catch (error) {
    console.error("[API] Error connecting platform:", error);
    return NextResponse.json(
      { error: "Failed to connect platform" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/platforms
 * Disconnect a platform for the authenticated user.
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

    const existing = await db.platformConnection.findUnique({
      where: {
        userId_platformId: {
          userId: session.user.id,
          platformId,
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Platform connection not found" },
        { status: 404 }
      );
    }

    await db.platformConnection.update({
      where: { id: existing.id },
      data: {
        connected: false,
        accessToken: null,
        refreshToken: null,
      },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DISCONNECT_PLATFORM",
        entity: "PlatformConnection",
        entityId: existing.id,
        details: JSON.stringify({ platformId }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Error disconnecting platform:", error);
    return NextResponse.json(
      { error: "Failed to disconnect platform" },
      { status: 500 }
    );
  }
}
