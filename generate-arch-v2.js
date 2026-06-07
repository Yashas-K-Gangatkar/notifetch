const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, HeadingLevel, PageBreak, BorderStyle,
  ShadingType, TableOfContents, Header, Footer, PageNumber,
  NumberFormat, LevelFormat, Tab, TabStopPosition, TabStopType,
  convertInchesToTwip, ImageRun, VerticalAlign, PageOrientation
} = require("docx");
const fs = require("fs");
const path = require("path");

// ── Color Palette ──────────────────────────────────────────────────────────────
const C = {
  primary:   "162235",
  body:      "000000",
  accent:    "1B6B7A",
  surface:   "EDF3F5",
  cyan:      "37DCF2",
  white:     "FFFFFF",
  tableHdr:  "1B6B7A",
  coverBg:   "162235",
  gray:      "666666",
  lightGray: "D9D9D9",
};

// ── Helper: Create a heading paragraph ─────────────────────────────────────────
function heading(text, level = 1) {
  const sizes = { 1: 32, 2: 28, 3: 24 }; // 16pt, 14pt, 12pt in half-points
  const size = sizes[level] || 32;
  return new Paragraph({
    heading: level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
    spacing: { before: level === 1 ? 400 : 300, after: 200 },
    children: [
      new TextRun({
        text,
        bold: true,
        size,
        font: "Times New Roman",
        color: C.primary,
      }),
    ],
  });
}

// ── Helper: Create a body paragraph ────────────────────────────────────────────
function body(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200, line: 360 },
    children: [
      new TextRun({
        text,
        size: 24, // 12pt
        font: "Calibri",
        color: opts.color || C.body,
        bold: opts.bold || false,
        italics: opts.italics || false,
      }),
    ],
  });
}

// ── Helper: Create a styled table ─────────────────────────────────────────────
function makeTable(headers, rows, colWidths) {
  const headerCells = headers.map((h, i) =>
    new TableCell({
      width: colWidths ? { size: colWidths[i], type: WidthType.DXA } : undefined,
      shading: { type: ShadingType.CLEAR, color: C.tableHdr },
      verticalAlign: VerticalAlign.CENTER,
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 60, after: 60 },
          children: [
            new TextRun({
              text: h,
              bold: true,
              size: 22,
              font: "Calibri",
              color: C.white,
            }),
          ],
        }),
      ],
    })
  );

  const dataRows = rows.map((row, rowIdx) =>
    new TableRow({
      children: row.map((cell, colIdx) =>
        new TableCell({
          width: colWidths ? { size: colWidths[colIdx], type: WidthType.DXA } : undefined,
          shading: rowIdx % 2 === 0
            ? { type: ShadingType.CLEAR, color: C.surface }
            : { type: ShadingType.CLEAR, color: C.white },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              spacing: { before: 40, after: 40 },
              children: [
                new TextRun({
                  text: String(cell),
                  size: 20,
                  font: "Calibri",
                  color: C.body,
                }),
              ],
            }),
          ],
        })
      ),
    })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: headerCells }), ...dataRows],
  });
}

// ── Helper: Empty line ─────────────────────────────────────────────────────────
function spacer(h = 200) {
  return new Paragraph({ spacing: { before: h, after: 0 }, children: [] });
}

// ── Helper: Cyan-bordered subtitle line ────────────────────────────────────────
function cyanBorderedLine(text, fontSize = 28) {
  return new Paragraph({
    spacing: { before: 200, after: 100 },
    indent: { left: 400 },
    border: {
      left: { style: BorderStyle.SINGLE, size: 18, color: C.cyan, space: 10 },
    },
    children: [
      new TextRun({
        text,
        size: fontSize,
        font: "Calibri",
        color: C.white,
      }),
    ],
  });
}

// ── Cover Page ─────────────────────────────────────────────────────────────────
function buildCoverPage() {
  return [
    // Top spacer to push content to center area
    spacer(3600),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "DeliveryBoost",
          bold: true,
          size: 88, // 44pt
          font: "Calibri",
          color: C.white,
        }),
      ],
    }),

    cyanBorderedLine("Technical Architecture Document", 32),

    spacer(300),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: "Version 2.0 | Global Infrastructure",
          size: 26,
          font: "Calibri",
          color: C.cyan,
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: "Date: June 7, 2026",
          size: 24,
          font: "Calibri",
          color: "AABBCC",
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: "Author: Yashas K. Gangatkar",
          size: 24,
          font: "Calibri",
          color: "AABBCC",
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: "Classification: Internal",
          size: 24,
          font: "Calibri",
          color: "AABBCC",
        }),
      ],
    }),

    spacer(600),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Aggregating delivery notifications from 200+ platforms across 190 countries",
          size: 20,
          font: "Calibri",
          italics: true,
          color: C.cyan,
        }),
      ],
    }),
  ];
}

