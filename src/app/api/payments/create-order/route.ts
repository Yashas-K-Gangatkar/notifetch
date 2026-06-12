import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createOrder, isRazorpayConfigured, getPlanPrice } from "@/lib/razorpay";
import { verifyFirebaseToken, getOrCreateUserFromFirebase } from "@/lib/firebase-admin";
import { db } from "@/lib/db";

/**
 * Authenticate the request from either NextAuth session or Firebase Bearer token.
 * Returns { userId, plan } or null if unauthenticated.
 */
async function authenticateRequest(request: Request): Promise<{ id: string; plan: string; email?: string } | null> {
  // ── Try Firebase Bearer token first (Android app) ────────────────────────
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const idToken = authHeader.substring(7);
    const firebaseUid = await verifyFirebaseToken(idToken);
    if (firebaseUid) {
      const { getFirebaseAdminApp } = await import("@/lib/firebase-admin");
      const app = getFirebaseAdminApp();
      if (app) {
        try {
          const decoded = await (await import("firebase-admin")).auth(app).verifyIdToken(idToken);
          const userInfo = await getOrCreateUserFromFirebase(firebaseUid, decoded.email);
          if (userInfo) {
            return { id: userInfo.id, plan: userInfo.plan, email: decoded.email };
          }
        } catch {
          // Fall through to NextAuth
        }
      }
    }
  }

  // ── Fallback to NextAuth session (web app) ───────────────────────────────
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return {
      id: session.user.id,
      plan: (session.user as Record<string, unknown>).plan as string ?? "free",
      email: session.user.email ?? undefined,
    };
  }

  return null;
}

/**
 * POST /api/payments/create-order
 *
 * Creates a Razorpay order for subscription payment.
 * Supports both NextAuth session (web) and Firebase Bearer token (Android).
 *
 * Body: { plan: "pro" | "premium", period: "monthly" | "yearly" }
 * Returns: { orderId, amount, currency, key }
 */
export async function POST(request: Request) {
  try {
    // ── Auth check ──────────────────────────────────────────────────────────
    const user = await authenticateRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Razorpay config check ───────────────────────────────────────────────
    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        { error: "Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables." },
        { status: 503 }
      );
    }

    // ── Parse and validate body ─────────────────────────────────────────────
    const body = await request.json();
    const { plan, period } = body;

    if (!plan || !["pro", "premium"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan. Must be 'pro' or 'premium'." },
        { status: 400 }
      );
    }

    if (!period || !["monthly", "yearly"].includes(period)) {
      return NextResponse.json(
        { error: "Invalid period. Must be 'monthly' or 'yearly'." },
        { status: 400 }
      );
    }

    // ── Check if user is already on this or a higher plan ───────────────────
    if (user.plan === plan) {
      return NextResponse.json(
        { error: `You are already on the ${plan} plan.` },
        { status: 400 }
      );
    }

    // ── Create Razorpay order ───────────────────────────────────────────────
    const amount = getPlanPrice(plan, period);

    const order = await createOrder({
      amount,
      currency: "INR",
      plan,
      period,
      userId: user.id,
    });

    // ── Return order details + public key for client ────────────────────────
    return NextResponse.json({
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("[API] Error creating Razorpay order:", error);
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
