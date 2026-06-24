import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware for route protection.
 *
 * Currently protects:
 *   - /api/admin/* → requires X-Admin-Secret header matching ADMIN_SECRET env var
 *
 * Why middleware (not per-route check):
 *   - Single source of truth for admin auth
 *   - Easier to audit
 *   - Avoids accidental exposure if a future admin route forgets the check
 *
 * Routes NOT protected here (protected elsewhere):
 *   - /dashboard/* → client-side auth check via useSession, redirects to /auth/signin
 *   - /api/notifications/* etc. → per-route authenticateRequest() helper
 *
 * Set ADMIN_SECRET in Vercel env vars. Generate with:
 *   openssl rand -base64 32
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /api/admin/*
  if (pathname.startsWith("/api/admin")) {
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      // ADMIN_SECRET not configured — fail closed
      console.error("[middleware] ADMIN_SECRET env var is not set — refusing admin access");
      return NextResponse.json(
        { error: "Admin access not configured" },
        { status: 503 }
      );
    }
    const provided = request.headers.get("x-admin-secret");
    if (provided !== adminSecret) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
