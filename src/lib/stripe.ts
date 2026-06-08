/**
 * Stripe helper utilities.
 *
 * Uses lazy imports to avoid loading the heavy Stripe SDK
 * until it's actually needed.
 */

/**
 * Check if Stripe is configured.
 */
export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

/**
 * Get a configured Stripe client instance.
 * Throws if STRIPE_SECRET_KEY is not set.
 */
export async function getStripe() {
  const Stripe = (await import("stripe")).default;
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY is not configured. Please set it in your environment variables."
    );
  }

  return new Stripe(secretKey, {
    typescript: true,
  });
}

/**
 * Create a Stripe Checkout Session for premium subscription.
 */
export async function createCheckoutSession(params: {
  customerId?: string;
  userId: string;
  email: string;
  priceId?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = await getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer: params.customerId || undefined,
    customer_email: params.customerId ? undefined : params.email,
    client_reference_id: params.userId,
    line_items: [
      {
        price: params.priceId ?? process.env.STRIPE_PRICE_ID ?? "",
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      userId: params.userId,
    },
  });

  return session;
}

/**
 * Create a Stripe Customer Portal session for managing subscriptions.
 */
export async function createCustomerPortalSession(params: {
  customerId: string;
  returnUrl: string;
}) {
  const stripe = await getStripe();

  const session = await stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });

  return session;
}

/**
 * Verify the signature of an incoming Stripe webhook request.
 */
export async function verifyWebhookSignature(
  payload: string | Buffer,
  sigHeader: string | string[] | undefined
) {
  const stripe = await getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error(
      "STRIPE_WEBHOOK_SECRET is not configured. Please set it in your environment variables."
    );
  }

  if (!sigHeader) {
    throw new Error("Missing Stripe signature header");
  }

  const event = stripe.webhooks.constructEvent(
    payload,
    typeof sigHeader === "string" ? sigHeader : sigHeader[0],
    webhookSecret
  );

  return event;
}
