const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  TableOfContents, SectionType,
} = require("docx");
const fs = require("fs");

// Palette: GO-1 for feature tickets
const P = {
  primary: "1A2330", body: "000000", secondary: "607080",
  accent: "D4875A", surface: "F8F0EB",
  cover: { titleColor: "FFFFFF", subtitleColor: "B0B8C0", metaColor: "90989F", footerColor: "687078" },
  table: { headerBg: "D4875A", headerText: "FFFFFF", accentLine: "D4875A", innerLine: "DDD0C8", surface: "F8F0EB" },
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
          shading: { type: ShadingType.CLEAR, fill: "1A2330" },
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
              border: { left: { style: BorderStyle.SINGLE, size: 18, color: "D4875A", space: 12 } },
              children: [new TextRun({ text: "    Feature Ticket List", size: 32, color: P.cover.subtitleColor, font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })],
            }),
            new Paragraph({ spacing: { before: 600 } }),
            ...["Version 1.0", "Date: June 7, 2026", "Author: Yashas K. Gangatkar", "Sprint: MVP Phase"].map(m => new Paragraph({
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
    heading("1. Ticket Overview"),
    body("This document contains the complete feature ticket list for the CapNotif MVP release. Each ticket is structured with a unique identifier, title, description, acceptance criteria, priority level, estimated story points, and assigned sprint. Tickets are organized by functional area and follow a priority-based execution order where P0 tickets are mandatory for launch, P1 tickets are highly recommended, and P2 tickets are desirable but can be deferred to subsequent releases if timeline constraints require it."),

    heading("2. Epic: Core Notification Aggregation"),
    heading("2.1 Unified Order Feed", HeadingLevel.HEADING_2),
    makeTable(
      ["Field", "Details"],
      [
        ["Ticket ID", "CAP-001"],
        ["Title", "Unified Order Notification Feed"],
        ["Epic", "Core Notification Aggregation"],
        ["Priority", "P0 - Critical"],
        ["Story Points", "8"],
        ["Sprint", "Sprint 1"],
      ]
    ),
    body("Description: Implement the core dashboard component that displays a real-time, aggregated feed of incoming delivery orders from all connected platforms. The feed must render orders as individual cards in a vertical scrolling layout, with each card displaying the platform source, restaurant name, payout amount, delivery distance, estimated completion time, and customer rating. Cards must be color-coded by platform using the designated brand colors: DoorDash red (#FF3008), UberEats green (#06C167), Grubhub yellow (#F4B824), Instacart green (#43B02A), and Amazon Flex orange (#FF9900)."),
    body("Acceptance Criteria: Given a user with at least one connected platform, when the dashboard loads, then orders from all connected platforms appear in a unified feed sorted by arrival time (newest first). Given an active order feed, when a new order arrives from any platform, then the order card appears at the top of the feed with a slide-down animation within 4 seconds of the platform event. Given the order feed is empty, when there are no pending orders, then a centered empty state message displays 'No orders right now. Stay alert!' with an appropriate illustration."),

    makeTable(
      ["Field", "Details"],
      [
        ["Ticket ID", "CAP-002"],
        ["Title", "Auto-Refresh Polling Mechanism"],
        ["Epic", "Core Notification Aggregation"],
        ["Priority", "P0 - Critical"],
        ["Story Points", "3"],
        ["Sprint", "Sprint 1"],
      ]
    ),
    body("Description: Implement the client-side auto-refresh mechanism that polls the server for new orders at a 4-second interval. The polling must be implemented as a useEffect hook with proper cleanup on component unmount, and must include a visual pulse indicator that shows the user the feed is actively refreshing. The polling should pause when the browser tab is not visible (using the Page Visibility API) and resume immediately when the tab regains focus, to avoid unnecessary API calls and battery consumption."),
    body("Acceptance Criteria: Given the dashboard is mounted and the tab is visible, when 4 seconds have elapsed since the last refresh, then the feed automatically fetches new orders from the server. Given the browser tab is hidden, when the visibility state changes to 'hidden', then polling pauses and resumes when the tab becomes visible again. Given the polling is active, when a visual pulse indicator is displayed, then users can see that the feed is being refreshed."),

    heading("2.2 Order Accept/Dismiss", HeadingLevel.HEADING_2),
    makeTable(
      ["Field", "Details"],
      [
        ["Ticket ID", "CAP-003"],
        ["Title", "One-Tap Order Accept Action"],
        ["Epic", "Core Notification Aggregation"],
        ["Priority", "P0 - Critical"],
        ["Story Points", "5"],
        ["Sprint", "Sprint 1"],
      ]
    ),
    body("Description: Implement the accept button on each order card that allows drivers to accept an order with a single click. The accept action must trigger an API call to the corresponding platform's acceptance endpoint, display a loading spinner during the API call, animate the card off-screen with a green flash upon success, add the order to the accepted orders list in the Earnings section, and show a success toast notification. If the acceptance fails (order already taken), display an inline error message and shake animation on the card."),
    body("Acceptance Criteria: Given an order card in the feed, when the user clicks the green Accept button, then the button shows a loading spinner and the API call is made within 500ms. Given the acceptance API succeeds, when the response is received, then the card animates off-screen with a green flash, the order appears in the Earnings accepted list, and a success toast shows for 3 seconds. Given the acceptance API fails, when the order is no longer available, then the card displays an error message 'Order no longer available' with a shake animation."),

    makeTable(
      ["Field", "Details"],
      [
        ["Ticket ID", "CAP-004"],
        ["Title", "One-Tap Order Dismiss Action"],
        ["Epic", "Core Notification Aggregation"],
        ["Priority", "P0 - Critical"],
        ["Story Points", "3"],
        ["Sprint", "Sprint 1"],
      ]
    ),
    body("Description: Implement the dismiss button on each order card that removes the order from the feed. The dismiss action is a local-only operation that does not communicate with the platform API. Upon clicking the red Dismiss button, the card must animate off-screen to the left with a red flash and be removed from the feed state. A subtle haptic feedback or visual confirmation should indicate the action was registered."),
    body("Acceptance Criteria: Given an order card in the feed, when the user clicks the red Dismiss button, then the card animates off-screen to the left with a red flash within 400ms. Given a dismissed order, when the animation completes, then the card is removed from the feed state and does not reappear on subsequent refreshes."),

    heading("3. Epic: Platform Integration"),
    makeTable(
      ["Field", "Details"],
      [
        ["Ticket ID", "CAP-005"],
        ["Title", "Platform Connection Management UI"],
        ["Epic", "Platform Integration"],
        ["Priority", "P0 - Critical"],
        ["Story Points", "5"],
        ["Sprint", "Sprint 1"],
      ]
    ),
    body("Description: Implement the Platform Connections section that displays cards for each supported delivery platform (DoorDash, UberEats, Grubhub, Instacart, Amazon Flex) with toggle switches for connecting and disconnecting. Each card must display the platform icon, name, and current connection status (Connected/Not Connected) with a color-coded indicator. The toggle switch must trigger the OAuth connection flow when enabled and a confirmation dialog when disabled."),
    body("Acceptance Criteria: Given a user on the Platforms section, when they view the section, then all 5 supported platforms are displayed as cards in a responsive grid. Given a disconnected platform card, when the user toggles the switch on, then the OAuth authorization flow begins for that platform. Given a connected platform card, when the user toggles the switch off, then a confirmation dialog appears asking 'Disconnect [Platform]?' before proceeding."),

    makeTable(
      ["Field", "Details"],
      [
        ["Ticket ID", "CAP-006"],
        ["Title", "DoorDash API Integration"],
        ["Epic", "Platform Integration"],
        ["Priority", "P0 - Critical"],
        ["Story Points", "8"],
        ["Sprint", "Sprint 2"],
      ]
    ),
    body("Description: Implement the DoorDashPlatformAdapter that integrates with the DoorDash Partner API for driver order notifications. The adapter must implement the PlatformAdapter interface with methods for OAuth 2.0 authentication, order retrieval, order acceptance, and credential refresh. All API calls must include proper error handling, rate limit tracking, and automatic token refresh when expired. The adapter must translate DoorDash-specific order data into the common Order model used by the application."),
    body("Acceptance Criteria: Given a user with a DoorDash connection, when new orders are available, then the adapter retrieves and normalizes them into the common Order format. Given an expired access token, when an API call fails with a 401 status, then the adapter automatically refreshes the token and retries the request. Given the DoorDash rate limit is approached, when the adapter detects remaining capacity below 20%, then it temporarily reduces polling frequency."),

    makeTable(
      ["Field", "Details"],
      [
        ["Ticket ID", "CAP-007"],
        ["Title", "UberEats API Integration"],
        ["Epic", "Platform Integration"],
        ["Priority", "P0 - Critical"],
        ["Story Points", "8"],
        ["Sprint", "Sprint 2"],
      ]
    ),
    body("Description: Implement the UberEatsPlatformAdapter following the same PlatformAdapter interface pattern as DoorDash. The adapter must handle UberEats-specific authentication flow, order data format, and API rate limits. Special attention must be paid to UberEats' webhook-based order notification system, which requires a publicly accessible endpoint for receiving order events in addition to the polling-based fallback."),
    body("Acceptance Criteria: Given a user with an UberEats connection, when new orders are available via webhook or polling, then the adapter normalizes them into the common Order format. Given the UberEats webhook endpoint, when a delivery request event is received, then the order appears in the feed within 2 seconds."),

    heading("4. Epic: Earnings Tracking"),
    makeTable(
      ["Field", "Details"],
      [
        ["Ticket ID", "CAP-008"],
        ["Title", "Weekly Earnings Chart"],
        ["Epic", "Earnings Tracking"],
        ["Priority", "P1 - High"],
        ["Story Points", "5"],
        ["Sprint", "Sprint 2"],
      ]
    ),
    body("Description: Implement the earnings chart component that displays a bar chart showing daily earnings for the current week (Monday through Sunday). The chart must use a responsive design that renders at 200px height on desktop and 160px on mobile. Bars must use the accent blue gradient color, with grid lines in the border-default color and axis labels in the text-secondary color. The chart must update in real-time when new orders are accepted during an active session."),
    body("Acceptance Criteria: Given a user with accepted orders this week, when they view the Earnings section, then a bar chart shows daily earnings with properly labeled axes and responsive scaling. Given the user accepts a new order, when the acceptance is confirmed, then the current day's bar height updates to reflect the new total within 1 second."),

    makeTable(
      ["Field", "Details"],
      [
        ["Ticket ID", "CAP-009"],
        ["Title", "Session Statistics Dashboard"],
        ["Epic", "Earnings Tracking"],
        ["Priority", "P1 - High"],
        ["Story Points", "3"],
        ["Sprint", "Sprint 2"],
      ]
    ),
    body("Description: Implement the session statistics component that displays four key metrics in a 2x2 grid: Total Earnings (sum of all accepted order payouts), Orders Accepted (count of accepted orders), Average Order Value (total earnings divided by order count), and Session Duration (elapsed time since session start). Each metric must be displayed in a stat card with a label, value, and appropriate formatting (currency for earnings, count for orders, time for duration)."),
    body("Acceptance Criteria: Given an active session, when the user views the Earnings section, then all four session statistics are displayed with accurate, real-time values. Given the user accepts an order, when the acceptance is confirmed, then Total Earnings, Orders Accepted, and Average Order Value update immediately."),

    heading("5. Epic: Premium Features"),
    makeTable(
      ["Field", "Details"],
      [
        ["Ticket ID", "CAP-010"],
        ["Title", "Auto-Accept Rules Engine"],
        ["Epic", "Premium Features"],
        ["Priority", "P0 - Critical"],
        ["Story Points", "8"],
        ["Sprint", "Sprint 3"],
      ]
    ),
    body("Description: Implement the auto-accept rules engine that automatically accepts orders meeting user-defined criteria. The engine must evaluate each incoming order against three configurable filters: minimum payout (slider, $3-$25, $1 increments), maximum delivery distance (input, 1-20 miles, 0.5-mile precision), and minimum restaurant rating (slider, 1.0-5.0 stars, 0.5-star increments). When all three criteria are met, the order is automatically accepted without user intervention. A master toggle must enable or disable all auto-accept rules simultaneously."),
    body("Acceptance Criteria: Given auto-accept is enabled with min payout $8, max distance 5 miles, min rating 4.0, when an order arrives with $10 payout, 3 miles distance, and 4.5 rating, then the order is automatically accepted within 1 second. Given the same rules, when an order arrives with $6 payout, 2 miles distance, and 4.5 rating, then the order is NOT automatically accepted and appears in the feed for manual decision. Given the auto-accept master toggle is off, when any order arrives, then no orders are automatically accepted regardless of rule criteria."),

    makeTable(
      ["Field", "Details"],
      [
        ["Ticket ID", "CAP-011"],
        ["Title", "Premium Paywall and Subscription Management"],
        ["Epic", "Premium Features"],
        ["Priority", "P1 - High"],
        ["Story Points", "5"],
        ["Sprint", "Sprint 3"],
      ]
    ),
    body("Description: Implement the premium subscription management system including the paywall UI, subscription flow via Stripe, and feature gating. Free users must see auto-accept controls as disabled with a lock icon and upgrade CTA. The pricing section must display Free and Premium tier comparison cards. Premium subscription at $9.99/month is processed through Stripe Checkout with webhook integration for payment confirmation. User tier status must be reflected throughout the application."),
    body("Acceptance Criteria: Given a free-tier user, when they view the Settings section, then auto-accept controls are disabled with a visible lock icon and 'Upgrade to Premium' CTA. Given a user who clicks 'Start Free Trial', when they complete the Stripe Checkout flow, then their account is upgraded to Premium and all premium features are unlocked immediately."),

    heading("6. Epic: Settings & Configuration"),
    makeTable(
      ["Field", "Details"],
      [
        ["Ticket ID", "CAP-012"],
        ["Title", "Notification Preferences"],
        ["Epic", "Settings & Configuration"],
        ["Priority", "P1 - High"],
        ["Story Points", "3"],
        ["Sprint", "Sprint 2"],
      ]
    ),
    body("Description: Implement notification preference controls in the Settings section. This includes a global push notification toggle, a sound alert toggle, and per-platform notification enable/disable switches. Preference changes must be persisted to the user's profile via the API and applied immediately without requiring a page refresh. The push notification implementation must use the Web Notifications API with proper permission request flow."),
    body("Acceptance Criteria: Given a user on the Settings section, when they toggle push notifications on, then a browser permission dialog appears. Given notification permissions are granted, when a new order arrives, then a push notification is displayed with the order details. Given the user disables sound alerts, when a new order arrives, then no sound is played but the visual notification still appears."),

    makeTable(
      ["Field", "Details"],
      [
        ["Ticket ID", "CAP-013"],
        ["Title", "Dark Mode Implementation"],
        ["Epic", "Settings & Configuration"],
        ["Priority", "P1 - High"],
        ["Story Points", "2"],
        ["Sprint", "Sprint 1"],
      ]
    ),
    body("Description: Implement dark mode using next-themes with system preference detection. The application defaults to dark mode. A manual toggle in the Settings section allows users to override the system preference. Theme changes must apply immediately across all components without page reload. All components must properly support both light and dark themes with appropriate color tokens as specified in the Frontend Specification document."),
    body("Acceptance Criteria: Given a new user visiting the application, when no theme preference is set, then the app uses dark mode by default. Given the user toggles the theme in Settings, when the switch changes state, then all components update to the selected theme immediately. Given the user has selected 'System' as their theme preference, when the OS switches between light and dark mode, then the application theme follows the OS setting."),

    heading("7. Epic: User Authentication"),
    makeTable(
      ["Field", "Details"],
      [
        ["Ticket ID", "CAP-014"],
        ["Title", "User Registration and Login"],
        ["Epic", "User Authentication"],
        ["Priority", "P0 - Critical"],
        ["Story Points", "5"],
        ["Sprint", "Sprint 1"],
      ]
    ),
    body("Description: Implement user authentication using NextAuth.js with email/password credentials, Google OAuth, and GitHub OAuth providers. The registration flow must collect email and password with validation (minimum 8 characters, at least one uppercase, one number). Login must support all three authentication methods with proper error handling and user feedback. Session management must use HTTP-only secure cookies with 24-hour expiration."),
    body("Acceptance Criteria: Given a new user on the registration page, when they submit valid credentials, then an account is created and they are automatically logged in. Given a registered user, when they login with correct credentials, then they are authenticated and redirected to the dashboard. Given an authentication attempt with invalid credentials, when the submission fails, then a clear error message is displayed without revealing whether the email or password was incorrect."),

    heading("8. Sprint Planning Summary"),
    makeTable(
      ["Sprint", "Duration", "Tickets", "Total Points", "Deliverable"],
      [
        ["Sprint 1", "Week 1-2", "CAP-001, CAP-002, CAP-003, CAP-004, CAP-005, CAP-013, CAP-014", "31", "Core feed, accept/dismiss, platform UI, dark mode, auth"],
        ["Sprint 2", "Week 3-4", "CAP-006, CAP-007, CAP-008, CAP-009, CAP-012", "24", "Platform integrations, earnings chart, notifications"],
        ["Sprint 3", "Week 5-6", "CAP-010, CAP-011", "13", "Auto-accept rules, premium subscription"],
      ]
    ),
    body("Total story points for MVP: 68 points across 3 sprints. This estimate assumes a single full-stack developer working at a sustainable pace. With additional team members, sprints can be parallelized where dependencies allow. Sprint 1 establishes the foundation with the core feed and authentication. Sprint 2 builds out platform integrations and the earnings dashboard. Sprint 3 delivers the premium auto-accept features that complete the monetization strategy."),
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
            children: [new TextRun({ text: "CapNotif Feature Tickets v1.0", size: 18, color: "808080", font: { ascii: "Times New Roman" } })],
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
  fs.writeFileSync("/home/z/my-project/download/capnotif-docs/CapNotif_Feature_Tickets.docx", buf);
  console.log("Feature Tickets generated successfully");
});
