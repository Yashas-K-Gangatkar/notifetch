import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/public/stats
 *
 * Public, anonymized aggregate stats for the NotiFetch landing page
 * (the "X notifications captured, Y platforms supported" counters).
 *
 * NO user-specific data is exposed. NO auth required.
 *
 * Caching: 5-minute in-memory cache to handle landing-page traffic spikes
 * without overwhelming the database.
 */

interface PublicStats {
  totalNotificationsCaptured: number;
  platformsSupported: number;
  activeUsers: number; // users active in last 7 days
  notificationsToday: number;
  topCategories: Array<{ category: string; count: number }>;
  updatedAt: string;
}

let cachedStats: { data: PublicStats; cachedAt: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    // Return cached stats if fresh
    if (cachedStats && Date.now() - cachedStats.cachedAt < CACHE_TTL_MS) {
      return NextResponse.json(cachedStats.data, {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      });
    }

    // Compute fresh stats
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [
      totalNotifications,
      notificationsToday,
      activeUsers,
      topCategoriesRaw,
    ] = await Promise.all([
      db.notification.count(),
      db.notification.count({
        where: { createdAt: { gte: todayStart } },
      }),
      // Active users = users who have a notification in the last 7 days
      db.notification.findMany({
        where: { createdAt: { gte: weekAgo } },
        select: { userId: true },
        distinct: ["userId"],
      }),
      db.notification.groupBy({
        by: ["category"],
        where: {
          category: { not: null },
          createdAt: { gte: weekAgo },
        },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 6,
      }),
    ]);

    // Count platforms from the NotificationSource table (configured platforms)
    // Fall back to a constant if the table is empty (early-stage deployment)
    const configuredPlatforms = await db.notificationSource
      .findMany({
        select: { platformId: true },
        distinct: ["platformId"],
      })
      .catch(() => []);
    const platformsSupported = configuredPlatforms.length || 119; // fallback to documented count

    const stats: PublicStats = {
      totalNotificationsCaptured: totalNotifications,
      platformsSupported,
      activeUsers: activeUsers.length,
      notificationsToday,
      topCategories: topCategoriesRaw.map((c) => ({
        category: c.category || "Unknown",
        count: c._count.id,
      })),
      updatedAt: new Date().toISOString(),
    };

    // Update cache
    cachedStats = { data: stats, cachedAt: Date.now() };

    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("[API] Error fetching public stats:", error);

    // Fallback to hardcoded marketing numbers if DB is unreachable
    return NextResponse.json(
      {
        totalNotificationsCaptured: 0,
        platformsSupported: 119,
        activeUsers: 0,
        notificationsToday: 0,
        topCategories: [],
        updatedAt: new Date().toISOString(),
        note: "Stats temporarily unavailable",
      },
      { status: 200 }
    );
  }
}
