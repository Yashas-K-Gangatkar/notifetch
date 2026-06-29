## 2025-05-15 - Prisma createManyAndReturn for Batch Performance
**Learning:** Replacing `db.$transaction` of multiple `db.notification.create` calls with `db.notification.createManyAndReturn` reduces database roundtrips from O(N) to O(1). This significantly improves API response times and reduces database load when the Android app syncs many notifications at once.
**Action:** Always prefer `createManyAndReturn` (Prisma 6+) for bulk insertions where created record data is needed.

## 2025-05-15 - Parallelizing Independent DB Queries
**Learning:** Executing multiple independent `db.count`, `db.findMany`, and `db.aggregate` calls sequentially in a route handler adds unnecessary latency. Using `Promise.all` allows the database to process these queries in parallel (if connection pool allows) and reduces the total wait time to the duration of the slowest query.
**Action:** Use `Promise.all` for all independent read operations in API routes.
