const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  TableOfContents, SectionType,
} = require("docx");
const fs = require("fs");

// Palette: GO-1 (Graphite Orange) for PRD/proposal
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

function bodyNoIndent(text) {
  return new Paragraph({
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

// Cover using R1 (Pure Paragraph Left) with GO-1 dark bg
function buildCover() {
  const title = "CapNotif";
  const subtitle = "Product Requirement Document";
  const meta = ["Version 1.0", "Date: June 7, 2026", "Author: Yashas K. Gangatkar", "Status: Draft"];

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
              children: [new TextRun({ text: title, bold: true, size: 80, color: P.cover.titleColor, font: { ascii: "Times New Roman", eastAsia: "SimHei" } })],
            }),
            new Paragraph({
              spacing: { before: 200, after: 100, line: 460, lineRule: "atLeast" },
              indent: { left: 100 },
              border: { left: { style: BorderStyle.SINGLE, size: 18, color: "D4875A", space: 12 } },
              children: [new TextRun({ text: "    " + subtitle, size: 32, color: P.cover.subtitleColor, font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })],
            }),
            new Paragraph({ spacing: { before: 600 } }),
            ...meta.map(m => new Paragraph({
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

// Body content
function buildBody() {
  return [
    heading("1. Executive Summary"),
    body("CapNotif is a cross-platform delivery driver notification aggregator designed to solve the fundamental problem faced by gig economy workers who operate across multiple delivery platforms simultaneously. Currently, delivery drivers for services such as DoorDash, UberEats, Grubhub, Instacart, and Amazon Flex must manually monitor multiple applications, each with its own notification system, alert sounds, and interface patterns. This fragmented experience leads to missed orders, slower acceptance times, reduced earnings, and increased cognitive load during active delivery sessions."),
    body("CapNotif addresses this by providing a single, unified notification feed that aggregates orders from all connected delivery platforms into one real-time dashboard. Drivers see every incoming order in a consistent, prioritized format with color-coded platform indicators, key order details at a glance (payout, distance, restaurant rating), and one-tap accept or dismiss actions. The application further enhances the driver experience through automated order acceptance rules, earnings tracking with weekly performance charts, and customizable notification settings that put the driver in full control of their workflow."),
    body("The product targets active gig delivery drivers in the United States who work across two or more platforms. The free tier provides core aggregation and dashboard functionality, while the premium tier at $9.99 per month unlocks auto-accept rules, advanced earnings analytics, and priority notification delivery. CapNotif is built as a web application using Next.js 16 with TypeScript, Tailwind CSS, and shadcn/ui components, ensuring a responsive, performant experience that works across desktop and mobile browsers."),

    heading("2. Problem Statement"),
    body("The gig delivery economy has grown rapidly, with millions of drivers earning income through platforms like DoorDash, UberEats, Grubhub, Instacart, and Amazon Flex. However, a significant operational challenge exists: drivers who want to maximize their earnings by working across multiple platforms face a fragmented and inefficient notification management experience. Each platform operates in isolation, with its own mobile application, notification format, alert mechanism, and user interface paradigm."),
    body("This fragmentation creates several concrete problems. First, drivers frequently miss high-value orders because notifications from one platform are buried under notifications from another, or because the driver is actively interacting with one app when a lucrative order appears on a different platform. Industry research suggests that drivers operating on three or more platforms miss approximately 15-20% of incoming orders during peak hours due to notification overload and context-switching delays."),
    body("Second, the cognitive load of constantly switching between different applications, each with different visual layouts, notification behaviors, and interaction patterns, leads to driver fatigue and increased error rates. Drivers must mentally parse different information formats for each platform, remember which swipe gesture does what on each app, and maintain awareness of multiple notification sounds simultaneously."),
    body("Third, there is no mechanism for drivers to set automated acceptance criteria across platforms. A driver who wants to accept only orders paying above $8 within 3 miles cannot express this preference consistently across platforms. Each platform has its own limited filtering options, and no cross-platform solution exists to enforce uniform acceptance criteria."),

    heading("3. Product Vision & Goals"),
    heading("3.1 Vision Statement", HeadingLevel.HEADING_2),
    body("To become the indispensable command center for gig delivery drivers, transforming a fragmented multi-platform experience into a single, intelligent, and empowering workflow that maximizes earnings and minimizes operational friction."),

    heading("3.2 Strategic Goals", HeadingLevel.HEADING_2),
    makeTable(
      ["Goal", "Description", "Success Metric"],
      [
        ["Unified Experience", "Aggregate notifications from all major delivery platforms into a single real-time feed", "Support 5+ platforms at launch"],
        ["Earnings Optimization", "Help drivers earn more through intelligent order filtering and auto-accept rules", "Users report 15%+ earnings increase"],
        ["Reduced Cognitive Load", "Present all order information in a consistent, scannable format", "90%+ user satisfaction score"],
        ["Time Savings", "Reduce the time between order notification and driver response", "Average acceptance time under 3 seconds"],
        ["Cross-Platform Consistency", "Same interface, same rules, same experience regardless of which platform the order comes from", "Zero platform-specific UI variations"],
      ]
    ),

    heading("4. Target Users & Personas"),
    heading("4.1 Primary Persona: The Multi-Platform Driver", HeadingLevel.HEADING_2),
    body("Name: Marcus, 32, full-time gig driver in a mid-size US city. Marcus works 40-50 hours per week across DoorDash, UberEats, and Grubhub. He relies on delivery income as his primary source of livelihood and is constantly looking for ways to maximize his hourly earnings. Marcus currently juggles three phones or keeps three apps open simultaneously, which is stressful and causes him to miss orders during peak dinner rush hours."),
    body("Marcus needs a way to see all incoming orders in one place, quickly identify the highest-paying opportunities, and avoid wasting time on low-value orders that consume more gas and time than they are worth. He is willing to pay a monthly subscription if the tool demonstrably increases his earnings by more than the subscription cost."),

    heading("4.2 Secondary Persona: The Part-Time Side Hustler", HeadingLevel.HEADING_2),
    body("Name: Sarah, 26, part-time driver who delivers on evenings and weekends to supplement her primary income. Sarah uses two platforms, typically Instacart and Amazon Flex, and values simplicity and ease of use over advanced features. She wants a straightforward dashboard that shows her active orders without complexity, and she is price-sensitive, preferring a free tier that covers her basic needs."),

    heading("4.3 User Demographics", HeadingLevel.HEADING_2),
    makeTable(
      ["Attribute", "Primary Segment", "Secondary Segment"],
      [
        ["Age Range", "25-45", "21-35"],
        ["Weekly Hours", "30-60 hours", "10-20 hours"],
        ["Platforms Used", "3-5 simultaneously", "2 platforms"],
        ["Primary Motivation", "Maximize earnings", "Convenience"],
        ["Tech Proficiency", "Moderate to High", "Moderate"],
        ["Willingness to Pay", "High (if ROI proven)", "Low to Moderate"],
      ]
    ),

    heading("5. Feature Requirements"),
    heading("5.1 Core Features (Free Tier)", HeadingLevel.HEADING_2),
    makeTable(
      ["Feature ID", "Feature", "Description", "Priority"],
      [
        ["F-001", "Unified Notification Feed", "Real-time aggregated feed of all incoming delivery orders from connected platforms, displayed in a consistent card-based layout with platform color coding", "P0"],
        ["F-002", "Platform Connections", "Toggle-based connection management for each delivery platform (DoorDash, UberEats, Grubhub, Instacart, Amazon Flex) with visual status indicators", "P0"],
        ["F-003", "One-Tap Accept/Dismiss", "Single-click order acceptance or dismissal directly from the notification card, with immediate visual feedback and platform API integration", "P0"],
        ["F-004", "Order Detail Cards", "Each order card displays platform source, restaurant name, payout amount, delivery distance, estimated completion time, and customer rating", "P0"],
        ["F-005", "Earnings Dashboard", "Weekly earnings tracker with session statistics including total earnings, number of accepted orders, average order value, and active session time", "P1"],
        ["F-006", "Dark Mode", "System-aware dark mode with manual toggle, defaulting to dark theme for optimal visibility during night driving", "P1"],
        ["F-007", "Auto-Refresh", "Dashboard automatically refreshes every 4 seconds to ensure real-time order visibility without manual page reloads", "P0"],
      ]
    ),

    heading("5.2 Premium Features ($9.99/month)", HeadingLevel.HEADING_2),
    makeTable(
      ["Feature ID", "Feature", "Description", "Priority"],
      [
        ["F-008", "Auto-Accept Rules", "Configurable rules for automatic order acceptance based on minimum payout, maximum delivery distance, and minimum restaurant rating thresholds", "P0"],
        ["F-009", "Min Payout Slider", "Slider control to set minimum order payout threshold for auto-accept, ranging from $3 to $25 with dollar-precision increments", "P0"],
        ["F-010", "Max Distance Filter", "Input control to set maximum delivery distance for auto-accept, ranging from 1 to 20 miles with half-mile precision", "P1"],
        ["F-011", "Min Rating Filter", "Slider control to set minimum restaurant rating threshold for auto-accept, ranging from 1.0 to 5.0 stars with 0.5-star increments", "P1"],
        ["F-012", "Advanced Earnings Analytics", "Detailed weekly charts with historical comparison, peak hour analysis, platform-by-platform breakdown, and projected earnings estimates", "P2"],
        ["F-013", "Priority Notifications", "Faster notification delivery with reduced latency compared to the free tier, ensuring premium users see orders first", "P2"],
        ["F-014", "Custom Notification Profiles", "Save and switch between different auto-accept rule profiles for different times of day or working conditions", "P2"],
      ]
    ),

    heading("5.3 Settings & Configuration", HeadingLevel.HEADING_2),
    makeTable(
      ["Feature ID", "Feature", "Description", "Priority"],
      [
        ["F-015", "Notification Toggle", "Enable or disable push notifications globally or per-platform", "P0"],
        ["F-016", "Sound Alerts", "Configurable alert sounds for new orders, with distinct sounds per platform if desired", "P1"],
        ["F-017", "Auto-Accept Toggle", "Master switch to enable or disable all auto-accept rules with a single toggle", "P0"],
        ["F-018", "Session Timer", "Track active delivery session duration with start/stop/reset controls", "P1"],
      ]
    ),

    heading("6. User Flows"),
    heading("6.1 First-Time User Onboarding", HeadingLevel.HEADING_2),
    body("When a new user visits CapNotif for the first time, they are presented with a hero section explaining the product value proposition: one feed for all platforms, maximum earnings. The onboarding flow guides the user through connecting their first delivery platform account. Each platform connection requires authentication via the platform's OAuth or credential verification system. Once at least one platform is connected, the dashboard becomes active and begins displaying incoming orders. The user can then customize their notification preferences and, if desired, upgrade to the premium tier for auto-accept functionality."),

    heading("6.2 Active Order Management Flow", HeadingLevel.HEADING_2),
    body("During an active delivery session, the user's primary interface is the live dashboard. Incoming orders appear as cards in the notification feed, color-coded by platform. Each card shows the essential decision-making information: payout, distance, restaurant name, and rating. The user can accept an order with a single tap on the green accept button, or dismiss it with the red dismiss button. Accepted orders are tracked in the earnings section, where the user can monitor their running total for the current session and week. If auto-accept is enabled, orders meeting the configured criteria are automatically accepted, and the user receives a confirmation notification rather than a decision prompt."),

    heading("6.3 Earnings Review Flow", HeadingLevel.HEADING_2),
    body("After completing a delivery session, the user navigates to the earnings section to review their performance. The earnings dashboard displays a weekly chart showing daily earnings, total session statistics, and a list of recently accepted orders with their individual details. This information helps the driver understand their earning patterns, identify which platforms are most profitable on specific days, and make informed decisions about future scheduling and platform prioritization."),

    heading("7. Non-Functional Requirements"),
    makeTable(
      ["Category", "Requirement", "Target"],
      [
        ["Performance", "Order notification latency", "< 2 seconds from platform event to UI display"],
        ["Performance", "Dashboard auto-refresh interval", "4 seconds"],
        ["Performance", "Initial page load time", "< 3 seconds on 4G connection"],
        ["Reliability", "Uptime target", "99.5% monthly availability"],
        ["Reliability", "Order notification delivery rate", "99.9% of orders displayed within target latency"],
        ["Security", "Platform credential storage", "AES-256 encryption at rest"],
        ["Security", "API communication", "TLS 1.3 for all API calls"],
        ["Security", "Authentication", "OAuth 2.0 for platform connections"],
        ["Usability", "Time to accept an order", "< 3 seconds from notification display"],
        ["Usability", "Mobile responsiveness", "Full functionality on screens >= 375px width"],
        ["Accessibility", "WCAG compliance", "WCAG 2.1 Level AA"],
      ]
    ),

    heading("8. Pricing Model"),
    heading("8.1 Free Tier", HeadingLevel.HEADING_2),
    body("The free tier provides the core notification aggregation experience, including unified notification feed, platform connections for up to 3 platforms, one-tap accept and dismiss, basic earnings dashboard with weekly totals, and dark mode support. This tier is designed to demonstrate immediate value and encourage adoption among the price-sensitive secondary user segment."),

    heading("8.2 Premium Tier ($9.99/month)", HeadingLevel.HEADING_2),
    body("The premium tier unlocks the full power of CapNotif, including auto-accept rules with configurable payout, distance, and rating filters, advanced earnings analytics with historical comparison and platform breakdowns, priority notification delivery for reduced latency, unlimited platform connections, and custom notification profiles. The pricing is calibrated to be significantly less than the expected earnings increase from using auto-accept rules, making the ROI clearly positive for active drivers."),

    heading("9. Release Roadmap"),
    makeTable(
      ["Phase", "Timeline", "Features", "Milestone"],
      [
        ["MVP", "Q3 2026", "F-001 through F-007 (Free Tier core features)", "Public beta launch with 3 platform integrations"],
        ["V1.0", "Q4 2026", "F-008 through F-014 (Premium features)", "Premium subscription launch with auto-accept"],
        ["V1.5", "Q1 2027", "F-015 through F-018, iOS/Android native apps", "Mobile app store launch"],
        ["V2.0", "Q2 2027", "AI-powered order recommendations, route optimization", "Intelligence features launch"],
      ]
    ),

    heading("10. Success Metrics & KPIs"),
    makeTable(
      ["Metric", "Target (6 months)", "Measurement Method"],
      [
        ["Monthly Active Users", "10,000 MAU", "Analytics dashboard"],
        ["Free-to-Premium Conversion", "8-12%", "Subscription analytics"],
        ["Average Session Duration", "45+ minutes", "Session tracking"],
        ["Order Acceptance Rate", "70%+ of displayed orders", "In-app event tracking"],
        ["User Retention (30-day)", "60%+", "Cohort analysis"],
        ["Net Promoter Score", "50+", "In-app survey"],
        ["Average Earnings Increase", "15%+ self-reported", "User survey"],
      ]
    ),

    heading("11. Risks & Mitigations"),
    makeTable(
      ["Risk", "Impact", "Probability", "Mitigation"],
      [
        ["Platform API changes or restrictions", "High", "Medium", "Maintain abstraction layer; monitor API changelogs; build fallback scraping capabilities"],
        ["Low free-to-paid conversion", "Medium", "Medium", "A/B test paywall timing; enhance premium value props; offer annual discount"],
        ["Security breach of platform credentials", "Critical", "Low", "SOC 2 compliance; regular penetration testing; minimal credential storage"],
        ["Platform legal challenges", "High", "Low", "Legal review of Terms of Service; position as notification aggregator not automation tool"],
        ["User adoption below projections", "Medium", "Medium", "Driver community engagement; referral program; influencer partnerships"],
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
    // Section 1: Cover
    {
      properties: { page: { size: pgSize, margin: { top: 0, bottom: 0, left: 0, right: 0 } } },
      children: buildCover(),
    },
    // Section 2: TOC
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
    // Section 3: Body
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { size: pgSize, margin: pgMargin, pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "CapNotif PRD v1.0", size: 18, color: "808080", font: { ascii: "Times New Roman" } })],
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
  fs.writeFileSync("/home/z/my-project/download/capnotif-docs/CapNotif_PRD.docx", buf);
  console.log("PRD generated successfully");
});
