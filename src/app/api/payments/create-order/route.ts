import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createOrder, isRazorpayConfigured, getPlanPrice } from "@/lib/razorpay";

/**
 * POST /api/payments/create-order
 *
 * Creates a Razorpay order for subscription payment.
 * Requires authentication.
 *
 * Body: { plan: "starter" | "pro" | "premium", period: "monthly" | "yearly" }
 * Returns: { orderId, amount, currency, key }
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
        { error: "Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables in your Vercel dashboard." },
        { status: 503 }
      );
    }

    // ── Parse and validate body ─────────────────────────────────────────────
    const body = await request.json();
    const { plan, period, selectedPlatforms } = body;

    if (!plan || !["starter", "pro", "premium"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan. Must be 'starter', 'pro', or 'premium'." },
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
    const userPlan = (session.user as Record<string, unknown>).plan as string | undefined;
    if (userPlan === plan) {
      return NextResponse.json(
        { error: `You are already on the ${plan} plan.` },
        { status: 400 }
      );
    }

    // Prevent downgrades through this endpoint
    const planOrder: Record<string, number> = { free: 0, starter: 1, pro: 2, premium: 3 };
    if (userPlan && planOrder[userPlan] > planOrder[plan]) {
      return NextResponse.json(
        { error: `You are already on a higher plan (${userPlan}). Downgrade is not supported through this endpoint.` },
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
      userId: session.user.id,
      selectedPlatforms: Array.isArray(selectedPlatforms) ? selectedPlatforms : [],
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
