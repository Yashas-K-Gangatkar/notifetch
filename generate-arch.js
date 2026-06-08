const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  TableOfContents, SectionType,
} = require("docx");
const fs = require("fs");

// Palette: DM-1 (Deep Cyan) for tech architecture
const P = {
  primary: "162235", body: "000000", secondary: "5A6080",
  accent: "1B6B7A", surface: "EDF3F5",
  cover: { titleColor: "FFFFFF", subtitleColor: "B0B8C0", metaColor: "90989F", footerColor: "687078" },
  table: { headerBg: "1B6B7A", headerText: "FFFFFF", accentLine: "1B6B7A", innerLine: "C8DDE2", surface: "EDF3F5" },
};

const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const allNoBorders = { top: NB, bottom: NB, left: NB, right: NB, insideHorizontal: NB, insideVertical: NB };
const pgSize = { width: 11906, height: 16838 };
const pgMargin = { top: 1440, bottom: 1440, left: 1701, right: 1417 };
function c(hex) { return hex.replace("#", ""); }

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 360 : 240, after: 120, line: 312 },
    children: [new TextRun({ text, bold: true, color: c(P.primary), font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: level === HeadingLevel.HEADING_1 ? 32 : level === HeadingLevel.HEADING_2 ? 28 : 24 })],
  });
}

function body(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 312, after: 80 },
    children: [new TextRun({ text, size: 24, color: c(P.body), font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })],
  });
}

function makeTable(headers, rows) {
  const t = P.table;
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: c(t.accentLine) },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: c(t.accentLine) },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: c(t.innerLine) },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        tableHeader: true, cantSplit: true,
        children: headers.map(h => new TableCell({
          width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: c(t.headerBg) },
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 21, color: c(t.headerText), font: { ascii: "Times New Roman", eastAsia: "SimHei" } })] })],
        })),
      }),
      ...rows.map((row, idx) => new TableRow({
        cantSplit: true,
        children: row.map(cell => new TableCell({
          width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: idx % 2 === 0 ? c(t.surface) : "FFFFFF" },
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: cell, size: 21, color: c(P.body), font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })] })],
        })),
      })),
    ],
  });
}

function buildCover() {
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: allNoBorders,
      rows: [new TableRow({
        height: { value: 16838, rule: "exact" },
        children: [new TableCell({
          width: { size: 100, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.CLEAR, fill: "162235" },
          verticalAlign: "top",
          children: [
            new Paragraph({ spacing: { before: 5000 } }),
            new Paragraph({
              spacing: { before: 200, after: 100, line: 1012, lineRule: "atLeast" },
              children: [new TextRun({ text: "CapNotif", bold: true, size: 80, color: P.cover.titleColor, font: { ascii: "Times New Roman", eastAsia: "SimHei" } })],
            }),
            new Paragraph({
              spacing: { before: 200, after: 100, line: 460, lineRule: "atLeast" },
              indent: { left: 100 },
              border: { left: { style: BorderStyle.SINGLE, size: 18, color: "37DCF2", space: 12 } },
              children: [new TextRun({ text: "    Technical Architecture Document", size: 32, color: P.cover.subtitleColor, font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })],
            }),
            new Paragraph({ spacing: { before: 600 } }),
            ...["Version 1.0", "Date: June 7, 2026", "Author: Yashas K. Gangatkar", "Classification: Internal"].map(m => new Paragraph({
              spacing: { before: 80, line: 312 },
              indent: { left: 200 },
              children: [new TextRun({ text: m, size: 22, color: P.cover.metaColor, font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })],
            })),
          ],
        })],
      })],
    }),
  ];
}

