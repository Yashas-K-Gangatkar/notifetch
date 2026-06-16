import { NextResponse } from "next/server";

/**
 * /api/payments — DISABLED during Free Preview
 *
 * NotiFetch is in its 6-month Free Preview period. All features and platforms
 * are unlocked at no cost, and no payment information is collected. These
 * routes will be re-activated when the premium tier launches after the preview.
 *
 * The GET/POST handlers return a structured "preview mode" response so that
 * older Android app builds that still call these endpoints don't crash.
 */

export async function GET() {
  return NextResponse.json({
    previewMode: true,
    payments: [],
    message: "NotiFetch is in Free Preview — no payments are being collected.",
  });
}

export async function POST() {
  return NextResponse.json(
    {
      previewMode: true,
      error: "Payments are disabled during the Free Preview period.",
      message:
        "All features and platforms are unlocked at no cost. The premium tier will launch after the preview ends.",
    },
    { status: 200 }
  );
}
