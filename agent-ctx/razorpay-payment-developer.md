# Razorpay Payment Integration - Work Record

## Task: Create complete Razorpay payment integration for NotiFetch

## Files Created

### 1. `src/lib/razorpay.ts` — Razorpay Utility
- Initializes Razorpay instance using `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- `createOrder(amount, currency, plan, period, userId)` — creates Razorpay order with notes for userId/plan/period
- `verifyPayment(orderId, paymentId, signature)` — verifies HMAC-SHA256 payment signature (timing-safe)
- `verifyWebhookSignature(body, signature)` — verifies webhook signature using `RAZORPAY_WEBHOOK_SECRET`
- `getPlanPrice(plan, period)` — returns price in paise: free=0, pro=4900/49000, premium=9900/99000
- `isRazorpayConfigured()` — checks env vars are set

### 2. `src/app/api/payments/create-order/route.ts` — POST Endpoint
- Requires auth via `getServerSession(authOptions)`
- Validates plan (pro/premium) and period (monthly/yearly)
- Creates Razorpay order and returns `{ orderId, amount, currency, key }`

### 3. `src/app/api/payments/verify/route.ts` — POST Endpoint
- Requires auth
- Takes `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, period }`
- Verifies payment signature server-side
- Updates User plan in DB, creates Payment record, creates AuditLog

### 4. `src/app/api/payments/webhook/route.ts` — POST Endpoint (Replaced)
- No auth required (Razorpay calls this)
- Detects provider by header: `x-razorpay-signature` → Razorpay, `stripe-signature` → Stripe
- Razorpay: handles `payment.captured`, `payment.failed`, `order.paid`, `subscription.cancelled`, `subscription.charged`
- Stripe: backward compatible with existing events
- Returns 200 quickly

### 5. `src/components/razorpay-checkout.tsx` — Client Component
- "Upgrade" button triggers Razorpay checkout
- Loads script from `https://checkout.razorpay.com/v1/checkout.js`
- 4-step flow: load script → create order → open checkout → verify payment
- Shows loading/success/error states
- Props: `{ plan, period, currentPlan, onSuccess, label, className, variant }`

### 6. `.env.example` — Updated
- Added `RAZORPAY_WEBHOOK_SECRET=""` under Razorpay section

## Package Installed
- `razorpay` npm package

## Key Design Decisions
- All amounts in paise (INR × 100) per Razorpay convention
- Signature verification uses `crypto.timingSafeEqual` to prevent timing attacks
- Webhook handler supports both Razorpay AND Stripe (backward compatible)
- Payment records use idempotency check to avoid duplicates from webhooks + verify
- Razorpay order notes carry userId/plan/period for webhook reconciliation
