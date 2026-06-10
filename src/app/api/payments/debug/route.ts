import { NextResponse } from "next/server";

/**
 * GET /api/payments/debug
 * Temporary debug endpoint to check if Razorpay keys are configured.
 * REMOVE THIS BEFORE PRODUCTION!
 */
export async function GET() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  return NextResponse.json({
    keyIdSet: !!keyId,
    keySecretSet: !!keySecret,
    keyIdPrefix: keyId ? keyId.substring(0, 8) + "..." : "NOT_SET",
    keyIdLength: keyId ? keyId.length : 0,
    keySecretLength: keySecret ? keySecret.length : 0,
  });
}
