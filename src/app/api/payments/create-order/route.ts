import { NextResponse } from "next/server";

/**
 * /api/payments/create-order — DISABLED during Free Preview
 *
 * Returns a structured "preview mode" response so the Android app's
 * checkout flow (if any old build still calls it) degrades gracefully.
 */

export async function POST() {
  return NextResponse.json({
    previewMode: true,
    error: "Payments are disabled during the Free Preview period.",
    message:
      "All features and platforms are unlocked at no cost. No order creation needed.",
  });
}