// ── Table of Contents Section ──────────────────────────────────────────────────
function buildTOC() {
  return [
    new Paragraph({
      spacing: { before: 400, after: 300 },
      children: [
        new TextRun({
          text: "Table of Contents",
          bold: true,
          size: 36,
          font: "Times New Roman",
          color: C.primary,
        }),
      ],
    }),

    new TableOfContents("Table of Contents", {
      hyperlink: true,
      headingStyleRange: "1-3",
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200 },
      children: [
        new TextRun({
          text: "— End of Front Matter —",
          italics: true,
          size: 20,
          font: "Calibri",
          color: C.gray,
        }),
      ],
    }),
  ];
}

// ── Section 1: Architecture Overview ──────────────────────────────────────────
function section1() {
  return [
    heading("1. Architecture Overview"),

    body("DeliveryBoost is engineered as a globally distributed, edge-first platform designed to aggregate delivery notifications from over 200 platforms across 190 countries. The architecture leverages a multi-tier approach where the presentation layer is rendered at the edge using Next.js 16 with server-side rendering, while business logic is distributed across regional compute clusters. This design ensures sub-second page loads for users regardless of their geographic location, from São Paulo to Tokyo."),

    body("At the core of the system lies a microservices-inspired monolithic deployment on Next.js 16, where API routes serve as discrete service endpoints while sharing a unified codebase for maintainability. Each regional deployment maintains its own compute instance on Vercel Edge, paired with a Cloudflare CDN presence that caches static assets and API responses at over 300 points of presence worldwide. The combination of edge rendering and intelligent cache invalidation ensures that gig workers in any country experience consistent, low-latency access to their aggregated delivery notifications."),

    body("The global architecture is partitioned into five primary regional clusters: US-East (Virginia), EU-West (Frankfurt), Asia-Pacific (Singapore), South America (São Paulo), and Middle East (Dubai). Each cluster operates semi-independently with its own database replica, cache layer, and compute resources, while a cross-region synchronization bus ensures data consistency for users who travel between regions. The platform processes an average of 2.4 million notification events per hour during peak periods, with a 99.97% uptime SLA guaranteed through automated failover and multi-active redundancy."),

    body("Security is embedded at every architectural layer, starting with TLS 1.3 encryption in transit, AES-256 encryption at rest, and a zero-trust network model between internal services. Authentication flows through NextAuth.js with support for OAuth 2.0, SAML for enterprise customers, and biometric options for mobile users. The architecture also implements rate limiting, DDoS mitigation via Cloudflare, and automated threat detection using anomaly-based monitoring on all API endpoints."),
  ];
}

// ── Section 2: Technology Stack ───────────────────────────────────────────────
function section2() {
  const techHeaders = ["Layer", "Technology", "Version", "Purpose"];
  const techRows = [
    ["Frontend Framework", "Next.js", "16.x", "SSR, ISR, edge rendering, App Router"],
    ["Language", "TypeScript", "5.x", "Type safety across the entire codebase"],
    ["Styling", "Tailwind CSS", "4.x", "Utility-first CSS with JIT compilation"],
    ["UI Components", "shadcn/ui", "Latest", "Accessible, composable component library"],
    ["Theme", "next-themes", "0.4.x", "Dark/light mode with system preference"],
    ["Typography", "Inter", "Variable", "Optimized for screen readability at all sizes"],
    ["Backend Runtime", "Next.js API Routes", "16.x", "Serverless API endpoints with edge support"],
    ["ORM", "Prisma", "6.x", "Type-safe database access with migrations"],
    ["Cache", "Redis", "7.x", "Session store, rate limiting, pub/sub"],
    ["Auth", "NextAuth.js", "4.x", "OAuth, credentials, JWT session management"],
    ["Edge Compute", "Vercel Edge Functions", "—", "Sub-millisecond cold starts globally"],
    ["CDN", "Cloudflare", "—", "300+ PoP caching, DDoS protection, WAF"],
    ["Database", "PostgreSQL", "16.x", "Multi-region with read replicas"],
    ["Object Storage", "S3-compatible", "—", "Document storage, exports, backups"],
    ["Message Queue", "Redis Streams", "7.x", "Event-driven notification pipeline"],
  ];
  return [
    heading("2. Technology Stack"),

    body("The DeliveryBoost technology stack is carefully curated to balance developer productivity with production performance at global scale. The frontend is built on Next.js 16 with the App Router, leveraging React Server Components for minimal client-side JavaScript and streaming SSR for progressive page hydration. TypeScript 5 provides end-to-end type safety from database schema to UI props, catching entire categories of bugs at compile time rather than in production."),

    body("The styling system combines Tailwind CSS 4 with shadcn/ui components, offering a utility-first approach that enables rapid UI development without sacrificing design consistency. The next-themes library handles dark and light mode toggling with system preference detection, while the Inter variable font ensures crisp typography across 190 locales and script systems. Every component is built with accessibility in mind, conforming to WCAG 2.2 AA standards with proper ARIA attributes, keyboard navigation, and screen reader support."),

    body("On the backend, Next.js API Routes provide a serverless execution model that scales automatically with demand, eliminating capacity planning for individual endpoints. Prisma ORM handles all database interactions with full type safety, migration management, and query optimization. Redis serves triple duty as a high-speed cache for platform adapter responses, a session store for authenticated users, and a message broker for the real-time notification pipeline. NextAuth.js v4 manages authentication across OAuth providers, credential-based logins, and JWT sessions with rotation."),

    heading("2.1 Technology Stack Details", 2),

    makeTable(techHeaders, techRows, [2200, 2000, 1200, 4600]),
  ];
}

