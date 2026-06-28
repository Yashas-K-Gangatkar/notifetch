## 2026-06-28 - [Batch Optimization with Prisma 6]
**Learning:** In high-volume notification processing (Android app sync), using `db.$transaction` with individual `create` calls causes O(n) database roundtrips. Prisma 6.x `createManyAndReturn` reduces this to a single O(1) batch operation while still returning the created records, which is essential for the Android app to confirm specific notification IDs.
**Action:** Use `createManyAndReturn` for all batch insertion routes to minimize database latency and transaction overhead.
