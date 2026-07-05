import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { db } from "@/lib/db";

/**
 * POST /api/cron/retention
 *
 * v2.9.60 SECURITY/HARDENING: PII retention cron job.
 *
 * Per the NotiFetch privacy policy (Section: Data Retention):
 *   "We retain your personal data only for as long as necessary to fulfill
 *    the purposes described in this policy."
 *
 * Before this endpoint, notifications were retained FOREVER — even for
 * inactive users who uninstalled the app years ago. This violates:
 *   - DPDP Act Section 7(4) (India — data minimization + storage limitation)
 *   - GDPR Article 5(1)(e) (EU — storage limitation)
 *   - CCPA §1798.100(c) (California — data minimization)
 *
 * This endpoint deletes notifications older than 90 days. The 90-day window
 * was chosen because:
 *   - Gig workers typically need ~30 days of history for monthly earnings reconciliation
 *   - Allowing 90 days gives a 2x safety margin for quarterly review
 *   - Anything older has near-zero user value and high compliance risk
 *
 * Auth: requires CRON_SECRET header matching process.env.CRON_SECRET.
 * Vercel Cron automatically sends this header on every invocation.
 *
 * Schedule: configure in vercel.json — recommended `0 3 * * *` (3 AM UTC daily).
 *
 * Returns: { deleted: number, cutoff: ISOString }
 */
function safeCompareSecret(provided: string, expected: string): boolean {
  if (provided.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  // ── Auth: CRON_SECRET header ───────────────────────────────────────────
  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` automatically.
  // We also accept a plain `x-cron-secret` header for manual invocation.
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("[cron/retention] CRON_SECRET env var is not set — refusing to run");
    return NextResponse.json({ error: "Cron not configured" }, { status: 503 });
  }

  const authHeader = request.headers.get("authorization") || "";
  const xCronSecret = request.headers.get("x-cron-secret") || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : "";

  if (!safeCompareSecret(bearerToken, cronSecret) && !safeCompareSecret(xCronSecret, cronSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Compute cutoff: 90 days ago ───────────────────────────────────────
  const RETENTION_DAYS = 90;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);

  // ── Delete in batches to avoid long-running transactions ──────────────
  // Vercel serverless functions have a 60s default timeout (300s on Pro).
  // A single deleteMany on a 1M-row table would time out. Batch in chunks
  // of 10,000 until no more rows match.
  const BATCH_SIZE = 10_000;
  let totalDeleted = 0;
  let batchesRun = 0;
  const MAX_BATCHES = 30; // safety cap — 30 × 10k = 300k deletes per run

  while (batchesRun < MAX_BATCHES) {
    // Find a batch of IDs to delete. We use findMany + deleteMany (instead
    // of a direct deleteMany with take/limit) because Prisma's deleteMany
    // doesn't support `take` — it would try to delete everything at once.
    const oldNotifications = await db.notification.findMany({
      where: { createdAt: { lt: cutoff } },
      select: { id: true },
      take: BATCH_SIZE,
    });

    if (oldNotifications.length === 0) break;

    const idsToDelete = oldNotifications.map((n) => n.id);
    const result = await db.notification.deleteMany({
      where: { id: { in: idsToDelete } },
    });

    totalDeleted += result.count;
    batchesRun++;

    // If we got fewer than BATCH_SIZE rows, we're done.
    if (oldNotifications.length < BATCH_SIZE) break;
  }

  // ── Also clean up orphaned AuditLogs older than 180 days ──────────────
  // AuditLogs are useful for security review but shouldn't live forever.
  // 180 days = 6 months — long enough to investigate any breach, short
  // enough to avoid being a PII liability.
  const auditCutoff = new Date();
  auditCutoff.setDate(auditCutoff.getDate() - 180);
  const auditResult = await db.auditLog.deleteMany({
    where: { createdAt: { lt: auditCutoff } },
  }).catch(() => ({ count: 0 })); // AuditLog table may not exist in some deployments

  // ── Also clean up expired VerificationTokens ──────────────────────────
  // These should self-expire via TTL but Prisma doesn't enforce that —
  // sweep them here to be sure.
  const tokenResult = await db.verificationToken.deleteMany({
    where: { expires: { lt: new Date() } },
  }).catch(() => ({ count: 0 }));

  console.log(
    `[cron/retention] Deleted ${totalDeleted} notifications older than ${RETENTION_DAYS} days, ` +
    `${auditResult.count} audit logs older than 180 days, ` +
    `${tokenResult.count} expired verification tokens. ` +
    `Batches run: ${batchesRun}/${MAX_BATCHES}.`
  );

  return NextResponse.json({
    success: true,
    deleted: {
      notifications: totalDeleted,
      auditLogs: auditResult.count,
      verificationTokens: tokenResult.count,
    },
    cutoff: cutoff.toISOString(),
    batchesRun,
    ranAt: new Date().toISOString(),
  });
}

// GET handler for health-check / manual testing
export async function GET(request: Request) {
  // Same auth as POST — allows running from a browser with a header tool
  return POST(request);
}