// ── Section 3: Global Infrastructure ──────────────────────────────────────────
function section3() {
  const infraHeaders = ["Region", "Primary Location", "CDN PoPs", "DB Replica", "Edge Functions"];
  const infraRows = [
    ["US-East", "Virginia, USA", "45+", "Primary", "Active"],
    ["US-West", "Oregon, USA", "30+", "Read Replica", "Active"],
    ["EU-West", "Frankfurt, Germany", "50+", "Primary (GDPR)", "Active"],
    ["EU-North", "Stockholm, Sweden", "20+", "Read Replica", "Active"],
    ["Asia-Pacific", "Singapore", "40+", "Primary", "Active"],
    ["Asia-East", "Tokyo, Japan", "25+", "Read Replica", "Active"],
    ["South America", "São Paulo, Brazil", "20+", "Primary", "Active"],
    ["Middle East", "Dubai, UAE", "15+", "Primary", "Active"],
    ["Africa", "Cape Town, SA", "10+", "Read Replica", "Passive"],
    ["Oceania", "Sydney, Australia", "12+", "Read Replica", "Active"],
  ];
  return [
    heading("3. Global Infrastructure"),

    body("DeliveryBoost operates a multi-region infrastructure spanning five continental clusters with automated failover and active-active redundancy. Each regional cluster consists of a Vercel Edge deployment for server-side rendering, a Cloudflare CDN configuration for static asset distribution, and a PostgreSQL database cluster with synchronous replication within the region and asynchronous replication across regions. This architecture ensures that a user in Mumbai experiences the same responsive interface as a user in Miami, with page load times consistently under 800 milliseconds."),

    body("Edge computing is the cornerstone of our global strategy. By deploying Next.js 16 edge functions at every Vercel Edge Network location, we can render personalized dashboard content within 50 milliseconds of a request, without routing to a centralized origin server. Cloudflare's 300+ points of presence cache API responses, platform logos, and static assets with intelligent cache keys that account for user locale, currency preference, and regional platform availability. Cache invalidation is event-driven, triggered by platform data updates rather than time-based expiration, ensuring freshness without unnecessary origin requests."),

    body("Database replication follows a multi-primary architecture where each continental region maintains a writable primary instance with synchronous replicas within the same data center and asynchronous replicas in other regions. Conflict resolution uses a last-writer-wins strategy with vector clocks for ordering, supplemented by application-level merge logic for concurrent edits to user preferences and auto-accept rules. The replication lag between regions averages under 200 milliseconds, which is imperceptible for the notification aggregation use case where eventual consistency is acceptable."),

    heading("3.1 Regional Deployment Map", 2),

    makeTable(infraHeaders, infraRows, [1800, 2200, 1400, 1800, 1800]),

    body("Each region is connected via dedicated cloud interconnects with 99.99% availability SLAs, ensuring that cross-region data synchronization and API routing operate without interruption. The Middle East and Africa clusters are the newest additions in v2.0, addressing growing demand from gig workers in Dubai, Riyadh, Lagos, and Nairobi who rely on DeliveryBoost to aggregate delivery opportunities from local platforms."),
  ];
}

