## 2025-05-15 - Unbounded API Inputs
**Vulnerability:** API endpoints accepting raw JSON without validation are vulnerable to DoS (via large payloads) and database bloat.
**Learning:** Even internal-facing APIs can be abused if they lack input length limits.
**Prevention:** Use Zod or similar libraries to enforce strict schemas and maximum character lengths for all string inputs.
