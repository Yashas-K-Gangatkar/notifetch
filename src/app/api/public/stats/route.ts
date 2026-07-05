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
  /**
   * v2.9.60 SECURITY HARDENING: `activeUsers` removed from public stats entirely.
   *
   * v2.9.59 rounded it to nearest 100 — but for an early-stage app, even
   * rounded numbers leak competitive intel. "100 active users" vs "200" vs
   * "300" tells a competitor exactly where NotiFetch is in the growth curve.
   *
   * Replacement strategy: the landing page now shows a coarse qualitative
   * label ("Join hundreds of active gig workers") instead of a number.
   * The internal dashboard (auth-gated) still shows the precise count.
   *
   * The field is kept in the response (always 0) for backwards compat with
   * older app clients that parse the JSON. The web landing page no longer
   * reads it.
   */
  activeUsers: number; // DEPRECATED — always 0. Do not consume.
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

    // v2.9.60: Dropped the activeUsers query entirely — we no longer expose
    // this number publicly (see interface comment above). This also saves a
    // potentially expensive DISTINCT query on every stats refresh.
    const [totalNotifications, notificationsToday, topCategoriesRaw] = await Promise.all([
      db.notification.count(),
      db.notification.count({
        where: { createdAt: { gte: todayStart } },
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
      // v2.9.60: Always 0. Kept for backwards compat with old app clients.
      activeUsers: 0,
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