// ── Section 4: Component Architecture ─────────────────────────────────────────
function section4() {
  const apiHeaders = ["API Route", "Method", "Description", "Auth"];
  const apiRows = [
    ["/api/auth/*", "GET/POST", "Authentication endpoints (login, callback, logout)", "Public"],
    ["/api/user/profile", "GET/PATCH", "User profile management and preferences", "Required"],
    ["/api/platforms", "GET", "List all supported platforms by region and category", "Required"],
    ["/api/platforms/connect", "POST", "Connect a delivery platform account via OAuth or credentials", "Required"],
    ["/api/platforms/disconnect", "DELETE", "Disconnect a platform and revoke tokens", "Required"],
    ["/api/notifications", "GET", "Fetch aggregated notifications across all connected platforms", "Required"],
    ["/api/notifications/poll", "GET", "4-second polling endpoint for real-time notification checks", "Required"],
    ["/api/orders", "GET", "List orders with filtering by platform, date, and status", "Required"],
    ["/api/orders/[id]", "GET/PATCH", "Individual order details and status updates", "Required"],
    ["/api/earnings", "GET", "Aggregated earnings across platforms with currency conversion", "Required"],
    ["/api/earnings/export", "POST", "Export earnings data as CSV, PDF, or XLSX", "Required"],
    ["/api/auto-accept/rules", "GET/POST", "Manage auto-accept rules for incoming delivery offers", "Required"],
    ["/api/auto-accept/rules/[id]", "PATCH/DELETE", "Update or delete a specific auto-accept rule", "Required"],
    ["/api/settings/notifications", "GET/PATCH", "Notification preferences per platform and category", "Required"],
    ["/api/settings/regional", "GET/PATCH", "Regional settings including currency, language, and timezone", "Required"],
    ["/api/currency/rates", "GET", "Live currency exchange rates for multi-currency earnings display", "Required"],
  ];
  return [
    heading("4. Component Architecture"),

    body("The frontend component architecture follows a modular, feature-based organization where each major domain of the application is encapsulated in its own component tree. The Navbar component provides persistent navigation with real-time notification badges, platform connection status indicators, and a global search bar. The Hero section serves as the landing page entry point, dynamically rendered based on the user's geographic region to display relevant platform logos, localized statistics, and culturally appropriate imagery."),

    body("The Dashboard component is the central hub of the authenticated experience, aggregating live notifications from all connected platforms into a unified, sortable, and filterable stream. It supports both list and card views, with color-coded categories (food in orange, grocery in green, pharmacy in blue, etc.) that allow gig workers to visually identify offer types at a glance. The Earnings component provides comprehensive financial analytics with daily, weekly, and monthly views, multi-currency conversion using live exchange rates, and export capabilities for tax reporting in over 40 jurisdictions."),

    body("The Platforms component manages the connection lifecycle for each delivery platform, supporting OAuth 2.0 flows for platforms with official APIs and credential-based login for those without. A visual platform gallery displays over 200 supported services organized by category, region, and popularity, with one-click connect functionality. The Pricing component handles subscription management with tiered plans (Free, Pro, Enterprise), Stripe integration for payment processing, and automatic tax calculation based on the user's billing address. The Settings component provides granular control over notification preferences, auto-accept rules, regional configurations, and account security options."),

    heading("4.1 Backend API Routes", 2),

    makeTable(apiHeaders, apiRows, [2800, 1200, 4400, 1000]),

    body("All API routes enforce authentication via NextAuth.js JWT tokens, with role-based access control for enterprise endpoints. Rate limiting is applied per-user using a sliding window algorithm in Redis, with configurable limits per endpoint tier. The polling endpoint (/api/notifications/poll) is optimized for minimal response size, returning only delta updates since the last poll to conserve bandwidth on mobile connections in regions with limited connectivity."),
  ];
}

