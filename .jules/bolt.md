## 2025-05-15 - Optimize batch inserts with createManyAndReturn
**Learning:** In Prisma 6.x, `createManyAndReturn` is significantly more efficient than wrapping individual `create` calls in a `$transaction`, as it reduces database roundtrips from O(n) to O(1) while still returning the created records.
**Action:** Always prefer `createManyAndReturn` for batch insertion endpoints that need to return IDs or data of the inserted records.
