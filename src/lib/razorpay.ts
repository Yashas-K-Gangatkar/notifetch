/**
 * Razorpay helper utilities for NotiFetch.
 *
 * Razorpay is used instead of Stripe because Stripe is invite-only in India.
 * All amounts are in paise (INR × 100), the smallest currency unit.
 */

import Razorpay from "razorpay";
import crypto from "crypto";

// ─── Plan Pricing (in paise) ────────────────────────────────────────────────

type Plan = "free" | "starter" | "pro" | "premium";
type Period = "monthly" | "yearly";

interface PlanPrice {
  monthly: number;
  yearly: number;
  platformLimit: number;
}

const PLAN_PRICES: Record<Plan, PlanPrice> = {
  free: { monthly: 0, yearly: 0, platformLimit: 2 },
  starter: { monthly: 17000, yearly: 170000, platformLimit: 5 },     // ₹170/month ($2.05), ₹1700/year
  pro: { monthly: 42000, yearly: 420000, platformLimit: 8 },         // ₹420/month ($5.08), ₹4200/year
  premium: { monthly: 83000, yearly: 830000, platformLimit: 999 },   // ₹830/month ($10), ₹8300/year
};

/**
 * Get the price in paise for a given plan and period.
 */
export function getPlanPrice(plan: string, period: string = "monthly"): number {
  const planPrices = PLAN_PRICES[plan as Plan];
  if (!planPrices) {
    throw new Error(`Invalid plan: ${plan}. Must be one of: free, starter, pro, premium`);
  }
  return planPrices[period as Period] ?? planPrices.monthly;
}

/**
 * Get the platform limit for a given plan.
 */
export function getPlanPlatformLimit(plan: string): number {
  const planPrices = PLAN_PRICES[plan as Plan];
  if (!planPrices) return 2;
  return planPrices.platformLimit;
}

/**
 * Get the human-readable price string for display.
 */
export function getPlanPriceDisplay(plan: string, period: string = "monthly"): string {
  const paise = getPlanPrice(plan, period);
  const rupees = paise / 100;
  if (rupees === 0) return "Free";
  return `₹${rupees}${period === "yearly" ? "/year" : "/month"}`;
}

// ─── Razorpay Instance ──────────────────────────────────────────────────────

let _razorpay: Razorpay | null = null;

/**
 * Check if Razorpay is configured (env vars set).
 */
export function isRazorpayConfigured(): boolean {
  return !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

/**
 * Get a configured Razorpay client instance.
 * Throws if RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set.
 */
export function getRazorpay(): Razorpay {
  if (_razorpay) return _razorpay;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment variables."
    );
  }

  _razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  return _razorpay;
}

// ─── Order Creation ─────────────────────────────────────────────────────────

interface CreateOrderParams {
  amount: number;
  currency?: string;
  plan: string;
  period: string;
  userId: string;
}

interface RazorpayOrderResult {
  orderId: string;
  amount: number;
  currency: string;
}

/**
 * Create a Razorpay order for subscription payment.
 * Amount must be in paise (smallest currency unit for INR).
 */
export async function createOrder(params: CreateOrderParams): Promise<RazorpayOrderResult> {
  const razorpay = getRazorpay();
  const currency = params.currency ?? "INR";

  // Validate plan and get amount if not provided
  const amount = params.amount || getPlanPrice(params.plan, params.period);

  if (amount <= 0) {
    throw new Error("Cannot create order with zero amount. Free plan does not require payment.");
  }

  const order = await razorpay.orders.create({
    amount,
    currency,
    receipt: `rcpt_${params.userId}_${Date.now()}`,
    notes: {
      userId: params.userId,
      plan: params.plan,
      period: params.period,
    },
  });

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  };
}

// ─── Payment Verification ───────────────────────────────────────────────────

/**
 * Verify the Razorpay payment signature.
 * This must be done server-side using the key secret.
 *
 * Razorpay generates the signature using:
 *   HMAC-SHA256(orderId + "|" + paymentId, keySecret)
 */
export function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    throw new Error("RAZORPAY_KEY_SECRET is not configured.");
  }

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, "hex"),
    Buffer.from(signature, "hex")
  );
}

// ─── Webhook Verification ───────────────────────────────────────────────────

/**
 * Verify the Razorpay webhook signature.
 *
 * Razorpay signs webhooks using:
 *   HMAC-SHA256(rawBody, webhookSecret)
 */
export function verifyWebhookSignature(
  body: string,
  signature: string
): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error(
      "RAZORPAY_WEBHOOK_SECRET is not configured. Please set it in your environment variables."
    );
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, "hex"),
    Buffer.from(signature, "hex")
  );
}