// ── Section 5: Data Model ─────────────────────────────────────────────────────
function section5() {
  const entityHeaders = ["Entity", "Key Fields", "Relationships", "Index Strategy"];
  const entityRows = [
    ["User", "id, email, name, region, tier, createdAt", "Has many PlatformConnection, Order, EarningsSession, AutoAcceptRule, NotificationPreference", "B-tree on email, region, tier; GIN on name"],
    ["PlatformConnection", "id, userId, platformId, accessToken, refreshToken, status, lastSyncAt", "Belongs to User; Has many Order", "B-tree on userId, platformId, status; compound on (userId, platformId)"],
    ["Order", "id, userId, platformConnectionId, externalId, category, status, amount, currency, acceptedAt", "Belongs to User, PlatformConnection", "B-tree on userId, status, acceptedAt; compound on (userId, category, acceptedAt)"],
    ["EarningsSession", "id, userId, date, totalEarnings, currency, platformBreakdown, hoursOnline", "Belongs to User", "B-tree on userId, date; compound on (userId, date DESC)"],
    ["AutoAcceptRule", "id, userId, platformId, category, minAmount, maxDistance, enabled, priority", "Belongs to User", "B-tree on userId, enabled; compound on (userId, priority)"],
    ["NotificationPreference", "id, userId, platformId, category, soundEnabled, vibrationEnabled, quietHoursStart, quietHoursEnd", "Belongs to User", "B-tree on userId, platformId; compound on (userId, category)"],
    ["DeliveryCategory", "id, name, slug, icon, color, region, isActive", "Has many PlatformConnection, Order", "B-tree on slug, region, isActive; unique on slug"],
    ["RegionalPricing", "id, region, tier, monthlyPrice, yearlyPrice, currency, features", "Referenced by User.tier", "B-tree on region, tier; unique on (region, tier)"],
    ["CurrencyRate", "id, baseCurrency, targetCurrency, rate, updatedAt, source", "Referenced by EarningsSession, Order", "B-tree on baseCurrency, targetCurrency; unique on (baseCurrency, targetCurrency)"],
  ];
  return [
    heading("5. Data Model"),

    body("The DeliveryBoost data model is designed around nine core entities that capture the complete lifecycle of delivery notification aggregation, from user onboarding through platform connection, order acceptance, and earnings tracking. The model is normalized to third normal form (3NF) for data integrity while maintaining strategic denormalization in read-heavy paths, such as embedding platform breakdown summaries in the EarningsSession entity to avoid expensive join queries on dashboard loads."),

    body("The User entity serves as the central anchor, connected to all other entities through foreign key relationships. Each user maintains a region field that determines database shard placement, ensuring GDPR compliance for EU users whose data is always stored and processed within Frankfurt or Stockholm data centers. The PlatformConnection entity stores encrypted OAuth tokens and refresh tokens using AES-256 encryption, with automatic token rotation on a 90-day cycle to maintain security across all 200+ platform integrations."),

    body("The Order entity is the most write-heavy table in the system, receiving millions of inserts daily as delivery notifications stream in from connected platforms. A time-series partitioning strategy divides the orders table by month and region, enabling efficient queries for recent orders while archiving older data to cold storage. The AutoAcceptRule entity implements a priority-based rule engine where users can define acceptance criteria (minimum payment, maximum distance, preferred categories) that are evaluated in real-time against incoming offers."),

    heading("5.1 Entity Overview", 2),

    makeTable(entityHeaders, entityRows, [1800, 2800, 2600, 2800]),

    body("The DeliveryCategory entity uses a slug-based identification system that maps to standardized category codes across all 200+ platforms, enabling cross-platform comparison and filtering. RegionalPricing and CurrencyRate entities support the multi-currency, multi-region billing system, with exchange rates updated every 60 seconds from a consolidated feed of central bank and market data sources."),
  ];
}

// ── Section 6: Integration Layer ──────────────────────────────────────────────
function section6() {
  const catHeaders = ["Category", "Example Platforms", "Notification Types", "Avg. Volume"];
  const catRows = [
    ["Food Delivery", "UberEats, DoorDash, Deliveroo, Swiggy, GrabFood, Meituan", "Order offers, status updates, payment confirmations", "850K/hr"],
    ["Grocery", "Instacart, Gorillas, Getir, JioMart, Tesco, Carrefour", "Batch offers, substitution alerts, delivery window changes", "420K/hr"],
    ["Package / Parcel", "Amazon Flex, FedEx, UPS, DHL, BlueDart, Delhivery", "Delivery offers, pickup alerts, route optimization", "680K/hr"],
    ["Pharmacy", "CVS, Walgreens, 1mg, Netmeds, PharmEasy", "Prescription pickups, delivery offers, restock alerts", "180K/hr"],
    ["Express / Same-Day", "Postmates, Dunzo, Glovo, Gopuff, Wolt", "Instant delivery offers, rush assignments", "310K/hr"],
    ["Alcohol", "Drizly, Minibar, Saucey, Flaviar, Vivino", "Age-verified delivery offers, compliance alerts", "95K/hr"],
    ["Flowers", "1-800-Flowers, BloomNation, FTD, Interflora", "Arrangement orders, delivery scheduling", "45K/hr"],
    ["Pets", "Chewy, Petco, Wag!, Rover, PetBasics", "Delivery offers, pet supply orders, service bookings", "70K/hr"],
    ["Cannabis", "Eaze, Weedmaps, Leafly, Dutchie", "Compliance-verified delivery, inventory alerts", "55K/hr"],
    ["Courier / Document", "PostNord, DHL Express, SF Express, Yamato", "Document pickup, same-day courier, legal delivery", "120K/hr"],
    ["Q-Commerce", "Blinkit, Zepto, Jokr, Flink, Cajoo", "10-min delivery offers, inventory flash alerts", "290K/hr"],
    ["Meal Kit", "HelloFresh, Blue Apron, Home Chef, Gousto", "Kit assembly offers, delivery scheduling, substitutions", "65K/hr"],
    ["Moving", "TaskRabbit, Lugg, Dolly, Bellhops", "Moving job offers, scheduling confirmations", "30K/hr"],
    ["Return Logistics", "Happy Returns, Loop, Narvar, ReBOUND", "Return pickup offers, label generation, drop-off alerts", "110K/hr"],
  ];
  return [
    heading("6. Integration Layer"),

    body("The Integration Layer is the backbone of DeliveryBoost, providing a unified abstraction over 200+ delivery platforms through a standardized PlatformAdapter interface. Each platform adapter implements a common contract that normalizes platform-specific APIs, authentication flows, and data schemas into a consistent internal representation. This adapter pattern enables the platform to onboard new delivery services in days rather than weeks, as each adapter only needs to implement the interface methods while the core business logic remains platform-agnostic."),

    body("The PlatformAdapter interface defines seven core methods that every adapter must implement: authenticate(credentials) handles platform-specific OAuth or credential-based login; fetchNotifications(since) retrieves new delivery offers and status updates; acceptOrder(orderId) confirms acceptance of a delivery offer; declineOrder(orderId) rejects an offer; updateOrderStatus(orderId, status) reports delivery progress; fetchEarnings(period) retrieves payment and earnings data; and refreshToken() handles token renewal for OAuth-based connections. Each method includes comprehensive error handling with automatic retry logic, circuit breaker patterns for platform outages, and fallback responses that gracefully degrade functionality when a platform API is unavailable."),

    body("Platform adapters communicate with external APIs through a centralized HTTP client that enforces connection pooling, request queuing, and rate limiting per platform. The client implements exponential backoff with jitter for retry attempts, preventing thundering herd problems during platform API recoveries. All external API responses are cached in Redis with platform-specific TTL values, reducing redundant API calls by approximately 60% during peak hours. The integration layer also includes a webhook receiver for platforms that support push-based notifications, which are normalized and fed into the same processing pipeline as polled data."),

    heading("6.1 Supported Platform Categories", 2),

    makeTable(catHeaders, catRows, [1600, 2800, 2800, 1200]),

    body("The platform adapter registry currently includes 214 adapters covering all major delivery platforms worldwide, with new adapters added monthly as the team onboards regional services. Each adapter undergoes a rigorous certification process that validates notification parsing accuracy, authentication flow reliability, and earnings data consistency against manual test transactions before promotion to production."),
  ];
}

