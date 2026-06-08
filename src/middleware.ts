import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * NextAuth middleware for route protection.
 *
 * Protected routes:
 *   - /dashboard
 *   - /api/user
 *   - /api/platforms
 *   - /api/orders
 *   - /api/earnings
 *   - /api/payments (except /api/payments/webhook)
 *   - /api/notifications
 *
 * Public routes:
 *   - / (root)
 *   - /auth/*
 *   - /legal, /privacy, /terms
 *   - /api/auth/*
 *   - /api/payments/webhook
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Allow legal pages
  if (pathname === "/legal" || pathname === "/privacy" || pathname === "/terms") {
    return NextResponse.next();
  }

  // Allow auth routes (sign-in page + NextAuth API)
  if (pathname.startsWith("/auth") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Allow webhook route (Stripe/Razorpay need unauthenticated access)
  if (pathname === "/api/payments/webhook") {
    return NextResponse.next();
  }

  // Protect /dashboard page — redirect to sign-in if not authenticated
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  }

  // Check if the API path requires authentication
  const protectedPrefixes = [
    "/api/user",
    "/api/platforms",
    "/api/orders",
    "/api/earnings",
    "/api/payments",
    "/api/notifications",
  ];

  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Verify JWT token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
