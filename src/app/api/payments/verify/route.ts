import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyPayment, isRazorpayConfigured, getPlanPrice } from "@/lib/razorpay";
import { verifyFirebaseToken, getOrCreateUserFromFirebase } from "@/lib/firebase-admin";
import { db } from "@/lib/db";

/**
 * Authenticate the request from either NextAuth session or Firebase Bearer token.
 * Returns { userId, plan } or null if unauthenticated.
 */
async function authenticateRequest(request: Request): Promise<{ id: string; plan: string } | null> {
  // ── Try Firebase Bearer token first (Android app) ────────────────────────
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const idToken = authHeader.substring(7);
    const firebaseUid = await verifyFirebaseToken(idToken);
    if (firebaseUid) {
      try {
        const userInfo = await getOrCreateUserFromFirebase(firebaseUid, undefined);
        if (userInfo) {
          return userInfo;
        }
      } catch {
        // Fall through to NextAuth
      }
    }
  }

  // ── Fallback to NextAuth session (web app) ───────────────────────────────
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return {
      id: session.user.id,
      plan: (session.user as Record<string, unknown>).plan as string ?? "free",
    };
  }

  return null;
}

/**
 * POST /api/payments/verify
 *
 * Verifies a Razorpay payment after the client-side checkout completes.
 * Supports both NextAuth session (web) and Firebase Bearer token (Android).
 *
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, period }
 * Returns: { success: true }
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
        { error: "Razorpay is not configured." },
        { status: 503 }
      );
    }

    // ── Parse body ──────────────────────────────────────────────────────────
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
      period,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment verification fields." },
        { status: 400 }
      );
    }

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

    // ── Verify the plan matches what was ordered ─────────────────────────────
    // Fetch order details from Razorpay to prevent plan escalation attacks
    // (where user creates a "pro" order but submits "premium" in verify)
    try {
      const { getRazorpay } = await import("@/lib/razorpay");
      const razorpay = getRazorpay();
      const order = await razorpay.orders.fetch(razorpay_order_id);
      const orderPlan = (order.notes as Record<string, string>)?.plan;
      const orderPeriod = (order.notes as Record<string, string>)?.period;

      if (orderPlan && orderPlan !== plan) {
        console.error("[API] Plan mismatch: order has", orderPlan, "but verify submitted", plan);
        return NextResponse.json(
          { error: `Plan mismatch. Order was for '${orderPlan}' but verification requested '${plan}'.` },
          { status: 400 }
        );
      }

      if (orderPeriod && orderPeriod !== period) {
        console.error("[API] Period mismatch: order has", orderPeriod, "but verify submitted", period);
        return NextResponse.json(
          { error: `Period mismatch. Order was for '${orderPeriod}' but verification requested '${period}'.` },
          { status: 400 }
        );
      }
    } catch (err) {
      // If we can't fetch order details (network issue, etc.), log but continue
      // The signature verification is the primary security check
      console.warn("[API] Could not fetch Razorpay order for plan verification:", err);
    }

    // ── Verify payment signature ────────────────────────────────────────────
    const isValid = verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      console.error("[API] Razorpay payment signature verification failed", {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        userId: user.id,
      });

      // Create a failed payment record
      await db.payment.create({
        data: {
          userId: user.id,
          razorpayPaymentId: razorpay_payment_id,
          amount: 0,
          currency: "INR",
          status: "failed",
          plan,
          period: period ?? "monthly",
        },
      });

      return NextResponse.json(
        { error: "Payment verification failed. Signature mismatch." },
        { status: 400 }
      );
    }

    // ── Payment verified — update user plan ─────────────────────────────────
    await db.user.update({
      where: { id: user.id },
      data: { plan },
    });

    // ── Create payment record ───────────────────────────────────────────────
    const amount = getPlanPrice(plan, period ?? "monthly");

    await db.payment.create({
      data: {
        userId: user.id,
        razorpayPaymentId: razorpay_payment_id,
        amount: amount / 100, // Convert paise to rupees for storage
        currency: "INR",
        status: "completed",
        plan,
        period: period ?? "monthly",
      },
    });

    // ── Audit log ───────────────────────────────────────────────────────────
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "SUBSCRIPTION_CREATED",
        entity: "Payment",
        details: JSON.stringify({
          provider: "razorpay",
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          plan,
          period: period ?? "monthly",
        }),
      },
    });

    console.log("[API] Razorpay payment verified successfully", {
      userId: user.id,
      plan,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Error verifying Razorpay payment:", error);
    const message = error instanceof Error ? error.message : "Failed to verify payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
