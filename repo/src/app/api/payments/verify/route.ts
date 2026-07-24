import { NextResponse } from "next/server";

/**
 * /api/payments/verify — DISABLED during Free Preview
 *
 * Returns a structured "preview mode" response so the Android app's
 * payment verification flow (if any old build still calls it) degrades
 * gracefully.
 */

export async function POST() {
  return NextResponse.json({
    previewMode: true,
    verified: false,
    error: "Payments are disabled during the Free Preview period.",
    message:
      "All features and platforms are unlocked at no cost. No verification needed.",
  });
}
