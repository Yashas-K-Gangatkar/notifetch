# Bolt's Journal - NotiFetch Performance Optimizations

## 2025-05-14 - Parallelizing Notification API Queries
**Learning:** The `GET /api/notifications` route was making 5 sequential database calls (findMany, count, count, groupBy, count/aggregate). In a serverless environment like Vercel with a remote Postgres DB (Neon), each roundtrip adds 20-50ms of latency.
**Action:** Use `Promise.all` to parallelize independent queries. Combined `todayCount` and `todayEarnings` into a single `aggregate` call. This reduces the DB roundtrip count from 5 to 2 (one for parallelized main queries, one for authentication if needed).

## 2025-05-14 - Centralizing Authentication
**Learning:** Re-implementing authentication logic in every API route leads to inconsistencies and missing support for certain auth methods (like device session tokens for Android).
**Action:** Use the centralized `authenticateRequest` helper in `src/lib/auth-helpers.ts` which handles NextAuth, Firebase, and Device sessions correctly.
