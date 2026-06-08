const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  PageBreak,
  BorderStyle,
  ShadingType,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  VerticalAlign,
  TabStopType,
  TabStopPosition,
  TableOfContents,
  convertInchesToTwip,
} = require("docx");

// ── Palette ────────────────────────────────────────────────────────
const C = {
  primary: "1A2330",
  body: "000000",
  accent: "D4875A",
  surface: "F8F0EB",
  white: "FFFFFF",
  tableHeader: "D4875A",
  lightGray: "E8E0DA",
  medGray: "B0A89E",
  darkGray: "4A4A4A",
};

const noBorder = { style: BorderStyle.NONE, size: 0, color: C.white };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: C.medGray };

// ── Helper: Heading ────────────────────────────────────────────────
function heading(text, level = 1) {
  const sizeMap = { 1: 32, 2: 28, 3: 24 };
  const sz = sizeMap[level] || 28;
  return new Paragraph({
    heading: level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
    spacing: { before: level === 1 ? 360 : 280, after: 160 },
    children: [
      new TextRun({ text, bold: true, size: sz, font: "Times New Roman", color: C.primary }),
    ],
  });
}

// ── Helper: Body paragraph ────────────────────────────────────────
function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.afterSpacing ?? 120, before: opts.beforeSpacing ?? 0 },
    alignment: opts.alignment ?? AlignmentType.JUSTIFIED,
    indent: opts.indent ? { left: opts.indent } : undefined,
    children: [
      new TextRun({ text, size: 24, font: "Times New Roman", color: C.body, bold: opts.bold ?? false, italics: opts.italics ?? false }),
    ],
  });
}

// ── Helper: Bold-label inline paragraph ───────────────────────────
function labeledParagraph(label, value) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: label, bold: true, size: 24, font: "Times New Roman", color: C.primary }),
      new TextRun({ text: value, size: 24, font: "Times New Roman", color: C.body }),
    ],
  });
}

// ── Helper: Given/When/Then acceptance criteria ──────────────────
function acceptanceCriteria(criteria) {
  const paragraphs = [];
  for (const c of criteria) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 60 },
        indent: { left: 360 },
        children: [
          new TextRun({ text: c.type + " ", bold: true, size: 22, font: "Times New Roman", color: c.type === "Given" ? "2E7D32" : c.type === "When" ? C.accent : "1565C0" }),
          new TextRun({ text: c.text, size: 22, font: "Times New Roman", color: C.body }),
        ],
      })
    );
  }
  return paragraphs;
}

// ── Helper: Make Table ─────────────────────────────────────────────
function makeTable(headers, rows, colWidths) {
  const borders = {
    top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder,
    insideHorizontal: thinBorder, insideVertical: thinBorder,
  };

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) =>
      new TableCell({
        width: colWidths ? { size: colWidths[i], type: WidthType.DXA } : undefined,
        shading: { type: ShadingType.CLEAR, fill: C.tableHeader },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 60 },
            children: [new TextRun({ text: h, bold: true, size: 22, font: "Times New Roman", color: C.white })],
          }),
        ],
      })
    ),
  });

  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: row.map((cell, i) =>
          new TableCell({
            width: colWidths ? { size: colWidths[i], type: WidthType.DXA } : undefined,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
                spacing: { before: 40, after: 40 },
                children: [new TextRun({ text: String(cell), size: 21, font: "Times New Roman", color: C.body })],
              }),
            ],
          })
        ),
      })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders,
    rows: [headerRow, ...dataRows],
  });
}

// ── Helper: Ticket card ───────────────────────────────────────────
function ticketCard(t) {
  const elements = [];
  elements.push(
    new Paragraph({
      spacing: { before: 240, after: 80 },
      border: { left: { style: BorderStyle.SINGLE, size: 12, color: C.accent, space: 8 } },
      children: [
        new TextRun({ text: `${t.id}: `, bold: true, size: 26, font: "Times New Roman", color: C.accent }),
        new TextRun({ text: t.title, bold: true, size: 26, font: "Times New Roman", color: C.primary }),
      ],
    })
  );

  elements.push(
    labeledParagraph("Epic: ", t.epic),
    labeledParagraph("Priority: ", t.priority),
    labeledParagraph("Story Points: ", String(t.points)),
    labeledParagraph("Sprint: ", t.sprint)
  );

  elements.push(
    new Paragraph({
      spacing: { before: 100, after: 60 },
      children: [new TextRun({ text: "Description", bold: true, size: 24, font: "Times New Roman", color: C.primary })],
    })
  );
  for (const descLine of t.description) {
    elements.push(body(descLine));
  }

  elements.push(
    new Paragraph({
      spacing: { before: 100, after: 60 },
      children: [new TextRun({ text: "Acceptance Criteria", bold: true, size: 24, font: "Times New Roman", color: C.primary })],
    })
  );
  elements.push(...acceptanceCriteria(t.criteria));

  elements.push(
    new Paragraph({
      spacing: { before: 80, after: 80 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.lightGray, space: 4 } },
      children: [],
    })
  );

  return elements;
}

// ── Helper: Spacer ─────────────────────────────────────────────────
function spacer(pts = 200) {
  return new Paragraph({ spacing: { before: pts } });
}

// ══════════════════════════════════════════════════════════════════
//  TICKET DATA
// ══════════════════════════════════════════════════════════════════

