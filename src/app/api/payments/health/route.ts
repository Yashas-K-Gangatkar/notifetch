import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

/**
 * GET /api/payments/health
 *
 * Debug endpoint to check which payment-related environment variables are configured.
 * Does NOT expose values — only whether they are set.
 * In production, requires ADMIN_SECRET Bearer token.
 *
 * v2.9.60 SECURITY HARDENING: Use timingSafeEqual for admin secret comparison.
 * v2.9.59 used `!==` which is vulnerable to timing attacks — an attacker can
 * statistically infer the secret byte-by-byte by measuring response times.
 * Even though this is "just a health endpoint", the same ADMIN_SECRET protects
 * all admin routes, so a timing leak here compromises the whole admin surface.
 */
function safeCompareSecret(provided: string, expected: string): boolean {
  // Length check is fine to do early — it doesn't leak the secret itself,
  // only whether the lengths match. If they don't match, the secret is wrong
  // anyway, so short-circuiting is safe.
  if (provided.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  // In production, require a proper admin secret
  if (process.env.NODE_ENV === "production") {
    const authHeader = request.headers.get("authorization");
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      // ADMIN_SECRET not configured — fail closed
      return NextResponse.json({ error: "Admin access not configured" }, { status: 503 });
    }
    const provided = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : "";
    if (!safeCompareSecret(provided, adminSecret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const checks = {
    previewMode: true,
    paymentsEnabled: false,
    message: "NotiFetch is in Free Preview — payments are disabled.",
    RAZORPAY_KEY_ID: !!process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: !!process.env.RAZORPAY_KEY_SECRET,
    RAZORPAY_WEBHOOK_SECRET: !!process.env.RAZORPAY_WEBHOOK_SECRET,
    FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    DATABASE_URL: !!process.env.DATABASE_URL,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(checks);
}
