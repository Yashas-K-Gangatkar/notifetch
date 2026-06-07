import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

interface StripeHelpers {
  isStripeConfigured: () => boolean;
  createCheckoutSession: (params: {
    customerId?: string;
    userId: string;
    email: string;
    priceId?: string;
    successUrl: string;
    cancelUrl: string;
  }) => Promise<{ url: string | null; id: string }>;
  createCustomerPortalSession: (params: {
    customerId: string;
    returnUrl: string;
  }) => Promise<{ url: string }>;
}

/**
 * GET /api/payments
 * List the authenticated user's payment history.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payments = await db.payment.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("[API] Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/payments
 * Create a Stripe checkout session for premium subscription.
 *
 * Body: { action: "checkout" | "portal" }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Lazy import Stripe to avoid crashes when not configured
    const stripeHelpers = (await import("@/lib/stripe")) as StripeHelpers;

    if (!stripeHelpers.isStripeConfigured()) {
      return NextResponse.json(
        { error: "Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { action } = body;

    if (action === "portal") {
      return handleCustomerPortal(session.user.id, session.user.email ?? "", stripeHelpers);
    }

    // Default: checkout
    return handleCheckout(session.user.id, session.user.email ?? "", stripeHelpers);
  } catch (error) {
    console.error("[API] Error creating payment session:", error);
    return NextResponse.json(
      { error: "Failed to create payment session" },
      { status: 500 }
    );
  }
}

async function handleCheckout(
  userId: string,
  email: string,
  stripeHelpers: StripeHelpers
) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  const checkoutSession = await stripeHelpers.createCheckoutSession({
    customerId: user?.stripeCustomerId ?? undefined,
    userId,
    email,
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/?payment=success`,
    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/?payment=cancelled`,
  });

  return NextResponse.json({ url: checkoutSession.url, sessionId: checkoutSession.id });
}

async function handleCustomerPortal(
  userId: string,
  _email: string,
  stripeHelpers: StripeHelpers
) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No Stripe customer ID found. Please subscribe first." },
      { status: 400 }
    );
  }

  const portalSession = await stripeHelpers.createCustomerPortalSession({
    customerId: user.stripeCustomerId,
    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/`,
  });

  return NextResponse.json({ url: portalSession.url });
}
