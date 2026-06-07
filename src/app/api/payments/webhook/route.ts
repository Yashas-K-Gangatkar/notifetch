import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * POST /api/payments/webhook
 * Handle Stripe webhook events.
 *
 * IMPORTANT: This route is public (no auth check) because Stripe sends events directly.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sigHeader = request.headers.get("stripe-signature");

    // Lazy import to avoid loading Stripe at module level
    const { verifyWebhookSignature } = await import("@/lib/stripe");

    let event: Awaited<ReturnType<typeof verifyWebhookSignature>>;

    try {
      event = await verifyWebhookSignature(body, sigHeader ?? undefined);
    } catch (err) {
      console.error("[Webhook] Signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Record<string, unknown>;
        const metadata = session.metadata as Record<string, string> | undefined;
        const userId = (session.client_reference_id as string) ?? metadata?.userId;

        if (userId) {
          // Update user plan to premium
          await db.user.update({
            where: { id: userId },
            data: {
              plan: "premium",
              stripeCustomerId: session.customer as string,
            },
          });

          // Create payment record
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

          // Audit log
          await db.auditLog.create({
            data: {
              userId,
              action: "SUBSCRIPTION_CREATED",
              entity: "Payment",
              details: JSON.stringify({
                sessionId: session.id,
                customerId: session.customer,
              }),
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Record<string, unknown>;
        const customerId = subscription.customer as string;

        const user = await db.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          const isActive =
            subscription.status === "active" || subscription.status === "trialing";

          await db.user.update({
            where: { id: user.id },
            data: {
              plan: isActive ? "premium" : "free",
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Record<string, unknown>;
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
                subscriptionId: subscription.id,
              }),
            },
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Record<string, unknown>;
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
        const invoice = event.data.object as Record<string, unknown>;
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
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error processing event:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