const epics = [
  {
    name: "Core Notification Aggregation",
    tickets: [
      {
        id: "DB-001", title: "Universal Multi-Category Order Feed", epic: "Core Notification Aggregation",
        priority: "P0", points: 8, sprint: "Sprint 1",
        description: [
          "Implement a unified order feed that ingests incoming delivery notifications from every connected platform and presents them in a single, chronologically sorted stream. The feed must support all delivery categories including food, grocery, pharmacy, packages, courier, alcohol, flowers, pets, cannabis, documents, express, last-mile, and q-commerce.",
          "Each order card in the feed shall display the source platform icon, category badge, customer name (or order reference), estimated payout, pickup and drop-off distance, and a countdown timer. The feed must refresh in real-time and persist state across app restarts using a local SQLite cache.",
          "The architecture must use an event-driven pipeline where each platform adapter emits normalized OrderEvent objects that the feed aggregates, deduplicates, and ranks by recency and proximity to the driver's current location.",
        ],
        criteria: [
          { type: "Given", text: "the driver has three or more platforms connected and active," },
          { type: "When", text: "a new order notification arrives from any platform," },
          { type: "Then", text: "the order appears in the unified feed within 2 seconds with correct category badge and platform icon." },
          { type: "Given", text: "the driver has scrolled through 50+ orders in the feed," },
          { type: "When", text: "the app is closed and reopened," },
          { type: "Then", text: "the feed restores its last visible position and all cached orders are displayed without re-fetching." },
        ],
      },
      {
        id: "DB-002", title: "Auto-Refresh Polling with Category Awareness", epic: "Core Notification Aggregation",
        priority: "P0", points: 3, sprint: "Sprint 1",
        description: [
          "Design and implement an adaptive polling engine that checks each connected platform for new orders at intervals calibrated by category priority and historical order density. High-demand categories like food and q-commerce should poll every 5 seconds, while lower-frequency categories like documents and flowers poll every 15 seconds.",
          "The polling engine must back off gracefully when the device is on cellular data or when the battery is below 20%, reducing frequency by 50% to conserve resources. It must also respect platform-specific rate limits and implement exponential backoff on 429 responses.",
          "A category-aware scheduler will queue polling tasks and ensure that no two requests to the same platform overlap, preventing duplicate order ingestion and API abuse.",
        ],
        criteria: [
          { type: "Given", text: "the driver is on Wi-Fi with battery above 20% and the food category is enabled," },
          { type: "When", text: "the polling engine schedules the next food-platform check," },
          { type: "Then", text: "the interval does not exceed 5 seconds and the request completes before the next cycle." },
          { type: "Given", text: "a platform responds with HTTP 429 (rate limit)," },
          { type: "When", text: "the polling engine receives the throttled response," },
          { type: "Then", text: "the engine applies exponential backoff starting at 10 seconds and logs the event for analytics." },
        ],
      },
      {
        id: "DB-003", title: "One-Tap Accept with Cross-Platform API", epic: "Core Notification Aggregation",
        priority: "P0", points: 5, sprint: "Sprint 1",
        description: [
          "Implement a single-tap accept action on every order card that triggers the correct platform-specific acceptance API under the hood. The accept flow must handle OAuth token refresh, CSRF token injection, and platform-specific payload formatting transparently, presenting a uniform one-tap experience to the driver.",
          "When the driver taps accept, the system must confirm acceptance within 3 seconds and display a success animation with platform branding. If the order was already accepted by another driver, the UI must show an immediate 'Order Unavailable' message and remove the card from the feed.",
          "The accept action must also trigger a background sync that marks the order as accepted across all the driver's devices and updates the earnings dashboard with the projected payout.",
        ],
        criteria: [
          { type: "Given", text: "an order card from DoorDash is displayed and the driver taps accept," },
          { type: "When", text: "the DoorDash API processes the acceptance request," },
          { type: "Then", text: "a success confirmation appears within 3 seconds and the order moves to the Active Orders panel." },
          { type: "Given", text: "an order has already been claimed by another driver," },
          { type: "When", text: "the driver taps accept," },
          { type: "Then", text: "an 'Order Unavailable' toast is displayed and the card is removed from the feed within 1 second." },
        ],
      },
      {
        id: "DB-004", title: "One-Tap Dismiss with Category Tracking", epic: "Core Notification Aggregation",
        priority: "P0", points: 3, sprint: "Sprint 1",
        description: [
          "Enable drivers to dismiss unwanted order notifications with a single tap, triggering a swipe-to-dismiss gesture or a dedicated dismiss button on each order card. Each dismissal must be logged with the category, platform, time of day, and the driver's reason if they provide one via an optional micro-survey.",
          "The dismiss action must update the feed immediately and feed the dismissal data into the recommendation engine so that similar low-preference orders are deprioritized in future sessions. Dismissed orders from the same platform and category should gradually appear lower in the feed ranking.",
          "An undo mechanism must be available for 5 seconds after dismissal, accessible via a snackbar at the bottom of the screen, allowing accidental dismissals to be recovered without re-fetching.",
        ],
        criteria: [
          { type: "Given", text: "a driver swipes left on a pharmacy order card," },
          { type: "When", text: "the dismiss gesture completes," },
          { type: "Then", text: "the card animates out, a dismiss event is logged with category=pharmacy, and a 5-second undo snackbar appears." },
          { type: "Given", text: "a driver has dismissed 10+ grocery orders in the past week," },
          { type: "When", text: "new grocery orders arrive," },
          { type: "Then", text: "they are ranked lower in the feed compared to categories the driver frequently accepts." },
        ],
      },
      {
        id: "DB-005", title: "Category Color-Coded Order Cards", epic: "Core Notification Aggregation",
        priority: "P0", points: 5, sprint: "Sprint 1",
        description: [
          "Design and implement a color-coding system for order cards that instantly communicates the delivery category to the driver. Each of the 13 supported categories must have a unique, WCAG 2.1 AA-compliant color that appears as a left-border stripe and a small category pill badge on the card.",
          "The color palette must be distinguishable under daylight and night-mode conditions, with dark-mode variants that maintain contrast ratios above 4.5:1. Categories: Food (warm orange), Grocery (green), Pharmacy (teal), Package (blue-gray), Courier (indigo), Alcohol (burgundy), Flowers (pink), Pets (amber), Cannabis (olive), Documents (slate), Express (red), Last-Mile (purple), Q-Commerce (cyan).",
          "Drivers can customize category colors in Settings, and their preferences persist across sessions. The default palette is optimized for the most common color-vision deficiencies using simulations run during design QA.",
        ],
        criteria: [
          { type: "Given", text: "a food order card is rendered in the feed," },
          { type: "When", text: "the card is displayed in light mode," },
          { type: "Then", text: "it has a warm orange left border, a 'Food' pill badge, and all text meets WCAG 2.1 AA contrast." },
          { type: "Given", text: "the driver switches to dark mode," },
          { type: "When", text: "the same food order card is rendered," },
          { type: "Then", text: "the warm orange border is adjusted for dark backgrounds and contrast ratio remains above 4.5:1." },
        ],
      },
      {
        id: "DB-006", title: "Cross-Platform Order Deduplication", epic: "Core Notification Aggregation",
        priority: "P1", points: 5, sprint: "Sprint 2",
        description: [
          "Build a deduplication engine that detects when the same physical delivery order is broadcast by multiple platforms simultaneously (e.g., a restaurant order that appears on both DoorDash and UberEats). The engine uses fuzzy matching on pickup address, drop-off address, customer initials, and order total to identify duplicates with 95%+ accuracy.",
          "When a duplicate is detected, the system merges the cards into a single 'Multi-Platform Order' card that shows both platform icons and highlights the platform offering the higher payout. The driver can tap to expand and see the full comparison before choosing which platform to accept on.",
          "Deduplication must run in under 500ms per new order and must not introduce perceptible delay in the feed rendering. A false-positive rate below 1% is acceptable, with a manual override flag available for drivers to split incorrectly merged cards.",
        ],
        criteria: [
          { type: "Given", text: "the same restaurant order appears on DoorDash and UberEats with matching pickup/drop-off addresses and similar totals," },
          { type: "When", text: "both notifications arrive within 10 seconds of each other," },
          { type: "Then", text: "the engine merges them into a single card showing both platform icons and the higher payout highlighted." },
          { type: "Given", text: "a driver taps the expand button on a merged card," },
          { type: "When", text: "the comparison view opens," },
          { type: "Then", text: "both platform offers are shown side-by-side with payout, distance, and tip information for easy comparison." },
        ],
      },
    ],
  },
  {
    name: "Global Platform Integration",
    tickets: [
      {
        id: "DB-007", title: "North America Platform Adapters (DoorDash, UberEats, Grubhub, Instacart, Amazon Flex)", epic: "Global Platform Integration",
        priority: "P0", points: 21, sprint: "Sprint 1-2",
        description: [
          "Develop platform-specific adapter modules for the five largest North American delivery platforms: DoorDash, UberEats, Grubhub, Instacart, and Amazon Flex. Each adapter must implement the standard PlatformAdapter interface with methods for authentication, order ingestion, acceptance, dismissal, and status tracking.",
          "The DoorDash adapter must handle their proprietary WebSocket feed for real-time order pushes, while the UberEats adapter uses their REST polling API with ETag-based caching. Grubhub requires session-cookie authentication that must be refreshed every 30 minutes. Instacart and Amazon Flex use OAuth2 with PKCE flows that must be managed securely.",
          "Each adapter must normalize platform-specific order schemas into the unified OrderEvent format, map platform categories to DeliveryBoost's 13-category taxonomy, and handle error states including token expiry, API deprecation, and rate limiting with appropriate fallbacks.",
        ],
        criteria: [
          { type: "Given", text: "the driver has connected their DoorDash and UberEats accounts," },
          { type: "When", text: "orders arrive on both platforms simultaneously," },
          { type: "Then", text: "both orders appear in the unified feed within 2 seconds, correctly categorized and with accurate payout information." },
          { type: "Given", text: "a DoorDash WebSocket connection drops unexpectedly," },
          { type: "When", text: "the reconnection logic activates," },
          { type: "Then", text: "the connection is re-established within 5 seconds and no orders are missed during the outage window." },
        ],
      },
      {
        id: "DB-008", title: "Europe Platform Adapters (Deliveroo, Just Eat, Wolt, Glovo, Stuart)", epic: "Global Platform Integration",
        priority: "P0", points: 21, sprint: "Sprint 2",
        description: [
          "Implement adapter modules for the five leading European delivery platforms: Deliveroo (UK), Just Eat (UK/Netherlands), Wolt (Finland/EU), Glovo (Spain/EU), and Stuart (France). Each adapter must comply with GDPR data handling requirements, including right-to-erasure support for cached order data and minimal PII retention policies.",
          "Deliveroo uses a gRPC-based order stream that must be consumed via a Node.js gRPC client. Just Eat provides a REST API with HMAC-signed webhooks. Wolt uses Server-Sent Events (SSE) for real-time updates. Glovo requires OAuth2 with refresh token rotation, and Stuart uses a GraphQL API for order queries.",
          "All adapters must handle multi-country configurations where a single platform operates across different regulatory regimes (e.g., Deliveroo in UK vs. EU), adjusting currency display, VAT calculations, and tip handling per jurisdiction.",
        ],
        criteria: [
          { type: "Given", text: "a driver in London has connected Deliveroo and Just Eat accounts," },
          { type: "When", text: "an order from each platform arrives," },
          { type: "Then", text: "both orders display with GBP currency, correct VAT-inclusive pricing, and proper UK tip conventions." },
          { type: "Given", text: "a driver requests GDPR data deletion," },
          { type: "When", text: "the erasure command is issued," },
          { type: "Then", text: "all cached PII from European platform adapters is purged within 24 hours and a confirmation is logged." },
        ],
      },
      {
        id: "DB-009", title: "Asia-Pacific Platform Adapters (Zomato, Swiggy, Meituan, Ele.me, GrabFood)", epic: "Global Platform Integration",
        priority: "P0", points: 21, sprint: "Sprint 3",
        description: [
          "Build adapter modules for the five dominant Asia-Pacific delivery platforms: Zomato (India), Swiggy (India), Meituan (China), Ele.me (China), and GrabFood (Southeast Asia). These adapters must handle the unique challenges of APAC markets including high-order-volume spikes during festival seasons, multi-language order descriptions, and varied payment settlement timelines.",
          "Zomato and Swiggy both use REST APIs with JWT authentication and support Hindi and English order feeds. Meituan and Ele.me require integration with WeChat Mini Program SDKs and must handle Chinese-language order parsing with NLP-based category classification. GrabFood uses a REST API with regional endpoints across Singapore, Malaysia, Thailand, Philippines, Vietnam, and Indonesia.",
          "Each adapter must implement region-specific compliance including India's UPI payment tracking, China's real-name verification requirements, and Southeast Asia's multi-currency settlement with proper exchange rate handling at the time of order acceptance.",
        ],
        criteria: [
          { type: "Given", text: "a driver in Mumbai has connected Zomato and Swiggy," },
          { type: "When", text: "orders arrive during Diwali peak hours," },
          { type: "Then", text: "the feed handles 50+ concurrent orders without UI lag and displays INR payouts with UPI settlement tracking." },
          { type: "Given", text: "a driver in Shanghai connects Meituan and Ele.me," },
          { type: "When", text: "a Chinese-language order arrives," },
          { type: "Then", text: "the NLP classifier correctly assigns the category badge with 95%+ accuracy and displays CNY pricing." },
        ],
      },
      {
        id: "DB-010", title: "Latin America Platform Adapters (Rappi, iFood, Cornershop)", epic: "Global Platform Integration",
        priority: "P1", points: 13, sprint: "Sprint 4",
        description: [
          "Develop adapter modules for the three major Latin American delivery platforms: Rappi (Colombia/Mexico/Brazil), iFood (Brazil), and Cornershop (Mexico/Chile/Colombia/Peru). These adapters must handle the unique characteristics of LATAM markets including cash-on-delivery orders, split-payment transactions, and fluctuating currency values that require real-time FX rate lookups.",
          "Rappi uses a REST API with OAuth2 and supports both delivery and in-store pickup modes. iFood provides an event-driven webhook system with polling fallback and operates exclusively in BRL. Cornershop uses a REST API with session-based authentication and supports grocery and pharmacy categories across four countries with different currency and tax regimes.",
          "Each adapter must implement robust error handling for the higher network latency and intermittent connectivity common in LATAM regions, including offline queuing of acceptance actions that sync when connectivity is restored, with a maximum retry window of 5 minutes.",
        ],
        criteria: [
          { type: "Given", text: "a driver in Sao Paulo has iFood and Rappi connected," },
          { type: "When", text: "a cash-on-delivery order arrives on iFood," },
          { type: "Then", text: "the order card shows a COD badge, the estimated cash handling amount, and BRL pricing with correct ICMS tax display." },
          { type: "Given", text: "a driver in Mexico City loses connectivity after tapping accept on a Cornershop order," },
          { type: "When", text: "connectivity is restored within 5 minutes," },
          { type: "Then", text: "the acceptance is synced to Cornershop's API and the order status updates to 'Accepted' on both the app and the platform." },
        ],
      },
      {
        id: "DB-011", title: "Middle East & Africa Platform Adapters (Talabat, Careem, Jumia)", epic: "Global Platform Integration",
        priority: "P1", points: 13, sprint: "Sprint 5",
        description: [
          "Implement adapter modules for the three leading Middle East & Africa delivery platforms: Talabat (Kuwait/UAE/Egypt), Careem (UAE/Saudi Arabia/Pakistan), and Jumia (Nigeria/Egypt/Morocco/Kenya). These adapters must navigate the diverse regulatory landscapes, including halal food certification tracking, Friday prayer-time delivery restrictions, and Africa's mobile-money payment ecosystem.",
          "Talabat uses a REST API with token-based authentication and supports Arabic and English order feeds. Careem leverages the Careem Super App SDK with deep-linking for order acceptance and operates in AED, SAR, and PKR. Jumia provides a REST API with mobile-money integration (M-Pesa, Flutterwave) and supports order tracking across Nigeria, Egypt, Morocco, and Kenya with local currency display.",
          "All adapters must implement RTL text rendering for Arabic order descriptions, support GPS coordinates in both standard and local grid systems, and handle the high GPS drift common in dense urban areas like Dubai and Lagos with address correction algorithms.",
        ],
        criteria: [
          { type: "Given", text: "a driver in Dubai has Talabat and Careem connected," },
          { type: "When", text: "an Arabic-language order arrives from Talabat," },
          { type: "Then", text: "the order card renders RTL text correctly, displays AED pricing, and shows halal certification status if applicable." },
          { type: "Given", text: "a driver in Lagos receives a Jumia order paid via M-Pesa," },
          { type: "When", text: "the order is accepted," },
          { type: "Then", text: "the payment confirmation includes M-Pesa transaction reference and NGN payout is tracked in the earnings dashboard." },
        ],
      },
    ],
  },
  {
    name: "Multi-Category Delivery Support",
    tickets: [
      {
        id: "DB-012", title: "Category-Specific Order Card Templates", epic: "Multi-Category Delivery Support",
        priority: "P0", points: 5, sprint: "Sprint 2",
        description: [
          "Design and implement 13 unique order card templates, one for each delivery category, that surface the most relevant information for that category at a glance. Food cards prioritize restaurant name, cuisine type, and estimated prep time. Pharmacy cards show prescription status and pharmacy license number. Package cards display tracking ID and package size.",
          "Each template must follow a consistent layout grid (icon, title, metadata row, action row) while allowing category-specific metadata fields. Templates must be responsive and render identically on screens from 320px to 1440px width, with tablet-optimized two-column layouts when screen width exceeds 768px.",
          "The template engine must support hot-swapping of category templates via a remote configuration endpoint, allowing design updates without requiring an app store release. Fallback to the default template is required if a category template fails to load within 500ms.",
        ],
        criteria: [
          { type: "Given", text: "a pharmacy order arrives with prescription status and license number," },
          { type: "When", text: "the pharmacy card template renders," },
          { type: "Then", text: "the card shows the pharmacy name, prescription status badge, license number, and estimated pickup time." },
          { type: "Given", text: "the remote template configuration endpoint is unreachable," },
          { type: "When", text: "a food order card is rendered," },
          { type: "Then", text: "the default food template loads from local cache within 500ms and all essential information is displayed." },
        ],
      },
      {
        id: "DB-013", title: "Category Switcher Filter", epic: "Multi-Category Delivery Support",
        priority: "P0", points: 3, sprint: "Sprint 2",
        description: [
          "Implement a horizontal scrollable category filter bar at the top of the order feed that allows drivers to quickly toggle which delivery categories are visible. The filter bar must show all 13 categories as pill-shaped toggles with the category color and icon, and support multi-select so drivers can view any combination of categories simultaneously.",
          "The filter state must persist across app sessions and sync to the driver's profile so it is available on all logged-in devices. An 'All Categories' toggle must be present as the first item, and selecting it clears any individual filters. A count badge on each category pill shows the current number of available orders in that category.",
          "When a category is toggled off, its orders must animate out of the feed smoothly (200ms fade + slide). When toggled back on, orders animate in with the same transition. The filter must update the feed within 100ms of toggle, even with 100+ orders in the visible set.",
        ],
        criteria: [
          { type: "Given", text: "the driver has 40 orders in the feed spanning 6 categories," },
          { type: "When", text: "the driver toggles off the 'Food' category," },
          { type: "Then", text: "all food orders animate out within 200ms, the feed updates within 100ms, and non-food orders remain stable." },
          { type: "Given", text: "the driver selects 'All Categories' with individual filters active," },
          { type: "When", text: "the toggle completes," },
          { type: "Then", text: "all individual filters are cleared, all orders are visible, and the filter state persists on next app launch." },
        ],
      },
      {
        id: "DB-014", title: "Alcohol & Age-Restricted Category Handler", epic: "Multi-Category Delivery Support",
        priority: "P1", points: 5, sprint: "Sprint 3",
        description: [
          "Implement specialized handling for alcohol and other age-restricted delivery categories, ensuring compliance with local regulations across 190 countries. The handler must verify the driver's age certification (uploaded government ID + platform-specific verification) before displaying any age-restricted orders, and must enforce jurisdiction-specific rules such as dry-day restrictions in India and Sunday sales laws in certain US counties.",
          "When an age-restricted order appears, the card must display a prominent age-verification badge and a mandatory ID-check reminder that the driver must acknowledge before proceeding to pickup. The handler must integrate with platform-specific age-verification APIs (e.g., DoorDash's ID scan flow, Drizly's age gate) and enforce their requirements within the DeliveryBoost accept flow.",
          "The handler must maintain an audit log of all age-restricted deliveries including timestamp, driver ID verification status, platform, and jurisdiction, with data retained for the legally mandated period in each jurisdiction (ranging from 1 to 7 years).",
        ],
        criteria: [
          { type: "Given", text: "a driver without age verification on file receives an alcohol order from Drizly," },
          { type: "When", text: "the order card appears in the feed," },
          { type: "Then", text: "the card shows an 'Age Verification Required' badge and the accept button is disabled until verification is complete." },
          { type: "Given", text: "a verified driver in a US county with Sunday alcohol sales restrictions accepts a Sunday alcohol order," },
          { type: "When", text: "the jurisdiction check runs," },
          { type: "Then", text: "the order is flagged as non-compliant and the driver is notified that the delivery cannot proceed on Sunday." },
        ],
      },
      {
        id: "DB-015", title: "Pharmacy & Health Category Integration", epic: "Multi-Category Delivery Support",
        priority: "P1", points: 5, sprint: "Sprint 3",
        description: [
          "Build deep integration with pharmacy and health delivery platforms to handle the unique requirements of prescription medication deliveries. This includes HIPAA-compliant data handling for US orders, temperature-sensitive packaging indicators, controlled-substance delivery verification, and pharmacy license validation for each order.",
          "The integration must support both prescription and over-the-counter (OTC) order types with distinct card templates. Prescription orders must display the pharmacy license number, prescription reference, and a 'Signature Required' badge. OTC orders display product categories and estimated pharmacy prep time. Both types must show temperature sensitivity warnings when applicable.",
          "For controlled substances (Schedule II-V in the US, equivalent classifications internationally), the handler must enforce additional verification steps including photo capture of the recipient's ID at drop-off and electronic signature capture, with all verification data transmitted back to the originating platform's API in real-time.",
        ],
        criteria: [
          { type: "Given", text: "a prescription order arrives from a US pharmacy platform," },
          { type: "When", text: "the driver views the order card," },
          { type: "Then", text: "the card shows the pharmacy license, prescription reference, 'Signature Required' badge, and HIPAA-compliant data handling notice." },
          { type: "Given", text: "a controlled substance delivery is in progress," },
          { type: "When", text: "the driver arrives at the drop-off location," },
          { type: "Then", text: "the app requires photo ID capture and electronic signature before marking the delivery as complete." },
        ],
      },
      {
        id: "DB-016", title: "Package & Last-Mile Category Integration", epic: "Multi-Category Delivery Support",
        priority: "P1", points: 5, sprint: "Sprint 3",
        description: [
          "Implement integration with package delivery and last-mile logistics platforms including Amazon Flex, FedEx SameDay, UPS Express Critical, DHL Same Day, and regional last-mile providers. This category handles higher-volume, lower-value-per-delivery workflows where drivers may complete 30-60 drop-offs per session, requiring batch-optimized UI patterns.",
          "The package integration must support multi-stop route optimization displays, barcode/QR scanning at pickup and drop-off, proof-of-delivery photo capture, and 'leave at door' vs. 'signature required' handling per package. The batch view must show all packages for a route in a swipeable carousel with completion progress tracking.",
          "Last-mile integrations must handle the unique challenge of delivery time windows (e.g., 'deliver between 2-4 PM'), access code fields for apartment buildings, and recipient communication via masked phone numbers. The system must batch-update status to the originating platform every 30 seconds or immediately for high-priority deliveries.",
        ],
        criteria: [
          { type: "Given", text: "a driver on Amazon Flex has a 40-package route," },
          { type: "When", text: "the route is loaded in DeliveryBoost," },
          { type: "Then", text: "the batch carousel shows all 40 packages with completion progress, and route-optimized stop order is displayed." },
          { type: "Given", text: "a package requires 'leave at door' delivery with photo proof," },
          { type: "When", text: "the driver completes the drop-off," },
          { type: "Then", text: "the app captures a door photo, uploads it to the platform API, and marks the package as delivered with GPS coordinates." },
        ],
      },
    ],
  },
  {
    name: "Global Earnings & Analytics",
    tickets: [
      {
        id: "DB-017", title: "Multi-Currency Earnings Dashboard", epic: "Global Earnings & Analytics",
        priority: "P0", points: 5, sprint: "Sprint 2",
        description: [
          "Build a comprehensive earnings dashboard that aggregates income from all connected platforms and displays it in the driver's preferred currency using real-time exchange rates from the ECB reference rate API (updated every 60 minutes during European trading hours). The dashboard must show today's earnings, this week's earnings, and this month's earnings with drill-down capability.",
          "The dashboard must handle multi-currency aggregation accurately, converting each platform's payout from its native currency to the display currency using the exchange rate applicable at the time the order was completed, not the current rate. Historical earnings must maintain the original exchange rate to ensure accurate accounting.",
          "Drivers operating across borders (e.g., EU drivers working in multiple Eurozone and non-Eurozone countries) must see a currency-switcher that instantly recalculates all displayed values. The dashboard must also show platform-specific earnings breakdowns, tips received per platform, and incentive bonuses with their settlement timelines.",
        ],
        criteria: [
          { type: "Given", text: "a driver in the UK has earned GBP from Deliveroo and EUR from Wolt," },
          { type: "When", text: "they view the earnings dashboard with GBP as the display currency," },
          { type: "Then", text: "Wolt's EUR earnings are converted at the historical ECB rate from the time of each delivery and the total shows the accurate GBP equivalent." },
          { type: "Given", text: "the driver switches the display currency from GBP to EUR," },
          { type: "When", text: "the currency switcher is activated," },
          { type: "Then", text: "all dashboard values recalculate instantly using stored historical rates and the display updates within 500ms." },
        ],
      },
      {
        id: "DB-018", title: "Category-Breakdown Earnings Charts", epic: "Global Earnings & Analytics",
        priority: "P1", points: 5, sprint: "Sprint 3",
        description: [
          "Implement interactive earnings charts that break down the driver's income by delivery category, showing which categories are most profitable per hour invested. The charts must include a donut chart for category revenue distribution, a bar chart for hourly rate by category, and a line chart for earnings trend by category over the past 30 days.",
          "Each chart must be tappable to reveal a detailed breakdown showing average order value, average tip percentage, acceptance rate, and completion rate per category. The data must update in real-time as new deliveries are completed and support date-range filtering (today, 7 days, 30 days, 90 days, custom range).",
          "The charts must be optimized for mobile rendering using Canvas-based charting (not SVG) to ensure smooth 60fps animations even on mid-range Android devices. Color coding in charts must match the category color system from DB-005 for visual consistency across the app.",
        ],
        criteria: [
          { type: "Given", text: "a driver has completed 50 deliveries across food, grocery, and pharmacy categories in the past 7 days," },
          { type: "When", text: "they view the category-breakdown chart for the 7-day range," },
          { type: "Then", text: "the donut chart shows proportional revenue by category and tapping 'Food' reveals the detailed breakdown with hourly rate." },
          { type: "Given", text: "the driver scrolls the 30-day line chart on a mid-range Android device," },
          { type: "When", text: "the chart renders category trend lines," },
          { type: "Then", text: "the animation runs at 60fps with no visible jank and category colors match the DB-005 palette." },
        ],
      },
      {
        id: "DB-019", title: "Cross-Platform Regional Analytics", epic: "Global Earnings & Analytics",
        priority: "P1", points: 5, sprint: "Sprint 4",
        description: [
          "Develop a regional analytics module that compares the driver's earnings performance against anonymized regional benchmarks from other DeliveryBoost drivers in the same metropolitan area. The analytics must show how the driver ranks by hourly rate, acceptance rate, and completion rate relative to the local 25th, 50th, and 75th percentiles.",
          "The module must also provide cross-platform comparisons showing which platforms are generating the most orders, highest payouts, and best tips in the driver's region. This data helps drivers decide which platforms to prioritize during different times of day and days of the week.",
          "All benchmark data must be aggregated from at least 100 drivers in the same region to ensure statistical significance and anonymity. No individual driver data is ever exposed; only percentile rankings and anonymized averages. The analytics dashboard must update daily with overnight batch processing and show a 'last updated' timestamp.",
        ],
        criteria: [
          { type: "Given", text: "a driver in Chicago has 200+ completed deliveries across 3 platforms," },
          { type: "When", text: "they view the regional analytics dashboard," },
          { type: "Then", text: "their hourly rate is ranked against Chicago's 25th/50th/75th percentiles and cross-platform payout comparisons are displayed." },
          { type: "Given", text: "the region has fewer than 100 active DeliveryBoost drivers," },
          { type: "When", text: "the driver views regional benchmarks," },
          { type: "Then", text: "the dashboard shows a 'Limited Data' notice and widens the geographic radius until 100+ drivers are included." },
        ],
      },
      {
        id: "DB-020", title: "AI Earnings Forecasting", epic: "Global Earnings & Analytics",
        priority: "P2", points: 8, sprint: "Sprint 5",
        description: [
          "Implement an AI-powered earnings forecasting engine that predicts the driver's expected hourly rate for the next 2, 4, and 8 hours based on historical patterns, current demand signals, weather data, local events, and platform-specific surge indicators. The forecast must be displayed as a confidence interval (e.g., '$22-28/hr expected over next 4 hours').",
          "The model must be trained on the driver's personal delivery history (minimum 100 completed sessions) combined with anonymized regional data. It must account for day-of-week patterns, time-of-day patterns, seasonal variations (e.g., holiday surges), weather impacts (rain increases food delivery demand), and local event schedules (concerts, sports games).",
          "Forecasts must be updated every 15 minutes and displayed prominently on the home screen as a 'Best Time to Drive' recommendation card. The card must show the optimal start time, expected hourly rate, recommended platforms, and suggested categories. The forecast accuracy target is plus or minus 15% of actual earnings at the 4-hour horizon.",
        ],
        criteria: [
          { type: "Given", text: "a driver with 200+ completed sessions views the home screen at 4 PM on a rainy Friday," },
          { type: "When", text: "the AI forecast renders," },
          { type: "Then", text: "the 'Best Time to Drive' card shows elevated food delivery demand, recommends starting now, and forecasts $25-32/hr with 85% confidence." },
          { type: "Given", text: "the driver follows the AI recommendation and completes a 4-hour session," },
          { type: "When", text: "actual earnings are compared to the forecast," },
          { type: "Then", text: "the actual hourly rate falls within the forecast confidence interval at least 80% of the time over a 30-day rolling window." },
        ],
      },
    ],
  },
  {
    name: "Internationalization",
    tickets: [
      {
        id: "DB-021", title: "i18n Framework with 20+ Languages", epic: "Internationalization",
        priority: "P0", points: 8, sprint: "Sprint 1",
        description: [
          "Build a comprehensive internationalization framework that supports 20+ languages from launch, with the architecture to scale to 50+ languages without code changes. Initial languages must include English, Spanish, Portuguese, French, German, Italian, Dutch, Arabic, Hebrew, Hindi, Mandarin Chinese, Japanese, Korean, Thai, Vietnamese, Bahasa Indonesian, Turkish, Polish, Russian, and Ukrainian.",
          "The framework must use ICU MessageFormat for pluralization, gender agreement, and complex interpolation patterns. All user-facing strings must be externalized into JSON resource bundles with fallback chains (e.g., pt-BR falls back to pt, then to en). Right-to-left languages must be handled at the framework level with automatic layout mirroring.",
          "The i18n pipeline must support over-the-air (OTA) string updates so that translation fixes and new language additions can be pushed without requiring an app store release. A language-detection algorithm must set the initial language based on device locale, with manual override available in settings.",
        ],
        criteria: [
          { type: "Given", text: "a driver's device locale is set to Brazilian Portuguese (pt-BR)," },
          { type: "When", text: "the app launches for the first time," },
          { type: "Then", text: "all UI strings render in Brazilian Portuguese with pt-BR resource bundles, falling back to pt then en for any missing keys." },
          { type: "Given", text: "an OTA string update is pushed for Japanese translations," },
          { type: "When", text: "a Japanese-language user opens the app," },
          { type: "Then", text: "the updated strings are downloaded and applied within the current session without requiring a restart." },
        ],
      },
      {
        id: "DB-022", title: "RTL Support for Arabic & Hebrew", epic: "Internationalization",
        priority: "P0", points: 5, sprint: "Sprint 2",
        description: [
          "Implement full right-to-left (RTL) layout support for Arabic and Hebrew, ensuring that every screen, component, and interaction pattern mirrors correctly. This includes the order feed scrolling direction, card layout (icons on the right, text aligned right), navigation drawer opening from the right, and swipe gestures reversed (swipe right to dismiss instead of left).",
          "All text input fields must support RTL text entry with proper cursor positioning and bidirectional text handling for mixed Arabic/English content (common in order descriptions that include brand names in Latin script). Numbers and prices must always render left-to-right even within RTL contexts, following Unicode Bidirectional Algorithm rules.",
          "The RTL implementation must be verified against the complete screen inventory with automated screenshot comparison tests for both LTR and RTL layouts, ensuring no visual regressions. Calendar, time picker, and date formatting must follow the Hijri or Hebrew calendar systems where culturally appropriate.",
        ],
        criteria: [
          { type: "Given", text: "the driver's language is set to Arabic and they open the order feed," },
          { type: "When", text: "the feed renders," },
          { type: "Then", text: "cards are right-aligned, icons appear on the right side, swipe-right dismisses, and navigation opens from the right edge." },
          { type: "Given", text: "an Arabic order description contains the English brand name 'McDonald's'," },
          { type: "When", text: "the mixed-direction text renders on the order card," },
          { type: "Then", text: "the Arabic text flows RTL and 'McDonald's' renders LTR within the line, with correct cursor positioning in any editable field." },
        ],
      },
      {
        id: "DB-023", title: "Regional Pricing Display", epic: "Internationalization",
        priority: "P0", points: 3, sprint: "Sprint 2",
        description: [
          "Implement region-aware pricing display that formats all monetary values according to local conventions including currency symbol placement (prefix vs. suffix), decimal separator (period vs. comma), thousands separator, and significant digits. For example, $12.50 in the US, 12,50 EUR in Germany, and INR 1,000.00 in India.",
          "The pricing engine must maintain a currency configuration table covering all 190 supported countries with their ISO 4217 currency code, symbol, decimal places, and formatting rules. When a driver crosses a border (detected via GPS), the app must prompt to switch the display currency and apply the new regional formatting instantly.",
          "All pricing calculations (earnings totals, tips, incentives) must use integer-based arithmetic (cents/copecks/fils) to avoid floating-point precision errors. Display formatting is applied only at the rendering layer, never in calculation or storage.",
        ],
        criteria: [
          { type: "Given", text: "a driver in Germany views their earnings dashboard," },
          { type: "When", text: "the EUR pricing displays," },
          { type: "Then", text: "amounts show as '12,50 EUR' with comma decimal separator and the EUR suffix, following German locale conventions." },
          { type: "Given", text: "a driver crosses from the US to Canada and GPS detects the border," },
          { type: "When", text: "the currency prompt appears," },
          { type: "Then", text: "the driver can switch from USD to CAD and all displayed prices reformat to Canadian conventions within 1 second." },
        ],
      },
      {
        id: "DB-024", title: "Timezone-Aware Session Tracking", epic: "Internationalization",
        priority: "P1", points: 3, sprint: "Sprint 3",
        description: [
          "Implement timezone-aware session tracking that correctly records delivery start times, completion times, and session durations regardless of which timezone the driver is operating in. Sessions that cross timezone boundaries (e.g., a driver starting in EST and ending in CST) must be tracked as a single continuous session with accurate duration calculation.",
          "All timestamps must be stored in UTC and converted to the driver's current local timezone for display. The session tracker must handle daylight saving time transitions gracefully, ensuring that a session starting during DST and ending after the fall-back is recorded with the correct actual duration (not off by an hour).",
          "The earnings dashboard must allow drivers to view their session history in any timezone, defaulting to the timezone where the session started. Weekly and monthly summaries must respect the driver's 'home timezone' preference, which can be set independently of their current location.",
        ],
        criteria: [
          { type: "Given", text: "a driver starts a session in New York (EST) and drives to Chicago (CST) during the session," },
          { type: "When", text: "the session ends in Chicago," },
          { type: "Then", text: "the session duration is calculated correctly accounting for the timezone change and the session appears as a single continuous entry." },
          { type: "Given", text: "a session starts at 1:30 AM on the day of DST fall-back," },
          { type: "When", text: "the session ends at 3:00 AM local time," },
          { type: "Then", text: "the session duration is recorded as 2.5 hours (not 1.5 or 3.5 hours) and timestamps are stored correctly in UTC." },
        ],
      },
    ],
  },
  {
    name: "Premium & Monetization",
    tickets: [
      {
        id: "DB-025", title: "Auto-Accept Rules Engine with Category-Specific Rules", epic: "Premium & Monetization",
        priority: "P0", points: 8, sprint: "Sprint 3",
        description: [
          "Build a sophisticated rules engine that allows premium subscribers to define auto-accept criteria based on any combination of: category, platform, minimum payout, maximum distance, customer rating, time of day, and surge multiplier. Rules are evaluated in priority order and the first matching rule triggers automatic acceptance within 500ms of the order appearing in the feed.",
          "The rules engine must support compound conditions with AND/OR logic, for example: 'Auto-accept IF category=Food AND payout>=$15 AND distance<=3mi OR category=Express AND surge>=1.5x'. Rules must be editable via a visual rule builder UI with drag-and-drop condition blocks, and also via a text-based rule DSL for advanced users.",
          "A safety governor must limit auto-accept to a configurable maximum concurrent orders (default: 2) to prevent drivers from accidentally accepting more orders than they can handle. When the governor limit is reached, auto-accept is paused and the driver is notified. An emergency stop button must be accessible from any screen to immediately disable all auto-accept rules.",
        ],
        criteria: [
          { type: "Given", text: "a premium driver has defined the rule 'Auto-accept Food orders with payout >= $12 and distance <= 5mi'," },
          { type: "When", text: "a DoorDash food order arrives with $14 payout and 3.2mi distance," },
          { type: "Then", text: "the order is auto-accepted within 500ms and a confirmation notification is shown." },
          { type: "Given", text: "the driver already has 2 active auto-accepted orders and a third matching order arrives," },
          { type: "When", text: "the rules engine evaluates the order," },
          { type: "Then", text: "auto-accept is paused, the order remains in the feed for manual review, and a 'Concurrent limit reached' notification appears." },
        ],
      },
      {
        id: "DB-026", title: "Time-Based Rule Profiles", epic: "Premium & Monetization",
        priority: "P1", points: 5, sprint: "Sprint 3",
        description: [
          "Extend the auto-accept rules engine with time-based profiles that automatically switch rule sets based on the day and time. For example, a driver can configure a 'Weekday Lunch' profile active Monday-Friday 11 AM-2 PM that auto-accepts food orders near downtown, and a 'Weekend Evening' profile active Saturday-Sunday 6 PM-11 PM that auto-accepts alcohol and express deliveries.",
          "Profile transitions must be seamless and happen exactly at the configured transition time without requiring the driver to manually switch. When profiles overlap (e.g., a lunch profile runs until 2 PM and an afternoon profile starts at 1:30 PM), the driver can set merge behavior (prefer earlier, prefer later, or intersect rules).",
          "Each profile must support a warm-up period where the rules engine pre-loads platform connections and primes the order cache 5 minutes before the profile becomes active, ensuring instant responsiveness from the moment the profile activates. Profile analytics must track which profiles generate the most earnings per hour.",
        ],
        criteria: [
          { type: "Given", text: "a driver has a 'Weekday Lunch' profile active from 11 AM to 2 PM with food auto-accept rules," },
          { type: "When", text: "the clock hits 2 PM and the 'Afternoon' profile activates," },
          { type: "Then", text: "the rule set switches automatically, food-only auto-accept stops, and the new profile's rules take effect immediately." },
          { type: "Given", text: "the 'Weekday Lunch' profile is scheduled to start at 11 AM," },
          { type: "When", text: "the time reaches 10:55 AM," },
          { type: "Then", text: "the warm-up period begins, platform connections are primed, and the order cache is pre-loaded so the profile is ready at exactly 11 AM." },
        ],
      },
      {
        id: "DB-027", title: "Regional Stripe Integration", epic: "Premium & Monetization",
        priority: "P0", points: 5, sprint: "Sprint 2",
        description: [
          "Implement regional Stripe payment integration supporting subscription billing for DeliveryBoost Premium across 46 countries where Stripe is available. The integration must handle monthly and annual subscription tiers (Basic, Pro, Elite) with pricing in local currency, tax calculation via Stripe Tax, and compliance with local invoicing requirements.",
          "The integration must support multiple payment methods per region: credit/debit cards globally, iDEAL in Netherlands, Bancontact in Belgium, SEPA Direct Debit across the Eurozone, Boleto in Brazil, OXXO in Mexico, and Alipay/WeChat Pay in China. Each region's checkout flow must present the most popular local payment methods first.",
          "Subscription management must include upgrade/downgrade flows with prorated billing, grace period handling for failed payments (3-day grace period with restricted feature access), and automatic retry logic following Stripe's recommended retry schedule. Cancellation must offer a downsell to a lower tier before allowing full cancellation.",
        ],
        criteria: [
          { type: "Given", text: "a driver in Brazil subscribes to the Pro tier," },
          { type: "When", text: "they reach the checkout screen," },
          { type: "Then", text: "pricing is displayed in BRL, Boleto and credit card are shown as primary payment methods, and Stripe Tax calculates the correct ICMS." },
          { type: "Given", text: "a Pro subscriber's monthly payment fails," },
          { type: "When", text: "the 3-day grace period begins," },
          { type: "Then", text: "the driver retains access to Pro features for 3 days, receives a payment failure notification, and Stripe retries the charge per its schedule." },
        ],
      },
      {
        id: "DB-028", title: "AI Order Recommendations", epic: "Premium & Monetization",
        priority: "P2", points: 8, sprint: "Sprint 5",
        description: [
          "Develop an AI-powered order recommendation system for Elite-tier subscribers that analyzes incoming orders and ranks them by expected profitability, factoring in the driver's current location, historical acceptance patterns, category preferences, time-of-day earnings data, and real-time demand signals from all connected platforms.",
          "The recommendation engine must process each incoming order within 200ms and assign a 'Boost Score' from 1-100 that predicts the order's value relative to the driver's average hourly rate. Orders with Boost Score above 80 are highlighted with a golden 'Top Pick' badge. The engine must learn from the driver's accept/reject behavior and improve its predictions over time.",
          "The system must also provide proactive recommendations such as 'Switch to grocery category for the next hour - 3x demand spike detected in your area' or 'Move 2 blocks north - 5 high-value pharmacy orders queued near Elm Street'. These location-based suggestions must respect driver autonomy and never auto-navigate or auto-accept unless the driver has enabled those features.",
        ],
        criteria: [
          { type: "Given", text: "an Elite subscriber receives 5 simultaneous orders from different platforms," },
          { type: "When", text: "the AI recommendation engine processes them," },
          { type: "Then", text: "each order receives a Boost Score within 200ms and the highest-scored order shows a 'Top Pick' golden badge." },
          { type: "Given", text: "the AI detects a grocery demand spike in the driver's area," },
          { type: "When", text: "the proactive recommendation triggers," },
          { type: "Then", text: "a non-intrusive card appears suggesting 'Switch to grocery for 3x demand' without auto-changing any driver settings." },
        ],
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════════════
//  SPRINT PLANNING SUMMARY DATA
// ══════════════════════════════════════════════════════════════════

const sprintSummary = [
  { sprint: "Sprint 1", duration: "Weeks 1-2", tickets: "DB-001, DB-002, DB-003, DB-004, DB-005, DB-021, DB-007 (partial)", points: 32, deliverables: "Core feed, polling, accept/dismiss, color-coded cards, i18n framework, NA adapters start" },
  { sprint: "Sprint 2", duration: "Weeks 3-4", tickets: "DB-006, DB-007 (cont.), DB-008, DB-012, DB-013, DB-017, DB-022, DB-023, DB-027", points: 55, deliverables: "Deduplication, NA/EU adapters, card templates, category filter, earnings dashboard, RTL, regional pricing, Stripe" },
  { sprint: "Sprint 3", duration: "Weeks 5-6", tickets: "DB-009, DB-014, DB-015, DB-016, DB-018, DB-024, DB-025, DB-026", points: 47, deliverables: "APAC adapters, age-restricted/pharmacy/package handlers, earnings charts, timezone tracking, auto-accept rules, time profiles" },
  { sprint: "Sprint 4", duration: "Weeks 7-8", tickets: "DB-010, DB-019", points: 18, deliverables: "LATAM adapters, regional analytics, stabilization and bug fixes" },
  { sprint: "Sprint 5", duration: "Weeks 9-10", tickets: "DB-011, DB-020, DB-028", points: 29, deliverables: "MEA adapters, AI earnings forecast, AI order recommendations, performance optimization" },
  { sprint: "Sprint 6", duration: "Weeks 11-12", tickets: "—", points: 0, deliverables: "Global QA, localization QA, performance benchmarking, launch readiness, documentation" },
];

// ══════════════════════════════════════════════════════════════════
//  DOCUMENT CONSTRUCTION
// ══════════════════════════════════════════════════════════════════

async function main() {
  // ── SECTION 1: COVER PAGE ──────────────────────────────────────
  const coverChildren = [];

  // Build the cover as a full-page table with dark background
  // Use a single-cell table that fills the page
  const coverContent = [];

  // Spacers to push content down
  for (let i = 0; i < 4; i++) {
    coverContent.push(new Paragraph({ spacing: { before: 400 } }));
  }

  // Title: "DeliveryBoost"
  coverContent.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "DeliveryBoost", bold: true, size: 144, font: "Times New Roman", color: C.white }),
      ],
    })
  );

  // Subtitle: "Feature Ticket List" with orange left border accent
  coverContent.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      border: {
        left: { style: BorderStyle.SINGLE, size: 20, color: C.accent, space: 14 },
      },
      indent: { left: 2800 },
      children: [
        new TextRun({ text: "Feature Ticket List", bold: true, size: 72, font: "Times New Roman", color: C.white }),
      ],
    })
  );

  // Meta lines
  const metaLines = [
    "Version 2.0 | Global Launch",
    "Date: June 7, 2026",
    "Author: Yashas K. Gangatkar",
    "Sprint: Phase 1-6 Rollout",
  ];
  for (const line of metaLines) {
    coverContent.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [
          new TextRun({ text: line, size: 24, font: "Times New Roman", color: C.medGray }),
        ],
      })
    );
  }

  // Wrap cover content in a full-page table cell with dark background
  const coverTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: C.primary },
            verticalAlign: VerticalAlign.CENTER,
            borders: noBorders,
            children: coverContent,
          }),
        ],
      }),
    ],
  });

  coverChildren.push(coverTable);

  // ── SECTION 2: TABLE OF CONTENTS ───────────────────────────────
  const tocChildren = [];

  tocChildren.push(heading("Table of Contents", 1));
  tocChildren.push(spacer(80));

  // Use docx TableOfContents element for proper TOC field generation
  tocChildren.push(
    new TableOfContents("Table of Contents", {
      hyperlink: true,
      headingStyleRange: "1-3",
    })
  );

  // Also add manual TOC entries for visual reference with Roman numeral page indicators
  const tocEntries = [
    { num: "I", title: "Core Notification Aggregation" },
    { num: "II", title: "Global Platform Integration" },
    { num: "III", title: "Multi-Category Delivery Support" },
    { num: "IV", title: "Global Earnings & Analytics" },
    { num: "V", title: "Internationalization" },
    { num: "VI", title: "Premium & Monetization" },
    { num: "VII", title: "Sprint Planning Summary" },
  ];

  for (const entry of tocEntries) {
    tocChildren.push(
      new Paragraph({
        spacing: { after: 140 },
        tabStops: [
          { type: TabStopType.RIGHT, position: 9360 },
        ],
        children: [
          new TextRun({ text: `${entry.num}.  ${entry.title}`, size: 24, font: "Times New Roman", color: C.primary }),
          new TextRun({ text: "\t" }),
          new TextRun({ text: "•", size: 24, font: "Times New Roman", color: C.accent }),
        ],
      })
    );
  }

  // ── SECTION 3: BODY ────────────────────────────────────────────
  const bodyChildren = [];

  const romanNumerals = ["I", "II", "III", "IV", "V", "VI"];

  for (let e = 0; e < epics.length; e++) {
    const epic = epics[e];
    bodyChildren.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 360, after: 160 },
        pageBreakBefore: e > 0,
        children: [
          new TextRun({ text: `${romanNumerals[e]}. Epic: ${epic.name}`, bold: true, size: 32, font: "Times New Roman", color: C.primary }),
        ],
      })
    );

    const ticketCount = epic.tickets.length;
    const totalPoints = epic.tickets.reduce((sum, t) => sum + t.points, 0);
    bodyChildren.push(
      body(
        `This epic contains ${ticketCount} feature tickets totaling ${totalPoints} story points, ` +
        `focused on delivering the core capabilities of ${epic.name.toLowerCase()} for the DeliveryBoost platform. ` +
        `Each ticket is designed to be independently testable and deployable, following our continuous delivery methodology. ` +
        `Priority assignments reflect the critical path for global launch, with P0 items required for MVP, P1 for full feature parity, and P2 for competitive advantage.`
      )
    );
    bodyChildren.push(spacer(100));

    for (const ticket of epic.tickets) {
      bodyChildren.push(...ticketCard(ticket));
    }

    // Page break before next epic (except the first)
    if (e < epics.length - 1) {
      // Add pageBreakBefore on next iteration's heading via the heading call
    }
  }

  // ── SPRINT PLANNING SUMMARY ────────────────────────────────────
  bodyChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 360, after: 160 },
      pageBreakBefore: true,
      children: [
        new TextRun({ text: "VII. Sprint Planning Summary", bold: true, size: 32, font: "Times New Roman", color: C.primary }),
      ],
    })
  );
  bodyChildren.push(
    body(
      "The following table provides a comprehensive overview of the six-sprint rollout plan for DeliveryBoost v2.0. " +
      "Each sprint spans two weeks and is designed to deliver incremental value, with the most critical platform integrations " +
      "and core features scheduled in the earlier sprints to de-risk the global launch timeline. Sprint 6 is reserved for " +
      "global quality assurance, localization verification, performance benchmarking, and launch readiness activities."
    )
  );
  bodyChildren.push(spacer(80));

  const sprintHeaders = ["Sprint", "Duration", "Tickets", "Points", "Key Deliverables"];
  const sprintColWidths = [1200, 1400, 2600, 900, 3260];
  const sprintRows = sprintSummary.map((s) => [s.sprint, s.duration, s.tickets, String(s.points), s.deliverables]);
  bodyChildren.push(makeTable(sprintHeaders, sprintRows, sprintColWidths));
  bodyChildren.push(spacer(200));

  const totalAllPoints = sprintSummary.reduce((s, r) => s + r.points, 0);
  bodyChildren.push(
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({ text: `Total Story Points Across All Sprints: ${totalAllPoints}`, bold: true, size: 26, font: "Times New Roman", color: C.primary }),
      ],
    })
  );

  bodyChildren.push(
    body(
      "This sprint plan ensures a phased rollout that prioritizes core functionality and the highest-volume platform integrations " +
      "in the early sprints, followed by regional expansion, advanced features, and quality assurance. The team velocity is estimated " +
      "at 25-30 story points per sprint, with a dedicated QA engineer embedded in each sprint starting from Sprint 2."
    )
  );

  // ── BUILD DOCUMENT ─────────────────────────────────────────────
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            size: 24,
            font: "Times New Roman",
            color: C.body,
          },
          paragraph: {
            spacing: { line: 360 },
          },
        },
      },
    },
    sections: [
      // Section 1: Cover Page (dark background, no header/footer)
      {
        properties: {
          page: {
            margin: { top: 0, bottom: 0, left: 0, right: 0 },
          },
        },
        children: coverChildren,
      },
      // Section 2: Table of Contents (Roman numeral page numbers)
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1.2),
              right: convertInchesToTwip(1.2),
            },
          },
        },
        footnotes: {},
        children: tocChildren,
      },
      // Section 3: Body (Arabic page numbers, header)
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1.2),
              right: convertInchesToTwip(1.2),
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                border: {
                  bottom: { style: BorderStyle.SINGLE, size: 1, color: C.accent, space: 4 },
                },
                spacing: { after: 0 },
                children: [
                  new TextRun({
                    text: "DeliveryBoost Feature Tickets v2.0 | Global Launch",
                    size: 18,
                    font: "Times New Roman",
                    color: C.accent,
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
                  new TextRun({ text: "Page ", size: 18, font: "Times New Roman", color: C.darkGray }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Times New Roman", color: C.darkGray }),
                ],
              }),
            ],
          }),
        },
        children: bodyChildren,
      },
    ],
  });

  // Serialize
  const buffer = await Packer.toBuffer(doc);

  const outDir = "/home/z/my-project/download/capnotif-docs";
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, "DeliveryBoost_Feature_Tickets.docx");
  fs.writeFileSync(outPath, buffer);
  console.log(`Document generated successfully: ${outPath}`);
  console.log(`File size: ${(buffer.length / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error("Error generating document:", err);
  process.exit(1);
});