// ── Section 7: Real-Time Communication ────────────────────────────────────────
function section7() {
  return [
    heading("7. Real-Time Communication"),

    body("The real-time communication strategy in DeliveryBoost v2.0 follows a graduated approach, starting with a proven 4-second polling mechanism as the MVP and evolving toward server-sent events and WebSocket-based delivery. The polling endpoint (/api/notifications/poll) is optimized for minimal payload size, returning only new or updated notifications since the client's last poll timestamp. Each response includes a cursor token that the client sends on the next request, enabling delta synchronization that reduces average response size from 12KB to under 800 bytes for most polls."),

    body("The polling infrastructure is designed for massive concurrency, handling over 500,000 simultaneous polling connections during peak hours across all regions. Each poll request is served from the nearest edge function, which checks a Redis-backed notification cache before falling through to the regional database. The cache is populated by a background worker that continuously fetches updates from connected platforms and normalizes them into the internal notification format. This architecture ensures that 94% of poll requests are served entirely from cache with a median response time of 23 milliseconds."),

    body("The planned migration to Server-Sent Events (SSE) will eliminate the polling overhead while maintaining HTTP compatibility with corporate firewalls and restrictive network environments. The SSE implementation will use a connection-per-user model where each client maintains a persistent HTTP connection to the nearest edge relay, receiving push notifications in real-time as they arrive from platform adapters. A heartbeat mechanism sends keep-alive events every 30 seconds, enabling dead connection detection and automatic reconnection. The SSE rollout is planned for Q3 2026, starting with a 10% canary deployment in the US-East region."),

    body("The long-term WebSocket strategy envisions a bidirectional communication channel that supports not only notification delivery but also real-time command execution, such as instant order acceptance without a separate API round-trip. The WebSocket infrastructure will use a global edge relay network built on Cloudflare Durable Objects, maintaining connection state at the edge to enable seamless reconnection during network transitions (e.g., WiFi to cellular). This architecture will reduce end-to-end notification latency from the current 4-second polling cycle to under 200 milliseconds, critical for competitive gig work environments where milliseconds determine who accepts a high-value delivery offer."),
  ];
}

