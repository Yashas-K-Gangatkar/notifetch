import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPostHogClient } from "@/lib/posthog-server";

/**
 * POST /api/payments/webhook
 *
 * Handle Razorpay webhook events.
 * Also supports Stripe webhook events if Stripe is configured.
 *
 * IMPORTANT: This route is public (no auth check) because
 * Razorpay/Stripe send events directly to this endpoint.
 * Security is ensured via signature verification.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // ── Detect which provider the webhook is from ───────────────────────────
    const stripeSignature = request.headers.get("stripe-signature");
    const razorpaySignature = request.headers.get("x-razorpay-signature");

    if (razorpaySignature) {
      return handleRazorpayWebhook(body, razorpaySignature);
    }

    if (stripeSignature) {
      return handleStripeWebhook(body, stripeSignature);
    }

    // If neither signature is present, reject immediately
    console.warn("[Webhook] No recognizable signature header found");
    return NextResponse.json(
      { error: "No recognizable webhook signature" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[Webhook] Error processing event:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// ─── Razorpay Webhook Handler ────────────────────────────────────────────────

async function handleRazorpayWebhook(
  body: string,
  signature: string
): Promise<NextResponse> {
  const { verifyWebhookSignature } = await import("@/lib/razorpay");

  // Verify webhook signature — FAIL if signature is invalid or secret is not configured
  try {
    if (!signature) {
      console.error("[Webhook] No Razorpay signature provided");
      return NextResponse.json(
        { error: "Missing Razorpay signature" },
        { status: 400 }
      );
    }
    if (!verifyWebhookSignature(body, signature)) {
      console.error("[Webhook] Razorpay signature verification failed");
      return NextResponse.json(
        { error: "Invalid Razorpay signature" },
        { status: 400 }
      );
    }
  } catch (err) {
    // Signature verification threw (e.g., RAZORPAY_WEBHOOK_SECRET not configured)
    // This is a FATAL error — do NOT process the webhook without verification
    console.error("[Webhook] Razorpay signature verification error (webhook secret may not be configured):", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  let event: { event: string; payload: Record<string, unknown> };

  try {
    event = JSON.parse(body);
  } catch {
    console.error("[Webhook] Invalid JSON body from Razorpay");
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Handle Razorpay events
  switch (event.event) {
    case "payment.captured": {
      const payment = event.payload.payment as Record<string, unknown>;
      const paymentId = payment.id as string;
      const orderId = payment.order_id as string;
      // v2.9.81 SECURITY FIX: Validate amount is a finite number before dividing.
      // Previously: if payment.amount was missing/string/NaN, amount became NaN
      // and was stored in DB, corrupting payment history.
      const rawAmount = payment.amount as unknown;
      if (typeof rawAmount !== "number" || !Number.isFinite(rawAmount) || rawAmount < 0) {
        console.error("[Webhook] Razorpay payment.captured has invalid amount:", rawAmount);
        return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
      }
      const amount = rawAmount / 100; // Convert paise to rupees
      const currency = (payment.currency as string) ?? "INR";
      const notes = payment.notes as Record<string, string> | undefined;

      const userId = notes?.userId;
      const plan = notes?.plan;
      const period = notes?.period ?? "monthly";

      if (userId && plan) {
        // Update user plan
        await db.user.update({
          where: { id: userId },
          data: { plan },
        });

        // Create payment record (idempotency: check if already exists)
        const existingPayment = await db.payment.findFirst({
          where: { razorpayPaymentId: paymentId },
        });

        if (!existingPayment) {
          await db.payment.create({
            data: {
              userId,
              razorpayPaymentId: paymentId,
              amount,
              currency: currency.toLowerCase(),
              status: "completed",
              plan,
              period,
            },
          });
        }

        // Audit log
        await db.auditLog.create({
          data: {
            userId,
            action: "PAYMENT_CAPTURED",
            entity: "Payment",
            details: JSON.stringify({
              provider: "razorpay",
              paymentId,
              orderId,
              plan,
              period,
              amount,
              currency,
            }),
          },
        });

        const posthog = getPostHogClient();
        if (posthog) {
          posthog.capture({
            distinctId: userId,
            event: "payment_completed",
            properties: { provider: "razorpay", plan, period, amount, currency: currency.toLowerCase() },
          });
          await posthog.flush();
        }

        console.log("[Webhook] Razorpay payment.captured processed", {
          userId,
          plan,
          paymentId,
        });
      } else {
        console.warn("[Webhook] Razorpay payment.captured missing userId/plan in notes", {
          paymentId,
          notes,
        });
      }
      break;
    }

    case "payment.failed": {
      const payment = event.payload.payment as Record<string, unknown>;
      const paymentId = payment.id as string;
      const notes = payment.notes as Record<string, string> | undefined;

      const userId = notes?.userId;
      const plan = notes?.plan ?? "free";
      const period = notes?.period ?? "monthly";
      const amount = ((payment.amount as number) || 0) / 100;
      const currency = ((payment.currency as string) ?? "INR").toLowerCase();
      const errorCode = payment.error_code as string | null;
      const errorDescription = payment.error_description as string | null;

      if (userId) {
        // Create failed payment record
        const existingPayment = await db.payment.findFirst({
          where: { razorpayPaymentId: paymentId },
        });

        if (!existingPayment) {
          await db.payment.create({
            data: {
              userId,
              razorpayPaymentId: paymentId,
              amount,
              currency,
              status: "failed",
              plan,
              period,
            },
          });
        }

        // Audit log
        await db.auditLog.create({
          data: {
            userId,
            action: "PAYMENT_FAILED",
            entity: "Payment",
            details: JSON.stringify({
              provider: "razorpay",
              paymentId,
              errorCode,
              errorDescription,
              plan,
            }),
          },
        });

        const posthog = getPostHogClient();
        if (posthog) {
          posthog.capture({
            distinctId: userId,
            event: "payment_failed",
            properties: { provider: "razorpay", plan, period, amount, currency, error_code: errorCode ?? null },
          });
          await posthog.flush();
        }

        console.log("[Webhook] Razorpay payment.failed logged", {
          userId,
          paymentId,
          errorCode,
        });
      } else {
        console.warn("[Webhook] Razorpay payment.failed missing userId in notes", {
          paymentId,
        });
      }
      break;
    }

    case "order.paid": {
      // Razorpay also sends order.paid when an order is fully paid
      // This is a supplementary event; we already handle payment.captured
      console.log("[Webhook] Razorpay order.paid received (handled by payment.captured)");
      break;
    }

    case "subscription.cancelled": {
      const subscription = event.payload.subscription as Record<string, unknown>;
      const notes = subscription.notes as Record<string, string> | undefined;
      const userId = notes?.userId;

      if (userId) {
        await db.user.update({
          where: { id: userId },
          data: { plan: "free" },
        });

        await db.auditLog.create({
          data: {
            userId,
            action: "SUBSCRIPTION_CANCELLED",
            entity: "Payment",
            details: JSON.stringify({
              provider: "razorpay",
              subscriptionId: subscription.id,
            }),
          },
        });

        console.log("[Webhook] Razorpay subscription.cancelled processed", { userId });
      }
      break;
    }

    case "subscription.charged": {
      // Recurring subscription charge
      const subscription = event.payload.subscription as Record<string, unknown>;
      const payment = event.payload.payment as Record<string, unknown> | undefined;
      const notes = subscription.notes as Record<string, string> | undefined;
      const userId = notes?.userId;
      const plan = notes?.plan ?? "premium";

      if (userId && payment) {
        const paymentId = payment.id as string;
        const amount = ((payment.amount as number) || 0) / 100;
        const currency = ((payment.currency as string) ?? "INR").toLowerCase();

        // Ensure user plan is active
        await db.user.update({
          where: { id: userId },
          data: { plan },
        });

        const existingPayment = await db.payment.findFirst({
          where: { razorpayPaymentId: paymentId },
        });

        if (!existingPayment) {
          await db.payment.create({
            data: {
              userId,
              razorpayPaymentId: paymentId,
              amount,
              currency,
              status: "completed",
              plan,
              period: "monthly",
            },
          });
        }

        console.log("[Webhook] Razorpay subscription.charged processed", {
          userId,
          plan,
          paymentId,
        });
      }
      break;
    }

    default:
      console.log(`[Webhook] Unhandled Razorpay event: ${event.event}`);
  }

  return NextResponse.json({ received: true });
}

// ─── Stripe Webhook Handler (backward compatibility) ────────────────────────

async function handleStripeWebhook(
  body: string,
  sigHeader: string
): Promise<NextResponse> {
  // Lazy import to avoid loading Stripe at module level
  const { verifyWebhookSignature } = await import("@/lib/stripe");

  let event: Awaited<ReturnType<typeof verifyWebhookSignature>>;

  try {
    event = await verifyWebhookSignature(body, sigHeader);
  } catch (err) {
    console.error("[Webhook] Stripe signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid Stripe signature" },
      { status: 400 }
    );
  }

  // Handle Stripe events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as unknown as Record<string, unknown>;
      const metadata = session.metadata as Record<string, string> | undefined;
      const userId = (session.client_reference_id as string) ?? metadata?.userId;

      if (userId) {
        await db.user.update({
          where: { id: userId },
          data: {
            plan: "premium",
            stripeCustomerId: session.customer as string,
          },
        });

        await db.payment.create({
          data: {
            userId,
            stripePaymentId: (session.payment_intent as string) ?? (session.id as string),
            amount: session.amount_total ? (session.amount_total as number) / 100 : 0,
            currency: (session.currency as string) ?? "usd",
            status: "completed",
            plan: "premium",
            period: "monthly",
          },
        });

        await db.auditLog.create({
          data: {
            userId,
            action: "SUBSCRIPTION_CREATED",
            entity: "Payment",
            details: JSON.stringify({
              provider: "stripe",
              sessionId: session.id,
              customerId: session.customer,
            }),
          },
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as unknown as Record<string, unknown>;
      const customerId = subscription.customer as string;

      const user = await db.user.findFirst({
        where: { stripeCustomerId: customerId },
      });

      if (user) {
        const isActive =
          subscription.status === "active" || subscription.status === "trialing";

        await db.user.update({
          where: { id: user.id },
          data: { plan: isActive ? "premium" : "free" },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as unknown as Record<string, unknown>;
      const customerId = subscription.customer as string;

      const user = await db.user.findFirst({
        where: { stripeCustomerId: customerId },
      });

      if (user) {
        await db.user.update({
          where: { id: user.id },
          data: { plan: "free" },
        });

        await db.auditLog.create({
          data: {
            userId: user.id,
            action: "SUBSCRIPTION_CANCELLED",
            entity: "Payment",
            details: JSON.stringify({
              provider: "stripe",
              subscriptionId: subscription.id,
            }),
          },
        });
      }
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as unknown as Record<string, unknown>;
      const customerId = invoice.customer as string;

      const user = await db.user.findFirst({
        where: { stripeCustomerId: customerId },
      });

      if (user && (invoice.amount_paid as number) > 0) {
        await db.payment.create({
          data: {
            userId: user.id,
            stripePaymentId: (invoice.payment_intent as string) ?? (invoice.id as string),
            amount: (invoice.amount_paid as number) / 100,
            currency: (invoice.currency as string) ?? "usd",
            status: "completed",
            plan: "premium",
            period: "monthly",
          },
        });
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as unknown as Record<string, unknown>;
      const customerId = invoice.customer as string;

      const user = await db.user.findFirst({
        where: { stripeCustomerId: customerId },
      });

      if (user) {
        await db.payment.create({
          data: {
            userId: user.id,
            stripePaymentId: (invoice.payment_intent as string) ?? (invoice.id as string),
            amount: ((invoice.amount_due as number) ?? 0) / 100,
            currency: (invoice.currency as string) ?? "usd",
            status: "failed",
            plan: "premium",
            period: "monthly",
          },
        });
      }
      break;
    }

    default:
      console.log(`[Webhook] Unhandled Stripe event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