function buildBody() {
  return [
    heading("1. Architecture Overview"),
    body("CapNotif follows a modern web application architecture built on the Next.js 16 framework with the App Router paradigm. The system employs a client-server model where the Next.js application serves as both the frontend rendering engine and the backend API layer. This monolithic deployment approach is intentionally chosen for the MVP phase to minimize operational complexity while maintaining the ability to decompose into microservices as the application scales."),
    body("The architecture is organized into four primary layers: the Presentation Layer responsible for user interface rendering and client-side interactions, the Application Layer handling business logic and API route processing, the Integration Layer managing communication with external delivery platform APIs, and the Data Layer providing persistent storage and caching. Each layer communicates through well-defined interfaces, enabling independent testing and future replacement of components without cascading changes across the system."),
    body("The deployment target is Vercel, leveraging its edge network for global content delivery and serverless functions for API route execution. This choice provides automatic scaling, zero-configuration deployments, and built-in CI/CD integration through GitHub. For data persistence, the architecture supports both Vercel KV (Redis) for session management and real-time data, and Vercel Postgres for structured data storage including user accounts, platform credentials, and historical earnings data."),

    heading("2. Technology Stack"),
    heading("2.1 Frontend Stack", HeadingLevel.HEADING_2),
    makeTable(
      ["Component", "Technology", "Version", "Purpose"],
      [
        ["Framework", "Next.js", "16.x", "React framework with App Router, SSR, and API routes"],
        ["Language", "TypeScript", "5.x", "Type-safe JavaScript for reduced runtime errors"],
        ["Styling", "Tailwind CSS", "4.x", "Utility-first CSS framework for rapid UI development"],
        ["UI Library", "shadcn/ui", "latest", "Accessible, customizable React component primitives"],
        ["Theme", "next-themes", "latest", "Dark/light mode with system preference detection"],
        ["Font", "Inter", "via next/font", "Optimized web font with automatic subsetting"],
        ["Build Tool", "Turbopack", "bundled", "Fast bundler for development and production builds"],
      ]
    ),

    heading("2.2 Backend Stack", HeadingLevel.HEADING_2),
    makeTable(
      ["Component", "Technology", "Purpose"],
      [
        ["API Framework", "Next.js API Routes", "RESTful endpoints for platform integration and user management"],
        ["Database", "Vercel Postgres (Neon)", "Primary structured data storage for users, orders, earnings"],
        ["Cache", "Vercel KV (Redis)", "Session storage, rate limiting, real-time order queue"],
        ["Authentication", "NextAuth.js", "User authentication with OAuth and credential providers"],
        ["Encryption", "Node.js crypto module", "AES-256-GCM encryption for platform credentials at rest"],
        ["Job Queue", "Vercel Cron + Inngest", "Scheduled tasks for order polling and data synchronization"],
      ]
    ),

    heading("2.3 Infrastructure", HeadingLevel.HEADING_2),
    makeTable(
      ["Component", "Service", "Purpose"],
      [
        ["Hosting", "Vercel", "Serverless deployment with edge network CDN"],
        ["CI/CD", "GitHub Actions + Vercel", "Automated testing, building, and deployment"],
        ["Monitoring", "Vercel Analytics + Sentry", "Performance monitoring and error tracking"],
        ["Logging", "Axiom", "Structured log aggregation and query"],
        ["Secrets", "Vercel Environment Variables", "Encrypted secret management for API keys and credentials"],
      ]
    ),

    heading("3. System Architecture Diagram Description"),
    body("The system architecture follows a layered approach with clear separation of concerns. At the top, the Client Browser communicates with the Next.js application through HTTPS. The Presentation Layer renders React Server Components for initial page loads and Client Components for interactive elements such as the live dashboard, order cards, and settings panels. State management uses React hooks (useState, useEffect) with a potential migration to Zustand for complex cross-component state."),
    body("The Application Layer processes requests through Next.js API Routes, which serve as the backend endpoints. These routes handle user authentication, platform credential management, order aggregation, and earnings data processing. Each API route implements input validation using Zod schemas, rate limiting via Vercel KV, and structured error handling with consistent response formats."),
    body("The Integration Layer abstracts communication with external delivery platform APIs through a unified PlatformAdapter interface. Each supported platform (DoorDash, UberEats, Grubhub, Instacart, Amazon Flex) has a concrete adapter implementation that translates platform-specific API responses into the common Order model. This adapter pattern enables adding new platforms with minimal changes to the application layer, as new adapters simply implement the existing interface contract."),
    body("The Data Layer uses Vercel Postgres for persistent storage with a schema managed by Prisma ORM, and Vercel KV for ephemeral data such as active session state and real-time order queues. The database schema follows a normalized design with separate tables for users, platform_connections, orders, earnings_sessions, and auto_accept_rules."),

    heading("4. Component Architecture"),
    heading("4.1 Frontend Component Hierarchy", HeadingLevel.HEADING_2),
    body("The frontend is organized as a single-page application with section-based navigation. The root page component (app/page.tsx) composes six primary sections, each implemented as an independent React component with its own state management and props interface. The component hierarchy promotes reusability and testability by keeping each section self-contained with clearly defined data contracts."),
    makeTable(
      ["Component", "Location", "Responsibility"],
      [
        ["Navbar", "src/components/navbar.tsx", "Navigation bar with logo, status indicators, and user menu"],
        ["HeroSection", "src/components/hero-section.tsx", "Landing hero with value proposition and animated notification cards"],
        ["DashboardSection", "src/components/dashboard-section.tsx", "Live order feed with real-time auto-refresh, accept/dismiss actions"],
        ["EarningsSection", "src/components/earnings-section.tsx", "Weekly earnings chart, session stats, recent orders list"],
        ["PlatformsSection", "src/components/platforms-section.tsx", "Platform connection cards with toggle switches and status"],
        ["PricingSection", "src/components/pricing-section.tsx", "Free vs Premium tier comparison with CTA"],
        ["SettingsSection", "src/components/settings-section.tsx", "Auto-accept rules, notification toggles, dark mode switch"],
      ]
    ),

    heading("4.2 Backend API Routes", HeadingLevel.HEADING_2),
    makeTable(
      ["Route", "Method", "Purpose", "Auth Required"],
      [
        ["/api/auth/*", "GET/POST", "NextAuth authentication endpoints", "No"],
        ["/api/platforms", "GET", "List connected platforms and their status", "Yes"],
        ["/api/platforms/connect", "POST", "Initiate platform OAuth connection", "Yes"],
        ["/api/platforms/disconnect", "POST", "Remove platform connection and revoke tokens", "Yes"],
        ["/api/orders/feed", "GET", "Fetch aggregated real-time order feed", "Yes"],
        ["/api/orders/accept", "POST", "Accept a specific order via platform API", "Yes"],
        ["/api/orders/dismiss", "POST", "Dismiss an order from the feed", "Yes"],
        ["/api/earnings/summary", "GET", "Fetch weekly and session earnings data", "Yes"],
        ["/api/settings/auto-accept", "GET/PUT", "Manage auto-accept rule configuration", "Yes (Premium)"],
        ["/api/settings/notifications", "GET/PUT", "Manage notification preferences", "Yes"],
        ["/api/subscription", "GET/POST", "Manage premium subscription status", "Yes"],
      ]
    ),

    heading("5. Data Model"),
    heading("5.1 Core Entities", HeadingLevel.HEADING_2),
    makeTable(
      ["Entity", "Key Fields", "Relationships"],
      [
        ["User", "id, email, name, tier, created_at", "has many PlatformConnections, Orders, EarningsSessions"],
        ["PlatformConnection", "id, user_id, platform, access_token, refresh_token, status, connected_at", "belongs to User"],
        ["Order", "id, user_id, platform, order_id, restaurant, payout, distance, rating, status, created_at", "belongs to User"],
        ["EarningsSession", "id, user_id, start_time, end_time, total_earnings, orders_count", "belongs to User, has many Orders"],
        ["AutoAcceptRule", "id, user_id, min_payout, max_distance, min_rating, enabled", "belongs to User"],
        ["NotificationPreference", "id, user_id, push_enabled, sound_enabled, quiet_hours_start, quiet_hours_end", "belongs to User"],
      ]
    ),

    heading("5.2 Database Schema (Prisma)", HeadingLevel.HEADING_2),
    body("The Prisma schema defines the database structure with referential integrity enforced through foreign key constraints. Enum types are used for platform identifiers and order statuses to ensure data consistency. Timestamps are stored in UTC with timezone awareness. Sensitive fields such as access tokens are encrypted at the application layer before storage, with the encryption key managed through Vercel environment variables."),
    body("The schema supports soft deletes through a deleted_at timestamp field on critical entities, enabling data recovery and audit trails. Indexes are defined on frequently queried columns including user_id, platform, status, and created_at to ensure optimal query performance as the dataset grows. Composite indexes cover common query patterns such as fetching orders by user and date range."),

    heading("6. Integration Layer"),
    heading("6.1 Platform Adapter Pattern", HeadingLevel.HEADING_2),
    body("Each delivery platform integration implements a common PlatformAdapter interface that defines the contract for all platform-specific operations. This interface includes methods for authentication, order retrieval, order acceptance, order decline, and credential refresh. The adapter pattern ensures that the application layer remains decoupled from platform-specific API details, enabling seamless addition of new platforms and simplifying maintenance when platforms update their APIs."),
    makeTable(
      ["Method", "Description", "Return Type"],
      [
        ["authenticate(credentials)", "Validate platform credentials and obtain access tokens", "AuthResult"],
        ["getOrders(accessToken)", "Fetch pending orders from the platform", "Order[]"],
        ["acceptOrder(accessToken, orderId)", "Accept a specific order on the platform", "AcceptResult"],
        ["dismissOrder(accessToken, orderId)", "Decline or dismiss an order on the platform", "DismissResult"],
        ["refreshAuth(refreshToken)", "Refresh expired access tokens", "AuthResult"],
        ["getConnectionStatus(accessToken)", "Check if the platform connection is active", "ConnectionStatus"],
      ]
    ),

    heading("6.2 Supported Platforms", HeadingLevel.HEADING_2),
    makeTable(
      ["Platform", "Auth Method", "API Type", "Rate Limit"],
      [
        ["DoorDash", "OAuth 2.0", "REST API", "100 req/min"],
        ["UberEats", "OAuth 2.0", "REST API", "60 req/min"],
        ["Grubhub", "API Key + OAuth", "REST API", "60 req/min"],
        ["Instacart", "OAuth 2.0", "REST API", "30 req/min"],
        ["Amazon Flex", "OAuth 2.0", "REST API", "50 req/min"],
      ]
    ),

    heading("7. Real-Time Communication"),
    body("The real-time order notification system uses a polling-based architecture for the MVP, with a planned migration to WebSocket-based push notifications in a future release. The current implementation uses a 4-second polling interval on the client side, triggered by a useEffect hook in the DashboardSection component. Each poll cycle fetches new orders from the /api/orders/feed endpoint, which aggregates pending orders from all connected platforms."),
    body("On the server side, the order polling is orchestrated by an Inngest background job that independently polls each connected platform at configurable intervals. Discovered orders are normalized through the platform adapter layer, deduplicated against recently shown orders, and queued in Vercel KV for fast retrieval by the client-facing API endpoint. This architecture ensures that the client never directly interacts with platform APIs, maintaining security and enabling server-side caching and rate limit management."),
    body("Future enhancements will introduce Server-Sent Events (SSE) as an intermediate step before full WebSocket adoption, providing near-instant order delivery without the overhead of establishing and maintaining persistent bidirectional connections. The SSE approach is well-suited for the primarily unidirectional data flow of order notifications, where the server pushes updates to the client and the client sends occasional accept/dismiss actions via standard HTTP requests."),

    heading("8. Security Architecture"),
    heading("8.1 Authentication & Authorization", HeadingLevel.HEADING_2),
    body("User authentication is managed by NextAuth.js, supporting email/password credentials and OAuth providers including Google and GitHub. Session management uses HTTP-only secure cookies with CSRF protection. Platform-level authentication uses OAuth 2.0 authorization code flow with PKCE, ensuring that platform credentials are never exposed to the client browser. Access tokens are stored encrypted in the database, and refresh tokens are used to maintain long-lived platform connections without requiring user re-authentication."),

    heading("8.2 Data Encryption", HeadingLevel.HEADING_2),
    body("All sensitive data at rest is encrypted using AES-256-GCM with a 256-bit encryption key stored in Vercel environment variables. This includes platform access tokens, refresh tokens, and any personally identifiable information. Data in transit is protected by TLS 1.3 enforced at the Vercel edge network level. Database connections use SSL certificates for encryption between the application and Vercel Postgres. The encryption implementation uses the Node.js built-in crypto module with constant-time comparison for HMAC verification to prevent timing attacks."),

    heading("8.3 API Security", HeadingLevel.HEADING_2),
    body("All API routes enforce authentication via NextAuth session validation. Rate limiting is implemented at two levels: global rate limiting via Vercel KV with a sliding window algorithm (100 requests per minute per user), and per-platform rate limiting to respect external API quotas. Input validation uses Zod schemas on all API endpoints, with strict type checking and sanitization of user-supplied data. CORS policies restrict API access to the CapNotif domain only, and security headers including Content-Security-Policy, X-Frame-Options, and Strict-Transport-Security are configured via Next.js middleware."),

    heading("9. Deployment Architecture"),
    body("CapNotif is deployed on Vercel with a GitOps workflow. Every push to the main branch triggers an automatic deployment through Vercel's GitHub integration. Preview deployments are created for pull requests, enabling code review with live previews. The production deployment uses Vercel's edge network for global content delivery, with API routes executed as serverless functions in the region closest to the user."),
    body("Environment-specific configuration is managed through Vercel environment variables with separate secrets for production, preview, and development environments. Database migrations are executed through Prisma Migrate during the deployment build step, with rollback capabilities for failed migrations. Monitoring and alerting are configured through Vercel Analytics for performance metrics and Sentry for error tracking, with PagerDuty integration for critical incident notification."),

    heading("10. Scalability Considerations"),
    body("The architecture is designed to scale horizontally through Vercel's serverless infrastructure. API routes automatically scale based on incoming request volume, and the edge network distributes static assets globally. The primary scalability bottleneck is expected to be the external platform API rate limits, which are managed through the server-side polling architecture with intelligent rate limit tracking and adaptive polling intervals."),
    body("Database scalability is addressed through connection pooling via Prisma's built-in connection pool, read replicas for analytics queries, and table partitioning for the orders table by date. Vercel KV provides sub-millisecond latency for real-time data access and automatically scales to handle millions of operations per second. As the user base grows beyond 100,000 monthly active users, the architecture supports migration to dedicated database instances and dedicated caching layers without requiring application-level changes."),

    heading("11. Monitoring & Observability"),
    makeTable(
      ["Observability Pillar", "Tool", "Metrics Covered"],
      [
        ["Performance", "Vercel Analytics", "Core Web Vitals, API latency, page load times"],
        ["Errors", "Sentry", "Exception tracking, error grouping, release tracking"],
        ["Logs", "Axiom", "Structured query logs, API access logs, platform integration logs"],
        ["Uptime", "Vercel Monitoring", "Deployment health, function execution status"],
        ["Business", "Custom Analytics", "Orders processed, acceptance rate, session duration"],
        ["Security", "Vercel Firewall", "DDoS detection, suspicious request patterns"],
      ]
    ),
  ];
}

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" }, size: 24, color: c(P.body) },
        paragraph: { spacing: { line: 312 } },
      },
      heading1: {
        run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 32, bold: true, color: c(P.primary) },
        paragraph: { spacing: { before: 360, after: 160, line: 312 } },
      },
      heading2: {
        run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 28, bold: true, color: c(P.primary) },
        paragraph: { spacing: { before: 240, after: 120, line: 312 } },
      },
      heading3: {
        run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 24, bold: true, color: c(P.primary) },
        paragraph: { spacing: { before: 200, after: 100, line: 312 } },
      },
    },
  },
  sections: [
    {
      properties: { page: { size: pgSize, margin: { top: 0, bottom: 0, left: 0, right: 0 } } },
      children: buildCover(),
    },
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { size: pgSize, margin: pgMargin, pageNumbers: { start: 1, formatType: NumberFormat.UPPER_ROMAN } },
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080" })],
          })],
        }),
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 480, after: 360 },
          children: [new TextRun({ text: "Table of Contents", bold: true, size: 32, font: { ascii: "Times New Roman", eastAsia: "SimHei" } })],
        }),
        new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
        new Paragraph({
          spacing: { before: 200 },
          children: [new TextRun({ text: "Note: This Table of Contents is generated via field codes. To ensure page number accuracy after editing, please right-click the TOC and select \"Update Field.\"", italics: true, size: 18, color: "888888" })],
        }),
        new Paragraph({ children: [new PageBreak()] }),
      ],
    },
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { size: pgSize, margin: pgMargin, pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "CapNotif Technical Architecture v1.0", size: 18, color: "808080", font: { ascii: "Times New Roman" } })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080" })],
          })],
        }),
      },
      children: buildBody(),
    },
  ],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/home/z/my-project/download/capnotif-docs/CapNotif_Technical_Architecture.docx", buf);
  console.log("Technical Architecture generated successfully");
});
