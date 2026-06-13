import { NextResponse } from "next/server";

/**
 * GET /api/payments/health
 *
 * Debug endpoint to check which payment-related environment variables are configured.
 * Does NOT expose values — only whether they are set.
 * In production, requires ADMIN_SECRET Bearer token.
 */
export async function GET(request: Request) {
  // In production, require a proper admin secret
  if (process.env.NODE_ENV === "production") {
    const authHeader = request.headers.get("authorization");
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret || !authHeader?.startsWith("Bearer ") || authHeader.substring(7) !== adminSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const checks = {
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
