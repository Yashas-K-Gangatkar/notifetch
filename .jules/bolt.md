## 2025-05-14 - [Optimize Batch Insertion with Prisma 6.x]
**Learning:** For batch synchronization endpoints, using Prisma's `createManyAndReturn` (available in v6+) is significantly more efficient than looping `create` calls within a `$transaction`. It reduces the number of database roundtrips from O(n) to O(1) while still allowing the return of created records.
**Action:** Always prefer `createManyAndReturn` or `updateMany` for bulk API operations involving more than 5-10 records.

## 2025-05-14 - [Centralized Authentication]
**Learning:** Re-implementing authentication logic in every route handler leads to code duplication and maintenance overhead. The codebase provides a centralized `authenticateRequest` in `src/lib/auth-helpers.ts` that handles multiple auth methods (Firebase, Device Token, NextAuth).
**Action:** Refactor existing routes to use `authenticateRequest` from `src/lib/auth-helpers.ts` when touching them for other optimizations.
