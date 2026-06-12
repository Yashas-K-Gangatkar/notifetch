import { NextResponse } from "next/server";

/**
 * GET /api/payments/health
 *
 * Debug endpoint to check which payment-related environment variables are configured.
 * Does NOT expose values — only whether they are set.
 * This helps diagnose "Failed to create order" errors from the Android app.
 */
export async function GET() {
  const checks = {
    RAZORPAY_KEY_ID: !!process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: !!process.env.RAZORPAY_KEY_SECRET,
    FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    DATABASE_URL: !!process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(checks);
}
