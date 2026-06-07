# Backend API - DeliveryBoost

## Task ID: backend-api
## Agent: Main Agent

## Summary

Created the complete backend for the DeliveryBoost Next.js 16 application, including:

### Files Created (11 total)

1. **`/src/lib/auth.ts`** - NextAuth v4 configuration
   - Credentials provider (email + password with bcryptjs)
   - Google OAuth provider (placeholder env vars)
   - JWT session strategy
   - Callbacks: jwt (adds id, plan, role), session (passes to client)
   - Google OAuth auto-creates/links users and accounts on first sign-in
   - Pages: signIn → `/auth/signin`

2. **`/src/app/api/auth/[...nextauth]/route.ts`** - Auth route handler
   - Exports GET and POST handlers

3. **`/src/app/api/user/route.ts`** - User profile API
   - GET: Returns current user profile (protected, excludes passwordHash)
   - PUT: Updates user settings (region, currency, language, preferences, etc.)
   - Whitelisted updatable fields only
   - Audit log on update

4. **`/src/app/api/platforms/route.ts`** - Platform connections API
   - GET: List user's platform connections
   - POST: Connect a platform (create or update PlatformConnection)
   - DELETE: Disconnect a platform (supports both body and query param)
   - Audit logging for connect/disconnect

5. **`/src/app/api/orders/route.ts`** - Orders API
   - GET: List user's accepted orders with pagination (page, limit, status, platformId filters)
   - POST: Accept a new order (create AcceptedOrder)
   - PATCH: Update order status (accepted/completed/cancelled)
   - Auto-creates EarningRecord when order is completed

6. **`/src/app/api/earnings/route.ts`** - Earnings summary API
   - GET: Earnings summary with groupBy support (day, platform, category)
   - Date range filters (from, to)
   - Platform filter
   - Returns total amount, total orders, and grouped data

7. **`/src/app/api/payments/route.ts`** - Stripe payments API
   - GET: List payment history (protected)
   - POST: Create checkout session or customer portal session
   - Lazy imports Stripe to avoid memory issues
   - Checks Stripe configuration before attempting operations

8. **`/src/app/api/payments/webhook/route.ts`** - Stripe webhook handler
   - POST: Public endpoint (no auth) for Stripe events
   - Handles: checkout.session.completed, subscription.updated, subscription.deleted, invoice.payment_succeeded, invoice.payment_failed
   - Updates user plan status and creates payment records

9. **`/src/app/api/notifications/route.ts`** - FCM token registration API
   - POST: Register FCM push token for authenticated user
   - Audit logging

10. **`/src/app/api/notifications/test/route.ts`** - Test notification API
    - POST: Send test push notification to authenticated user
    - Lazy imports notification module
    - Logs notification in NotificationLog

11. **`/src/lib/stripe.ts`** - Stripe helper (lazy imports)
    - `getStripe()` - Returns configured Stripe client
    - `isStripeConfigured()` - Checks if Stripe env vars are set
    - `createCheckoutSession()` - Creates subscription checkout
    - `createCustomerPortalSession()` - Creates customer portal
    - `verifyWebhookSignature()` - Verifies webhook signatures

12. **`/src/lib/notifications.ts`** - Push notification helper (lazy imports)
    - `initializeFCM()` - Initializes Firebase Admin SDK
    - `sendPushNotification()` - Sends to single FCM token
    - `sendMulticastNotification()` - Sends to multiple tokens
    - All firebase-admin imports are dynamic to avoid compile-time issues

13. **`/src/middleware.ts`** - NextAuth middleware
    - Protects: /api/user, /api/platforms, /api/orders, /api/earnings, /api/payments, /api/notifications
    - Public: /, /api/auth/*, /api/payments/webhook
    - Uses getToken from next-auth/jwt

### Key Design Decisions

- **Lazy imports for heavy packages**: Stripe and firebase-admin use dynamic `await import()` to prevent Turbopack memory issues during compilation
- **All protected routes return 401 JSON** instead of redirecting (middleware + route handler double-check)
- **Audit logging** on all significant actions (connect/disconnect platform, accept/update order, register FCM token, subscription events)
- **EarningRecord auto-creation** when an order is marked as completed
- **No type imports from external heavy packages** in API routes to avoid compilation issues

### Verified Endpoints (all returned correct responses)

| Endpoint | Expected | Actual |
|----------|----------|--------|
| GET /api/user | 401 | 401 ✓ |
| GET /api/platforms | 401 | 401 ✓ |
| GET /api/orders | 401 | 401 ✓ |
| GET /api/earnings | 401 | 401 ✓ |
| GET /api/payments | 401 | 401 ✓ |
| POST /api/payments/webhook | 400 (no Stripe key) | 400 ✓ |
| POST /api/notifications | 401 | 401 ✓ |
| /api/notifications/test | 401 | 401 ✓ |

### Packages Installed
- `stripe` - Stripe SDK
- `firebase-admin` - Firebase Admin SDK for FCM
- `bcryptjs` + `@types/bcryptjs` - Password hashing
