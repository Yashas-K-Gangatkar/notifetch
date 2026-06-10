import { NextResponse } from "next/server";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

// Cache the script for 5 minutes (Razorpay updates infrequently)
let cachedScript: { body: string; etag: string; fetchedAt: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * GET /api/payments/razorpay-script
 *
 * Proxies the Razorpay checkout.js script through our own domain.
 * This bypasses CSP and ad-blocker issues that can prevent the script
 * from loading directly from checkout.razorpay.com.
 *
 * The script is cached server-side for 5 minutes.
 */
export async function GET() {
  try {
    // Check cache
    if (cachedScript && Date.now() - cachedScript.fetchedAt < CACHE_TTL) {
      return new NextResponse(cachedScript.body, {
        status: 200,
        headers: {
          "Content-Type": "text/javascript; charset=utf-8",
          "Cache-Control": "public, max-age=300, s-maxage=300",
          "X-Cache": "HIT",
          ETag: cachedScript.etag,
        },
      });
    }

    // Fetch fresh script from Razorpay CDN
    const response = await fetch(RAZORPAY_SCRIPT_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`[Razorpay Script Proxy] Failed to fetch: ${response.status}`);
      return NextResponse.json(
        { error: "Failed to fetch Razorpay script" },
        { status: 502 }
      );
    }

    const body = await response.text();
    const etag = response.headers.get("etag") || `"${Date.now()}"`;

    // Cache it
    cachedScript = { body, etag, fetchedAt: Date.now() };

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "text/javascript; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "X-Cache": "MISS",
        ETag: etag,
      },
    });
  } catch (error) {
    console.error("[Razorpay Script Proxy] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Razorpay script" },
      { status: 500 }
    );
  }
}
