import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/health
 *
 * Lightweight health check endpoint for:
 *   - Post-deploy smoke tests (GitHub Actions pings this after every deploy)
 *   - Uptime monitoring (UptimeRobot, Better Stack, etc.)
 *   - Vercel/Load balancer health checks
 *
 * Returns 200 if ALL critical systems are up, 503 if any are down.
 *
 * Checks:
 *   1. Database connectivity (Prisma can connect + run a trivial query)
 *   2. (Future) Redis cache
 *   3. (Future) Firebase Admin SDK initialized
 *
 * Response body includes individual check statuses so dashboards can show
 * which component is failing. The endpoint itself is unauthenticated and
 * returns no sensitive data — safe to expose publicly.
 *
 * Caching: none. Each call runs a real DB query. Keep this endpoint cheap
 * (we use count() on a tiny table, not a full scan).
 */
export async function GET() {
  const checks: Record<string, { status: "up" | "down"; latencyMs?: number; error?: string }> = {};
  let allHealthy = true;

  // ── Check 1: Database ──────────────────────────────────────────────────
  const dbStart = Date.now();
  try {
    // Use a trivial query — count on NotificationSource (small table, indexed)
    await db.notificationSource.count({ take: 1 });
    checks.database = {
      status: "up",
      latencyMs: Date.now() - dbStart,
    };
  } catch (error) {
    // v2.9.81 SECURITY FIX: Don't leak DB error details to the client.
    // Previously the error message (which may include connection string, table
    // names, schema info) was returned in the response body. Now we log it
    // server-side and return a generic message to the client.
    console.error("[health] DB check failed:", error);
    checks.database = {
      status: "down",
      error: "Database connection failed",
    };
    allHealthy = false;
  }

  // ── Build response ─────────────────────────────────────────────────────
  const response = {
    status: allHealthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "unknown",
    environment: process.env.NODE_ENV || "unknown",
    checks,
  };

  return NextResponse.json(response, {
    status: allHealthy ? 200 : 503,
    headers: {
      // Don't cache health checks — we want fresh data every time
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