// ── Section 8: Multi-Region Data Architecture ─────────────────────────────────
function section8() {
  return [
    heading("8. Multi-Region Data Architecture"),

    body("Data residency and sovereignty are first-class concerns in the DeliveryBoost architecture, particularly given our presence in 190 countries with varying regulatory requirements. The multi-region data architecture ensures that EU user data is stored and processed exclusively within EU data centers (Frankfurt and Stockholm) in full compliance with GDPR Article 44-49 requirements for data transfers. Similarly, users in Brazil have their data processed in São Paulo under LGPD compliance, and users in India are served from Singapore with adherence to the Digital Personal Data Protection Act 2023."),

    body("Each regional database cluster operates with a primary-write, read-replica topology where writes are directed to the regional primary and reads are distributed across synchronous replicas within the same data center. Cross-region data synchronization uses a logical replication model with conflict-free replicated data types (CRDTs) for user preferences and settings that may be edited from multiple regions. The synchronization bus processes an average of 3.2 million replication events per hour with a p99 latency of 450 milliseconds between the most distant regions (South America to Asia-Pacific)."),

    body("Database sharding is implemented at the user level, where a consistent hash of the user's region assignment determines the target shard. Each regional shard is independently scalable, supporting horizontal partitioning by user ID ranges when individual shards exceed capacity thresholds. The shard routing layer is implemented as a Prisma middleware plugin that transparently directs queries to the correct regional cluster based on the authenticated user's region field, eliminating the need for application-level shard awareness in business logic code."),

    body("Backup and disaster recovery follow a 3-2-1 strategy: three copies of all data, stored on two different media types, with one copy in a geographically separate region. Automated daily snapshots are retained for 90 days, with point-in-time recovery capability for the last 30 days. Cross-region backup verification runs weekly, confirming that data restored from a remote backup matches the primary dataset checksum. The recovery time objective (RTO) for a complete regional failure is under 15 minutes, achieved through automated DNS failover and pre-warmed standby clusters."),
  ];
}

// ── Section 9: Scalability ────────────────────────────────────────────────────
function section9() {
  return [
    heading("9. Scalability"),

    body("DeliveryBoost is architected to scale from the current 4.2 million active users to over 100 million users without fundamental architectural changes. Horizontal auto-scaling is the primary scaling mechanism, with Vercel Edge Functions scaling elastically from zero to millions of concurrent executions without configuration changes. For stateful components like the Redis cache and PostgreSQL databases, vertical scaling provides immediate capacity increases while horizontal scaling through read replicas and sharding addresses long-term growth."),

    body("Database sharding by region provides the foundational scaling strategy, with each of the five primary regions operating an independent database cluster that scales based on regional user density. Within each region, tables are further partitioned using time-series partitioning for the orders table (monthly partitions) and hash partitioning for the users table. Connection pooling through PgBouncer manages up to 10,000 concurrent database connections per region with a pool of 100 actual PostgreSQL connections, reducing connection overhead by 99% while maintaining sub-millisecond connection acquisition times."),

    body("The CDN optimization layer implements a three-tier caching strategy: browser cache (1 minute for dynamic content, 1 year for static assets), edge cache (5 minutes for API responses, 24 hours for platform assets), and origin cache (Redis with platform-specific TTLs). Cache hit rates average 94% for static assets, 78% for API responses, and 62% for personalized content, significantly reducing origin load. Cache warming runs during off-peak hours, pre-populating edge caches with predicted high-demand content based on historical access patterns and upcoming promotional events on partner platforms."),

    body("Capacity planning for 100M+ users projects the following resource requirements: 50 Vercel Edge Function instances per region (250 total), 20 PostgreSQL read replicas per region (100 total), 15 Redis cluster nodes per region (75 total), and 500GB of CDN cache per region (2.5TB total). Load testing with simulated traffic patterns confirms that this configuration handles 3x projected peak load (approximately 25 million concurrent users) with a p95 response time under 500 milliseconds across all endpoints."),
  ];
}

