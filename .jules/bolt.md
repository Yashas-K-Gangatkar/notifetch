## 2025-05-15 - Batch Processing for Notification Updates
**Learning:** Sequential API calls in loops (O(N) network requests) significantly degrade performance as data grows. Replacing them with a single batch/bulk endpoint reduces network overhead and database transactions.
**Action:** Always check for bulk update opportunities when implementing "Mark all" or "Delete all" features.
