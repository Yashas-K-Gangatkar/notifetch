import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyPayment, isRazorpayConfigured } from "@/lib/razorpay";
import { db } from "@/lib/db";

/**
 * POST /api/payments/verify
 *
 * Verifies a Razorpay payment after the client-side checkout completes.
 * Requires authentication.
 *
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, period }
 * Returns: { success: true }
 */
export async function POST(request: Request) {
  try {
    // ── Auth check ──────────────────────────────────────────────────────────
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
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

    if (!plan || !["starter", "pro", "premium"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan. Must be 'starter', 'pro', or 'premium'." },
        { status: 400 }
      );
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
        userId: session.user.id,
      });

      // Create a failed payment record
      await db.payment.create({
        data: {
          userId: session.user.id,
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
      where: { id: session.user.id },
      data: { plan },
    });

    // ── Create payment record ───────────────────────────────────────────────
    // Fetch amount from Razorpay order notes or compute from plan
    const { getPlanPrice } = await import("@/lib/razorpay");
    const amount = getPlanPrice(plan, period ?? "monthly");

    await db.payment.create({
      data: {
        userId: session.user.id,
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
        userId: session.user.id,
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
      userId: session.user.id,
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