// ── Section 10: Monitoring & Observability ────────────────────────────────────
function section10() {
  const monHeaders = ["Tool", "Category", "Scope", "Alerting"];
  const monRows = [
    ["Vercel Analytics", "Performance", "Web Vitals (LCP, FID, CLS), function duration, edge latency", "Automatic threshold alerts"],
    ["Sentry", "Error Tracking", "Exception capture, performance traces, release tracking", "Slack + PagerDuty for new errors"],
    ["Axiom", "Logging", "Structured logs, query analytics, audit trails", "Custom log-based alerts"],
    ["Datadog APM", "Application Performance", "Distributed traces, service maps, dependency analysis", "SLA burn rate alerts"],
    ["PagerDuty", "Incident Management", "On-call scheduling, escalation policies, incident timelines", "Phone + SMS + push notifications"],
    ["Cloudflare Analytics", "Infrastructure", "CDN hit rates, bandwidth, threat analytics, bot scores", "Anomaly-based traffic alerts"],
    ["Grafana", "Dashboards", "Regional performance, business metrics, capacity planning", "Visual threshold indicators"],
  ];
  return [
    heading("10. Monitoring & Observability"),

    body("The monitoring and observability stack provides comprehensive visibility into every layer of the DeliveryBoost platform, from frontend user experience metrics to backend database query performance. Vercel Analytics captures Core Web Vitals in real-time across all regions, with segmented dashboards that highlight performance differences between desktop and mobile users, fast and slow network connections, and first-world versus developing-world connectivity scenarios. These metrics feed directly into automated alerting that triggers when LCP exceeds 2.5 seconds or error rates surpass 0.1% for any regional deployment."),

    body("Sentry provides deep error tracking with full stack traces, source map support, and release-based error association that enables the engineering team to correlate deployments with regression patterns. Each error is enriched with user context (region, platform connections, device type) and breadcrumbs that trace the user's journey leading to the failure. Performance monitoring captures transaction traces for critical paths like the notification polling endpoint and order acceptance flow, with automatic detection of N+1 database queries and excessive API call patterns that could indicate integration layer inefficiencies."),

    body("Axiom serves as the centralized logging platform, ingesting structured logs from all API routes, platform adapters, and background workers. Logs are enriched with correlation IDs that enable end-to-end request tracing from the initial client request through edge rendering, API processing, database queries, and external platform API calls. The query engine supports full-text search across all log fields with sub-second response times on billions of log entries, enabling rapid root cause analysis during incident investigations. Audit logs for sensitive operations (authentication, credential storage, earnings access) are retained for 7 years in compliance with financial regulations across multiple jurisdictions."),

    heading("10.1 Monitoring Stack Details", 2),

    makeTable(monHeaders, monRows, [2000, 2000, 3400, 2600]),

    body("Regional dashboards in Grafana provide operations teams with at-a-glance health indicators for each geographic cluster, including real-time user counts, notification throughput, platform adapter health scores, and database replication lag. Each dashboard includes predictive capacity indicators that forecast when a regional cluster will hit resource thresholds based on current growth trajectories, enabling proactive scaling decisions before performance degradation occurs."),
  ];
}

// ── Build the Document ─────────────────────────────────────────────────────────
async function main() {
  const doc = new Document({
    features: { updateFields: true },
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 24, color: C.body },
          paragraph: { spacing: { line: 360 } },
        },
        heading1: {
          run: { font: "Times New Roman", size: 32, bold: true, color: C.primary },
          paragraph: { spacing: { before: 400, after: 200 } },
        },
        heading2: {
          run: { font: "Times New Roman", size: 28, bold: true, color: C.primary },
          paragraph: { spacing: { before: 300, after: 150 } },
        },
        heading3: {
          run: { font: "Times New Roman", size: 24, bold: true, color: C.accent },
          paragraph: { spacing: { before: 200, after: 100 } },
        },
      },
    },
    sections: [
      // ── Cover Page Section (dark background) ──────────────────────────────
      {
        properties: {
          page: {
            margin: { top: 0, bottom: 0, left: 0, right: 0 },
            size: { width: 12240, height: 15840 },
          },
        },
        children: buildCoverPage(),
      },

      // ── Table of Contents Section (Roman numeral pages) ───────────────────
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
            size: { width: 12240, height: 15840 },
          },
          pageNumberStart: 1,
          pageNumberFormatType: NumberFormat.LOWER_ROMAN,
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "DeliveryBoost Technical Architecture v2.0",
                    size: 16,
                    font: "Calibri",
                    color: C.gray,
                    italics: true,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Page ", size: 18, font: "Calibri", color: C.gray }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Calibri", color: C.gray }),
                ],
              }),
            ],
          }),
        },
        children: buildTOC(),
      },

      // ── Body Section (Arabic page numbers) ───────────────────────────────
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
            size: { width: 12240, height: 15840 },
          },
          pageNumberStart: 1,
          pageNumberFormatType: NumberFormat.DECIMAL,
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                border: {
                  bottom: { style: BorderStyle.SINGLE, size: 6, color: C.accent, space: 4 },
                },
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: "DeliveryBoost Technical Architecture v2.0 | Global Infrastructure",
                    size: 16,
                    font: "Calibri",
                    color: C.accent,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                border: {
                  top: { style: BorderStyle.SINGLE, size: 4, color: C.lightGray, space: 4 },
                },
                spacing: { before: 100 },
                children: [
                  new TextRun({ text: "Page ", size: 18, font: "Calibri", color: C.gray }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Calibri", color: C.gray }),
                  new TextRun({ text: " | DeliveryBoost © 2026 | Internal", size: 18, font: "Calibri", color: C.gray }),
                ],
              }),
            ],
          }),
        },
        children: [
          ...section1(),
          ...section2(),
          ...section3(),
          ...section4(),
          ...section5(),
          ...section6(),
          ...section7(),
          ...section8(),
          ...section9(),
          ...section10(),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = "/home/z/my-project/download/capnotif-docs/DeliveryBoost_Technical_Architecture.docx";
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Document generated: ${outputPath}`);
  console.log(`   Size: ${(buffer.length / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error("❌ Error generating document:", err);
  process.exit(1);
});
