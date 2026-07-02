## 2025-05-15 - Batch Database Insertions Optimization
**Learning:** Using `db.$transaction` with a loop of `db.model.create` calls results in O(n) database roundtrips. Prisma 6.x supports `createManyAndReturn`, which performs a single bulk insert (O(1)) and returns the created records.
**Action:** Always prefer `createManyAndReturn` for batch insertions where created record IDs or data are needed in the response. Use the `select` property to only fetch required fields (like `id`) to further optimize memory and network usage.
