const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  TableOfContents, SectionType,
} = require("docx");
const fs = require("fs");

// Palette: CM-2 (Blue Orange) for frontend spec
const P = {
  primary: "1284BA", body: "000000", secondary: "506070",
  accent: "1284BA", surface: "EDF4F9",
  cover: { titleColor: "1284BA", subtitleColor: "606060", metaColor: "707070", footerColor: "A0A0A0" },
  table: { headerBg: "1284BA", headerText: "FFFFFF", accentLine: "1284BA", innerLine: "D8E4EC", surface: "EDF4F9" },
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
          shading: { type: ShadingType.CLEAR, fill: "FEFEFE" },
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
              border: { left: { style: BorderStyle.SINGLE, size: 18, color: "FF862F", space: 12 } },
              children: [new TextRun({ text: "    Frontend Specification Document", size: 32, color: P.cover.subtitleColor, font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })],
            }),
            new Paragraph({ spacing: { before: 600 } }),
            ...["Version 1.0", "Date: June 7, 2026", "Author: Yashas K. Gangatkar", "Status: Draft"].map(m => new Paragraph({
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
    heading("1. Frontend Architecture Overview"),
    body("The CapNotif frontend is built as a single-page application using Next.js 16 with the App Router, providing a seamless, responsive user experience that works across desktop and mobile browsers. The architecture follows a component-based design where each major section of the application is encapsulated in an independent React component with its own state management, data fetching, and rendering logic. This modular approach enables parallel development, independent testing, and incremental feature delivery."),
    body("The frontend renders using a hybrid of React Server Components (RSC) for initial page loads and Client Components for interactive elements. Server Components handle data fetching and static content rendering, reducing the JavaScript bundle sent to the client. Client Components, marked with the 'use client' directive, manage interactive state including the live order feed, platform connection toggles, auto-accept rule configuration, and theme switching. This hybrid approach optimizes for both initial load performance and interactivity."),

    heading("2. Design System"),
    heading("2.1 Color Palette", HeadingLevel.HEADING_2),
    makeTable(
      ["Token", "Light Mode", "Dark Mode", "Usage"],
      [
        ["Background Primary", "#FFFFFF", "#0A0A0A", "Page background"],
        ["Background Secondary", "#F8FAFC", "#1A1A2E", "Card backgrounds, section backgrounds"],
        ["Background Tertiary", "#F1F5F9", "#16213E", "Hover states, elevated surfaces"],
        ["Text Primary", "#0F172A", "#F8FAFC", "Headings, primary text"],
        ["Text Secondary", "#475569", "#94A3B8", "Body text, descriptions"],
        ["Text Muted", "#94A3B8", "#64748B", "Captions, timestamps, labels"],
        ["Accent Blue", "#3B82F6", "#60A5FA", "Links, interactive elements"],
        ["Accent Green", "#22C55E", "#4ADE80", "Accept buttons, success states"],
        ["Accent Red", "#EF4444", "#F87171", "Dismiss buttons, error states"],
        ["Accent Orange", "#F97316", "#FB923C", "Warnings, pending states"],
        ["Border Default", "#E2E8F0", "#334155", "Card borders, dividers"],
      ]
    ),

    heading("2.2 Typography", HeadingLevel.HEADING_2),
    makeTable(
      ["Element", "Font", "Weight", "Size", "Line Height"],
      [
        ["Page Title", "Inter", "800 (Extra Bold)", "36px / 2.25rem", "1.2"],
        ["Section Heading", "Inter", "700 (Bold)", "24px / 1.5rem", "1.3"],
        ["Card Title", "Inter", "600 (Semi Bold)", "18px / 1.125rem", "1.4"],
        ["Body Text", "Inter", "400 (Regular)", "16px / 1rem", "1.6"],
        ["Caption/Label", "Inter", "500 (Medium)", "14px / 0.875rem", "1.5"],
        ["Badge/Tag", "Inter", "600 (Semi Bold)", "12px / 0.75rem", "1.3"],
        ["Monospace", "JetBrains Mono", "400 (Regular)", "14px / 0.875rem", "1.5"],
      ]
    ),

    heading("2.3 Spacing System", HeadingLevel.HEADING_2),
    body("The spacing system follows a consistent 4px base unit, with common values being 4px (0.25rem), 8px (0.5rem), 12px (0.75rem), 16px (1rem), 20px (1.25rem), 24px (1.5rem), 32px (2rem), 40px (2.5rem), 48px (3rem), and 64px (4rem). Component internal padding uses 16-24px, while section-level spacing uses 48-64px between major content blocks. Card padding is consistently 16px on mobile and 24px on desktop, with 12px internal gaps between card elements."),

    heading("3. Component Specifications"),
    heading("3.1 Navigation Bar (Navbar)", HeadingLevel.HEADING_2),
    makeTable(
      ["Property", "Specification"],
      [
        ["Position", "Fixed top, full width, z-index 50"],
        ["Height", "64px desktop, 56px mobile"],
        ["Background", "White (light) / #0A0A0A (dark) with blur backdrop"],
        ["Border Bottom", "1px solid border-default color"],
        ["Logo", "Left-aligned, 'CapNotif' text in Inter Bold 20px with accent color"],
        ["Navigation Links", "Center-aligned: Dashboard, Earnings, Platforms, Settings"],
        ["User Menu", "Right-aligned: avatar circle + dropdown (Profile, Subscription, Logout)"],
        ["Mobile", "Hamburger menu icon triggers slide-out drawer from left"],
      ]
    ),

    heading("3.2 Hero Section", HeadingLevel.HEADING_2),
    body("The hero section serves as the landing experience for first-time visitors and returning users. It features a bold headline 'One Feed. All Platforms. Maximum Earnings.' displayed in Inter Extra Bold at 48px on desktop and 32px on mobile. Below the headline, a subtitle paragraph in Inter Regular 18px explains the core value proposition. The hero includes animated floating notification cards that cycle through different platform-branded order examples, providing a visual preview of the unified feed experience. A prominent call-to-action button 'Get Started Free' in accent green with rounded corners links to the platform connection flow."),

    heading("3.3 Dashboard Section (Live Order Feed)", HeadingLevel.HEADING_2),
    makeTable(
      ["Property", "Specification"],
      [
        ["Layout", "Full-width scrollable area with stacked order cards"],
        ["Auto-Refresh", "4-second polling interval with visual pulse indicator"],
        ["Empty State", "Centered illustration + 'No orders right now. Stay alert!' message"],
        ["Card Width", "100% with max-width 600px, centered"],
        ["Card Spacing", "12px vertical gap between cards"],
        ["Platform Color Bar", "4px left border in platform brand color"],
        ["Platform Colors", "DoorDash: #FF3008, UberEats: #06C167, Grubhub: #F4B824, Instacart: #43B02A, Amazon Flex: #FF9900"],
        ["Card Content", "Platform name + order ID badge | Restaurant name | Payout (bold, accent green) | Distance | Rating stars | Accept/Dismiss buttons"],
        ["Accept Button", "Green (#22C55E) filled, 80px wide, 36px tall, rounded-lg, white text"],
        ["Dismiss Button", "Red (#EF4444) outlined, 80px wide, 36px tall, rounded-lg, red text"],
        ["Accept Animation", "Card slides right with green flash, then fades out"],
        ["Dismiss Animation", "Card slides left with red flash, then fades out"],
        ["New Order Animation", "Card slides down from top with subtle bounce"],
      ]
    ),

    heading("3.4 Earnings Section", HeadingLevel.HEADING_2),
    makeTable(
      ["Property", "Specification"],
      [
        ["Layout", "Two-column on desktop (chart left, stats right), stacked on mobile"],
        ["Chart Type", "Bar chart showing daily earnings for the current week (Mon-Sun)"],
        ["Chart Height", "200px desktop, 160px mobile"],
        ["Chart Colors", "Bars: accent blue gradient, Grid lines: border-default, Labels: text-secondary"],
        ["Session Stats", "Total Earnings, Orders Accepted, Avg Order Value, Session Duration"],
        ["Stats Cards", "2x2 grid on desktop, stacked on mobile, 12px gap"],
        ["Recent Orders", "List of last 10 accepted orders below chart, scrollable"],
        ["Order List Item", "Platform icon | Restaurant | Payout | Time accepted"],
      ]
    ),

    heading("3.5 Platform Connections Section", HeadingLevel.HEADING_2),
    makeTable(
      ["Property", "Specification"],
      [
        ["Layout", "Grid of platform cards, 3 columns desktop, 2 tablet, 1 mobile"],
        ["Card Design", "Rounded-xl, shadow-md, 16px padding, platform icon top-center"],
        ["Platform Name", "Inter Semi Bold 16px below icon"],
        ["Status Indicator", "Green dot + 'Connected' or Gray dot + 'Not Connected'"],
        ["Toggle Switch", "shadcn/ui Switch component, accent green when active"],
        ["Connect Flow", "Click toggle opens OAuth redirect to platform authorization page"],
        ["Disconnect Flow", "Confirmation dialog: 'Disconnect [Platform]? You will stop receiving orders from this platform.'"],
      ]
    ),

    heading("3.6 Pricing Section", HeadingLevel.HEADING_2),
    makeTable(
      ["Property", "Specification"],
      [
        ["Layout", "Two side-by-side cards, Free left and Premium right, centered"],
        ["Free Card", "White background, standard border, feature list with checkmarks"],
        ["Premium Card", "Accent blue border, 'Most Popular' badge top-right, slight elevation"],
        ["Price Display", "'$9.99' in Inter Extra Bold 40px, '/month' in Regular 16px"],
        ["Feature Comparison", "Checkmarks for included, X marks for excluded features"],
        ["CTA Free", "'Get Started' outlined button"],
        ["CTA Premium", "'Start Free Trial' filled accent blue button with hover effect"],
        ["Mobile", "Stacked cards, Premium card first"],
      ]
    ),

    heading("3.7 Settings Section", HeadingLevel.HEADING_2),
    makeTable(
      ["Property", "Specification"],
      [
        ["Auto-Accept Master Toggle", "Large shadcn/ui Switch with label 'Auto-Accept Orders'"],
        ["Min Payout Slider", "shadcn/ui Slider, range $3-$25, step $1, current value displayed"],
        ["Max Distance Input", "Number input with 'mi' suffix, range 1-20, step 0.5"],
        ["Min Rating Slider", "shadcn/ui Slider, range 1.0-5.0, step 0.5, star icons"],
        ["Push Notifications Toggle", "shadcn/ui Switch with label"],
        ["Sound Alerts Toggle", "shadcn/ui Switch with label"],
        ["Dark Mode Toggle", "shadcn/ui Switch with label, synced with next-themes"],
        ["Premium Gate", "Auto-accept controls disabled with lock icon for free users, upgrade CTA"],
      ]
    ),

    heading("4. Responsive Breakpoints"),
    makeTable(
      ["Breakpoint", "Width", "Columns", "Navigation", "Card Layout"],
      [
        ["Mobile", "< 640px", "1", "Hamburger menu", "Full-width stacked"],
        ["Tablet", "640px - 1023px", "2", "Top nav, condensed", "2-column grid"],
        ["Desktop", "1024px - 1279px", "3", "Full top nav", "3-column grid"],
        ["Wide Desktop", ">= 1280px", "3", "Full top nav, centered content (max-width 1200px)", "3-column grid"],
      ]
    ),

    heading("5. Interaction Patterns"),
    heading("5.1 Order Acceptance Flow", HeadingLevel.HEADING_2),
    body("When the user clicks the green Accept button on an order card, the following interaction sequence occurs: the button text changes to a spinner animation, the card border briefly flashes green (300ms), the card slides right and fades out (400ms transition), and a success toast notification appears at the bottom of the screen with the order details. The order is simultaneously added to the accepted orders list in the Earnings section, and the session earnings counter updates in real-time. If the acceptance fails due to the order being taken by another driver, the card shakes horizontally and displays an inline error message 'Order no longer available' before fading out."),

    heading("5.2 Platform Connection Flow", HeadingLevel.HEADING_2),
    body("Connecting a new platform involves a multi-step flow: the user clicks the toggle on the platform card, a modal appears explaining what data will be shared with CapNotif and requesting explicit consent, the user clicks 'Authorize' which opens the platform's OAuth consent screen in a popup window, after authorization the popup closes and the platform card updates to show the connected state with a green pulse animation, and a confirmation toast notification appears. If authorization fails, the toggle returns to the off position and an error toast explains the failure reason."),

    heading("5.3 Auto-Accept Configuration", HeadingLevel.HEADING_2),
    body("Auto-accept rules are configured through the Settings section. The master toggle enables or disables all auto-accept rules. When enabled, three filter controls become active: the minimum payout slider, maximum distance input, and minimum rating slider. Each control displays its current value in real-time as the user adjusts it. A summary line below the controls reads 'Auto-accepting orders paying at least $X, within Y miles, from restaurants rated Z+ stars.' This summary updates dynamically as the user adjusts any control, providing immediate feedback on the effective rule set."),

    heading("6. Animation Specifications"),
    makeTable(
      ["Animation", "Duration", "Easing", "Trigger", "Property"],
      [
        ["Card entrance", "300ms", "ease-out", "New order in feed", "translateY(-20px) to 0, opacity 0 to 1"],
        ["Card accept exit", "400ms", "ease-in", "Accept button click", "translateX(100px), opacity to 0"],
        ["Card dismiss exit", "400ms", "ease-in", "Dismiss button click", "translateX(-100px), opacity to 0"],
        ["Card error shake", "300ms", "ease-in-out", "Failed acceptance", "translateX(-8px, 8px, -4px, 4px, 0)"],
        ["Toggle switch", "200ms", "cubic-bezier(0.4, 0, 0.2, 1)", "Toggle click", "background-color, translate for knob"],
        ["Toast notification", "300ms", "ease-out", "Action completed", "translateY(20px) to 0, opacity 0 to 1"],
        ["Pulse indicator", "2000ms", "ease-in-out", "Continuous", "scale(1, 1.2, 1), opacity(1, 0.5, 1)"],
        ["Section fade-in", "500ms", "ease-out", "Scroll into viewport", "opacity 0 to 1"],
      ]
    ),

    heading("7. Accessibility Requirements"),
    makeTable(
      ["Requirement", "Implementation", "WCAG Level"],
      [
        ["Color Contrast", "All text meets 4.5:1 ratio against backgrounds", "AA"],
        ["Focus Indicators", "Visible 2px outline on all interactive elements", "AA"],
        ["Keyboard Navigation", "Tab order follows visual layout; Enter/Space activate controls", "AA"],
        ["Screen Reader Labels", "aria-label on all buttons, toggles, and interactive elements", "AA"],
        ["Live Region Updates", "aria-live='polite' on order feed for new order announcements", "AA"],
        ["Reduced Motion", "Respects prefers-reduced-motion; disables animations", "AA"],
        ["Touch Targets", "Minimum 44x44px for all interactive elements on mobile", "AA"],
        ["Semantic HTML", "Proper heading hierarchy, landmark regions, list structures", "AA"],
      ]
    ),

    heading("8. Performance Budgets"),
    makeTable(
      ["Metric", "Target", "Measurement"],
      [
        ["First Contentful Paint (FCP)", "< 1.5 seconds", "Lighthouse"],
        ["Largest Contentful Paint (LCP)", "< 2.5 seconds", "Lighthouse"],
        ["Time to Interactive (TTI)", "< 3.0 seconds", "Lighthouse"],
        ["Cumulative Layout Shift (CLS)", "< 0.1", "Lighthouse"],
        ["First Input Delay (FID)", "< 100ms", "Lighthouse"],
        ["JavaScript Bundle Size", "< 150KB (gzipped)", "Webpack Analyzer"],
        ["CSS Bundle Size", "< 50KB (gzipped)", "Webpack Analyzer"],
        ["Image Optimization", "WebP/AVIF, lazy loading, responsive srcsets", "Manual"],
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
            children: [new TextRun({ text: "CapNotif Frontend Specification v1.0", size: 18, color: "808080", font: { ascii: "Times New Roman" } })],
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
  fs.writeFileSync("/home/z/my-project/download/capnotif-docs/CapNotif_Frontend_Specification.docx", buf);
  console.log("Frontend Specification generated successfully");
});
