const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, HeadingLevel, PageBreak, BorderStyle,
  TableOfContents, ShadingType, PageNumber, Footer, Header,
  NumberFormat, Tab, TabStopType, TabStopPosition, convertInchesToTwip,
  ImageRun, VerticalAlign, ExternalHyperlink
} = require("docx");
const fs = require("fs");
const path = require("path");

// ─── Color Palette ───────────────────────────────────────────────────
const C = {
  primary:   "1284BA",
  body:      "000000",
  accent:    "FF862F",
  surface:   "EDF4F9",
  tblHeader: "1284BA",
  white:     "FFFFFF",
  coverBg:   "FEFEFE",
  lightGray: "F5F5F5",
  medGray:   "E0E0E0",
  darkGray:  "666666",
};

// ─── Category Colors ─────────────────────────────────────────────────
const CATEGORIES = [
  { name: "Food",       color: "FF6B35" },
  { name: "Grocery",    color: "22C55E" },
  { name: "Package",    color: "3B82F6" },
  { name: "Pharmacy",   color: "8B5CF6" },
  { name: "Alcohol",    color: "F59E0B" },
  { name: "Flower",     color: "EC4899" },
  { name: "Pet",        color: "14B8A6" },
  { name: "Cannabis",   color: "84CC16" },
  { name: "Courier",    color: "F97316" },
  { name: "Express",    color: "EF4444" },
  { name: "Q-Commerce", color: "06B6D4" },
  { name: "Last-Mile",  color: "6366F1" },
  { name: "Document",   color: "78716C" },
  { name: "Moving",     color: "A855F7" },
  { name: "Return",     color: "64748B" },
];

// ─── Helper: Heading ─────────────────────────────────────────────────
function heading(text, level = 1) {
  const sizes = { 1: 32, 2: 28, 3: 24 };
  const sz = sizes[level] || 24;
  return new Paragraph({
    heading: level === 1 ? HeadingLevel.HEADING_1 : level === 2 ? HeadingLevel.HEADING_2 : HeadingLevel.HEADING_3,
    spacing: { before: 360, after: 200 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: sz,
        font: "Times New Roman",
        color: C.primary,
      }),
    ],
  });
}

// ─── Helper: Body Paragraph ──────────────────────────────────────────
function body(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 200, line: 360 },
    indent: opts.indent ? { left: opts.indent } : undefined,
    children: [
      new TextRun({
        text,
        size: 24,
        font: "Times New Roman",
        color: opts.color || C.body,
        bold: opts.bold || false,
        italics: opts.italics || false,
      }),
    ],
  });
}

// ─── Helper: Make Table ──────────────────────────────────────────────
function makeTable(headers, rows, colWidths) {
  const totalWidth = colWidths ? colWidths.reduce((a, b) => a + b, 0) : 9000;
  const computeWidths = colWidths || headers.map(() => Math.floor(totalWidth / headers.length));

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) =>
      new TableCell({
        width: { size: computeWidths[i], type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, color: C.tblHeader },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 60 },
            children: [
              new TextRun({ text: h, bold: true, size: 20, font: "Times New Roman", color: C.white }),
            ],
          }),
        ],
      })
    ),
  });

  const dataRows = rows.map((row, ri) =>
    new TableRow({
      children: row.map((cell, ci) =>
        new TableCell({
          width: { size: computeWidths[ci], type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, color: ri % 2 === 0 ? C.lightGray : C.white },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              alignment: ci === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
              spacing: { before: 40, after: 40 },
              children: [
                new TextRun({ text: String(cell), size: 18, font: "Times New Roman", color: C.body }),
              ],
            }),
          ],
        })
      ),
    })
  );

  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    rows: [headerRow, ...dataRows],
  });
}

// ─── Helper: Bullet item ─────────────────────────────────────────────
function bullet(text, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { after: 80, line: 340 },
    children: [
      new TextRun({ text, size: 24, font: "Times New Roman", color: C.body }),
    ],
  });
}

// ─── Helper: Spacer ──────────────────────────────────────────────────
function spacer(h = 200) {
  return new Paragraph({ spacing: { before: h } });
}

// ─── Helper: Accent bar paragraph (for subtitle) ─────────────────────
function accentBar(text) {
  return new Paragraph({
    spacing: { before: 200, after: 100 },
    indent: { left: 400 },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: C.accent, space: 10 } },
    children: [
      new TextRun({ text, size: 36, font: "Times New Roman", color: C.body, bold: false }),
    ],
  });
}

// ═════════════════════════════════════════════════════════════════════
// BUILD DOCUMENT
// ═════════════════════════════════════════════════════════════════════
async function main() {
  // ─── COVER PAGE ────────────────────────────────────────────────────
  const coverChildren = [
    spacer(2400),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "DeliveryBoost", size: 88, font: "Times New Roman", color: C.primary, bold: true }),
      ],
    }),
    spacer(200),
    accentBar("Frontend Specification Document"),
    spacer(400),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "Version 2.0 | Global UX", size: 28, font: "Times New Roman", color: C.darkGray }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "Date: June 7, 2026", size: 24, font: "Times New Roman", color: C.darkGray }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "Author: Yashas K. Gangatkar", size: 24, font: "Times New Roman", color: C.darkGray }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({ text: "Status: Draft", size: 24, font: "Times New Roman", color: C.accent, bold: true }),
      ],
    }),
    spacer(800),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "Aggregating 200+ delivery platforms across 190 countries", size: 22, font: "Times New Roman", color: C.darkGray, italics: true }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80 },
      children: [
        new TextRun({ text: "Food \u2022 Grocery \u2022 Pharmacy \u2022 Package \u2022 Courier \u2022 Express \u2022 Q-Commerce \u2022 Last-Mile & more", size: 20, font: "Times New Roman", color: C.darkGray, italics: true }),
      ],
    }),
  ];

  // ─── TABLE OF CONTENTS PAGE ────────────────────────────────────────
  const tocChildren = [
    heading("Table of Contents", 1),
    spacer(100),
    new TableOfContents("Table of Contents", {
      hyperlink: true,
      headingStyleRange: "1-3",
    }),
    spacer(200),
    body("Note: Page numbers in this section use Roman numerals (i, ii, iii \u2026). Body pages use Arabic numerals starting from 1.", { italics: true, color: C.darkGray }),
  ];

  // ─── SECTION 1: Frontend Architecture Overview ─────────────────────
  const sec1 = [
    heading("1. Frontend Architecture Overview", 1),
    body("DeliveryBoost employs Next.js 16 with the App Router as its foundational framework, leveraging React Server Components (RSC) for data-heavy pages and Client Components for interactive elements such as real-time order cards, WebSocket-driven dashboards, and category filter pills. The server-component architecture ensures that initial page loads carry minimal JavaScript, while client components hydrate only the interactive portions of the UI, delivering a fastest-possible first contentful paint across all 190 supported countries."),
    body("Global content delivery is achieved through a multi-region CDN deployment with edge rendering at 45+ points of presence worldwide. Each edge node runs a lightweight Next.js server capable of performing server-side rendering for locale-specific routes such as /en-US, /ar-SA, /ja-JP, and /zh-CN. This edge-first approach reduces round-trip latency to under 50 ms for the vast majority of users, which is critical for real-time delivery notification aggregation where a 500 ms delay can mean a missed acceptance window for time-sensitive orders."),
    body("The architecture enforces a strict separation between data-fetching layers and presentation layers. Server components handle all API calls to delivery platform connectors, transform the responses into a unified Order interface, and stream rendered HTML to the client. Client components consume this pre-rendered content and augment it with real-time updates via WebSocket connections managed through a dedicated mini-service on port 3003. This separation ensures that even when a WebSocket connection drops, the page remains functional with the last-known server-rendered state."),
    body("State management follows a hybrid approach: Zustand manages ephemeral client-side UI state (active category filter, selected currency, sidebar toggles), while TanStack Query handles server state with automatic background refetching and optimistic updates for order acceptance actions. The combination provides a responsive, always-fresh user experience without the complexity of a global Redux store. Route-based code splitting ensures that each page only loads the components and libraries it needs, keeping bundle sizes well within performance budgets even with support for 20+ locale bundles and 15 delivery category modules."),
    spacer(100),
  ];

  // ─── SECTION 2: Design System ──────────────────────────────────────
  const sec2 = [
    heading("2. Design System", 1),

    heading("2.1 Color Palette", 2),
    body("The DeliveryBoost design system defines a comprehensive set of color tokens that adapt automatically between light and dark modes. Each token serves a specific purpose in the visual hierarchy, ensuring consistency across all 15 delivery categories while maintaining sufficient contrast for WCAG 2.1 AA compliance. The primary palette draws from the brand blue (#1284BA) for interactive elements and the accent orange (#FF862F) for call-to-action highlights, while the surface palette provides a layered background system that creates depth without visual noise."),
    makeTable(
      ["Token", "Light Mode", "Dark Mode", "Usage"],
      [
        ["--bg-background", "#FFFFFF", "#0F172A", "Page background"],
        ["--bg-surface", "#EDF4F9", "#1E293B", "Card / panel background"],
        ["--bg-surface-alt", "#F8FAFC", "#334155", "Alternate row / section bg"],
        ["--text-primary", "#0F172A", "#F8FAFC", "Primary body text"],
        ["--text-secondary", "#64748B", "#94A3B8", "Secondary / muted text"],
        ["--accent-primary", "#1284BA", "#38BDF8", "Links, active states, CTAs"],
        ["--accent-orange", "#FF862F", "#FB923C", "CTA buttons, notifications"],
        ["--border-default", "#E2E8F0", "#475569", "Card borders, dividers"],
        ["--status-success", "#22C55E", "#4ADE80", "Delivered, connected status"],
        ["--status-warning", "#F59E0B", "#FBBF24", "Pending, slow delivery"],
        ["--status-error", "#EF4444", "#F87171", "Failed, disconnected status"],
        ["--category-tint", "varies", "varies (40% opacity)", "Category background tint"],
      ],
      [2400, 2000, 2000, 2600]
    ),
    spacer(200),

    heading("2.2 Typography", 2),
    body("Typography in DeliveryBoost is designed to handle the extreme diversity of scripts required for global coverage. The primary typeface stack prioritizes readability across Latin, CJK, and RTL scripts, with graceful fallbacks for less common writing systems. Font loading is optimized through a strategy of critical-subset inlining for above-the-fold text and asynchronous loading for the full character sets, ensuring that text is always visible within 100 ms regardless of the user's locale."),
    makeTable(
      ["Role", "Font Family", "Weight Range", "Size Scale", "Script Support"],
      [
        ["Primary (Latin)", "Inter", "400\u2013700", "12px\u201372px", "Latin, Cyrillic, Greek"],
        ["CJK Primary", "Noto Sans SC / JP / KR", "400\u2013700", "12px\u201372px", "Chinese, Japanese, Korean"],
        ["RTL Primary", "Noto Sans Arabic", "400\u2013700", "12px\u201372px", "Arabic, Urdu, Farsi"],
        ["Hebrew", "Noto Sans Hebrew", "400\u2013700", "12px\u201372px", "Hebrew"],
        ["Devanagari", "Noto Sans Devanagari", "400\u2013700", "12px\u201372px", "Hindi, Marathi"],
        ["Thai", "Noto Sans Thai", "400\u2013700", "12px\u201372px", "Thai"],
        ["Monospace", "JetBrains Mono", "400\u2013600", "12px\u201316px", "All (code, IDs)"],
        ["Headings (print)", "Times New Roman", "700", "16pt\u201372pt", "Latin fallback"],
      ],
      [1600, 2000, 1200, 1200, 3000]
    ),
    spacer(200),

    heading("2.3 Spacing System", 2),
    body("The spacing system is built on a 4 px base grid, ensuring pixel-perfect alignment across all components and breakpoints. All padding, margins, gaps, and positioning values are multiples of 4 px, which aligns cleanly with both standard display densities and high-DPI screens at 2\u00d7 and 3\u00d7 scaling. The system defines a scale of spacing tokens from 4 px (1 unit) through 128 px (32 units), with commonly used values of 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, and 128 px mapped to semantic names such as --space-xs through --space-3xl."),
    body("Component-level spacing follows a consistent internal pattern: compact components (buttons, badges, pills) use 8 px padding; standard components (cards, list items) use 16 px padding; and spacious components (dashboard sections, modal bodies) use 24 px padding. Gaps between sibling elements within flex or grid containers default to 16 px, reducing to 8 px in dense data views like order queues. This systematic approach eliminates spacing inconsistencies and makes the layout predictable for both designers and developers working across the 15 category modules."),
    spacer(100),
  ];

  // ─── SECTION 3: Category Visual Language ───────────────────────────
  const sec3 = [
    heading("3. Category Visual Language", 1),
    body("Each delivery category in DeliveryBoost is assigned a unique color that serves as a persistent visual identifier across every surface of the application\u2014order cards, dashboard charts, filter pills, notification badges, and platform connection indicators. This color-coding system enables drivers and couriers to instantly recognize the type of delivery at a glance, which is crucial when managing concurrent orders from multiple platforms and categories during peak hours. The 15 category colors were selected to maximize perceptual distinction even for users with common forms of color vision deficiency, with each pair separated by at least 30 degrees of hue rotation."),
    body("Beyond color alone, each category features a distinctive icon from the Lucide icon set and a unique pattern overlay used in compact views where color alone may be ambiguous. For example, the Food category uses an orange (#FF6B35) background with a utensils icon and a diagonal-stripe pattern, while the Package category uses a blue (#3B82F6) background with a box icon and a dot-grid pattern. These triple-encoded identifiers (color + icon + pattern) ensure that no category information is conveyed through color alone, meeting WCAG 2.1 AA requirements for color-blind accessibility."),
    makeTable(
      ["Category", "Hex Code", "Icon (Lucide)", "Pattern", "Dark Mode"],
      CATEGORIES.map(c => {
        const icons = {
          Food: "Utensils", Grocery: "ShoppingCart", Package: "Package",
          Pharmacy: "Pill", Alcohol: "Wine", Flower: "Flower2",
          Pet: "PawPrint", Cannabis: "Leaf", Courier: "Truck",
          Express: "Zap", "Q-Commerce": "Timer", "Last-Mile": "MapPin",
          Document: "FileText", Moving: "Move", Return: "Undo2",
        };
        const patterns = {
          Food: "Diagonal stripes", Grocery: "Cross-hatch", Package: "Dot grid",
          Pharmacy: "Rx symbol", Alcohol: "Horizontal lines", Flower: "Petal scatter",
          Pet: "Paw dots", Cannabis: "Leaf veins", Courier: "Chevron",
          Express: "Lightning", "Q-Commerce": "Clock ticks", "Last-Mile": "Pin grid",
          Document: "Lines", Moving: "Arrows", Return: "Curved arrow",
        };
        const darkColors = {
          Food: "FF8F5E", Grocery: "4ADE80", Package: "60A5FA",
          Pharmacy: "A78BFA", Alcohol: "FCD34D", Flower: "F472B6",
          Pet: "2DD4BF", Cannabis: "A3E635", Courier: "FB923C",
          Express: "F87171", "Q-Commerce": "22D3EE", "Last-Mile": "818CF8",
          Document: "A8A29E", Moving: "C084FC", Return: "94A3B8",
        };
        return [c.name, `#${c.color}`, icons[c.name] || "Circle", patterns[c.name] || "Solid", `#${darkColors[c.name] || c.color}`];
      }),
      [1600, 1200, 1600, 1800, 1800]
    ),
    spacer(200),
    body("Category colors are exposed as CSS custom properties (--cat-food, --cat-grocery, etc.) and consumed by all components through the design token system. In dark mode, category colors are automatically lightened by 15\u201325% to maintain vibrancy against dark backgrounds while preserving perceptual distinction. The token layer also includes derived values such as --cat-food-tint (8% opacity) for background fills and --cat-food-border (60% opacity) for border accents, ensuring that category theming is applied consistently without manual color manipulation in component code."),
    spacer(100),
  ];

  // ─── SECTION 4: Component Specifications ───────────────────────────
  const sec4 = [
    heading("4. Component Specifications", 1),

    heading("4.1 Navbar", 2),
    body("The global navbar serves as the primary navigation and configuration hub for the entire application. It features the DeliveryBoost logo on the left, a category filter strip in the center, and a cluster of utility controls on the right including language selector, currency selector, notification bell, and user avatar. The navbar is sticky on desktop (position: sticky, top: 0) and collapses into a slide-out drawer on mobile, activated by a hamburger icon. The category filter strip displays horizontal scrollable pills for each of the 15 delivery categories, with the active category highlighted using its designated color token and a subtle underline animation."),
    body("The language selector dropdown displays the current language in its native script (e.g., \u0627\u0644\u0639\u0631\u0628\u064a\u0629 for Arabic, \u65e5\u672c\u8a9e for Japanese) and opens a searchable list of all 20+ supported languages. Selecting a new language triggers an immediate client-side locale switch with no page reload, leveraging Next.js 16\u2019s built-in i18n routing. The currency selector follows a similar pattern, showing the currency symbol and ISO code (e.g., \u20b9 INR, \u00a5 JPY, $ USD) and updating all monetary displays across the application in real-time without a server round-trip, using locally cached exchange rates that refresh every 15 minutes."),

    heading("4.2 Hero Section", 2),
    body("The hero section occupies the full viewport height on first visit and presents a compelling value proposition: \u201cOne app. Every delivery. Worldwide.\u201d The background features an animated gradient that subtly shifts between category colors on a 30-second cycle, reinforcing the multi-category nature of the platform. A prominent call-to-action button styled in the accent orange (#FF862F) invites couriers to \u201cStart Accepting Orders\u201d, while a secondary link provides \u201cView Demo Dashboard\u201d for prospective users who want to explore before signing up. The hero adapts its layout for RTL languages, mirroring the text alignment and button placement."),

    heading("4.3 Dashboard", 2),
    body("The dashboard is the heart of the DeliveryBoost experience, presenting a real-time feed of incoming orders as category-colored cards in a masonry grid layout. Each order card displays the platform logo, delivery category icon, pickup and drop-off addresses, estimated earnings in the selected currency, and a countdown timer for acceptance. Cards are bordered on the left with a 4 px stripe in the category color, providing instant visual categorization. The dashboard supports filtering by category through the navbar pills, by platform through a sidebar accordion grouped by region, and by status (pending, accepted, in-progress, completed) through tab controls above the card grid."),
    body("Category filter pills sit below the navbar and display the count of pending orders per category in real-time, updated via WebSocket. Clicking a pill filters the dashboard to show only orders from that category; clicking again deselects it to show all categories. Multiple pills can be selected simultaneously for multi-category filtering. Each pill animates with a scale-up entrance when its count changes from zero and a scale-down exit when it returns to zero, providing perceptible feedback about order flow dynamics without requiring the user to constantly scan the entire grid."),

    heading("4.4 Earnings Section", 2),
    body("The earnings section provides a comprehensive financial overview with multi-currency support and category-level breakdowns. The top-level summary displays total earnings for the current period in the user\u2019s selected currency, with automatic conversion from the original transaction currency using daily exchange rates cached locally. Below the summary, a stacked bar chart visualizes earnings by category over the selected time period (daily, weekly, monthly), with each segment colored according to the category visual language. Clicking a segment drills down to a detailed table of individual transactions within that category."),
    body("The category breakdown table lists each delivery category with its total earnings, order count, average order value, and percentage contribution to overall earnings. Each row is color-coded with the category\u2019s designated tint, and the category name is prefixed with its icon for quick scanning. Currency switching in the navbar instantly recalculates all values in the earnings section without a page refresh, using the cached exchange rate data. For drivers operating across multiple currencies in border regions (e.g., EU drivers accepting orders in EUR, CHF, and GBP), the earnings section includes a multi-currency view that shows original and converted amounts side by side."),

    heading("4.5 Platform Connections", 2),
    body("The platform connections page displays all 200+ supported delivery platforms organized into a grouped accordion by geographic region (North America, Europe, Asia-Pacific, Latin America, Middle East & Africa) and further sub-grouped by delivery category within each region. Each platform entry shows the platform logo, name, connection status badge (Connected / Pending / Disconnected), and a connect/disconnect toggle. Connecting to a platform triggers an OAuth flow that opens a secure popup window for the platform\u2019s authentication page; upon successful authentication, the popup closes and the connection status updates in real-time via WebSocket."),
    body("Regional grouping is essential because drivers typically operate within a single geographic area and need to quickly find and connect to all relevant platforms without scrolling through hundreds of irrelevant entries. The accordion remembers its expand/collapse state in local storage, so drivers only need to set up their region preferences once. A search bar at the top allows filtering by platform name across all regions, and a category filter restricts results to platforms of a specific delivery type. The connection flow includes error handling for expired tokens, rate-limited APIs, and platform-specific consent screens, with clear visual feedback at every stage."),

    heading("4.6 Pricing Section", 2),
    body("The pricing section presents DeliveryBoost\u2019s subscription tiers with regional pricing that accounts for purchasing power parity across 190 countries. The Free tier supports up to 3 platform connections and displays a daily earnings summary; the Pro tier ($9.99/month in the US, adjusted by region) supports unlimited connections, real-time order streaming, and advanced analytics; the Enterprise tier offers custom integrations, dedicated support, and SLA guarantees for fleet operators. Each tier is displayed as a card with feature checkmarks and a \u201cSubscribe\u201d button that adapts its label to the user\u2019s language."),
    body("Regional pricing is calculated using a PPP (Purchasing Power Parity) index that adjusts the base USD price for each country. For example, the Pro tier costs \u20b9299/month in India, R$49.90/month in Brazil, and \u00a57.99/month in the UK. The pricing display automatically shows the correct regional price based on the user\u2019s detected locale, with a toggle to view prices in other currencies. Annual billing offers a 20% discount and is highlighted with a badge and strikethrough pricing on the monthly rate to encourage longer commitments."),

    heading("4.7 Settings", 2),
    body("The settings page provides granular control over the DeliveryBoost experience, organized into tabbed sections: Profile, Notifications, Categories, Language & Region, and Advanced. The Categories tab is particularly important for multi-category drivers, allowing them to configure category-specific auto-accept rules. For example, a driver can set auto-accept for Food orders above $8 within 2 km, while requiring manual acceptance for Pharmacy orders regardless of value. Each rule is displayed as an editable card with condition fields for minimum earnings, maximum distance, and time-of-day schedule."),
    body("The Language & Region tab includes a language selector with search, a currency selector, a timezone selector, and a distance unit toggle (km vs. miles). Changing the language immediately updates all UI text without a page reload; changing the currency recalculates all monetary displays; and changing the timezone re-formats all timestamps. The Advanced tab includes developer-oriented settings such as WebSocket reconnection interval, notification sound selection per category (e.g., a chime for Food, a bell for Package), and a debug mode toggle that displays API response times in the navbar for performance monitoring."),
    spacer(100),
  ];

  // ─── SECTION 5: Internationalization (i18n) ────────────────────────
  const sec5 = [
    heading("5. Internationalization (i18n)", 1),
    body("DeliveryBoost\u2019s internationalization strategy is designed to deliver a native-quality experience in every supported locale, not merely translated text. The i18n layer handles five distinct challenges: text direction (LTR vs. RTL), script-specific typography (Latin, CJK, Arabic, Devanagari, Thai), locale-aware number and currency formatting, timezone-sensitive date/time display, and culturally appropriate UX patterns such as form field ordering, name conventions, and color symbolism. Each of these dimensions is addressed through a combination of ICU MessageFormat strings, CSS logical properties, and runtime locale detection."),

    heading("5.1 RTL Support", 2),
    body("Right-to-left (RTL) support for Arabic, Hebrew, Urdu, and Farsi goes far beyond simple text alignment. The entire layout system uses CSS logical properties (margin-inline-start instead of margin-left, padding-inline-end instead of padding-right) so that flipping the direction attribute on the root element automatically mirrors the entire UI. Navigation bars swap their logo and utility positions, card layouts reverse their content flow, and animation directions invert (slide-in-right becomes slide-in-left). The RTL detection is automatic based on the selected locale, but a manual toggle is available in Settings for bilingual users who prefer one direction for UI and another for content."),
    body("Arabic text rendering uses Noto Sans Arabic with appropriate ligature and joining behavior enabled through the font-feature-settings CSS property. Number digits in Arabic locales can render in either Western Arabic numerals (0\u20139) or Eastern Arabic numerals (\u0660\u2013\u0669) based on user preference, with the default determined by the sub-locale (ar-SA uses Eastern, ar-AE uses Western). Date formatting in Arabic locales includes the Hijri calendar as an optional overlay, displaying both Gregorian and Hijri dates for users in Saudi Arabia and other countries that use dual-calendar systems."),

    heading("5.2 CJK Font Handling", 2),
    body("Chinese, Japanese, and Korean text rendering requires dedicated font stacks because Latin-oriented fonts like Inter lack the necessary CJK character coverage. DeliveryBoost loads Noto Sans SC for Simplified Chinese, Noto Sans TC for Traditional Chinese, Noto Sans JP for Japanese, and Noto Sans KR for Korean. These fonts are loaded asynchronously after the initial paint to avoid blocking render, with a font-display: swap strategy that shows fallback system fonts during the load period. The CJK fonts are subset by Unicode range using @font-face unicode-range declarations, so only the glyphs needed for the current locale are downloaded, reducing font payload from 15 MB to approximately 2 MB per script."),
    body("Vertical text mode is supported for Japanese and Traditional Chinese users who prefer vertical reading direction in certain contexts such as order detail headers and print receipts. When vertical mode is enabled via the language settings, the affected text blocks switch from horizontal to vertical writing mode using CSS writing-mode: vertical-rl, with line height and character spacing adjusted for optimal readability in the vertical orientation. This feature is particularly important for the Japanese market, where vertical text is culturally expected in formal and traditional contexts."),

    heading("5.3 Number, Date, and Currency Formatting", 2),
    body("Number formatting is fully locale-aware using the Intl.NumberFormat API with appropriate grouping separators, decimal markers, and digit sets. For example, 1,234,567.89 in en-US displays as 1.234.567,89 in de-DE, 12,34,567.89 in en-IN, and \u0661\u066c\u0662\u0663\u0664\u066c\u0665\u0666\u0667\u066b\u0668\u0669 in ar-SA with Eastern Arabic numerals. Currency formatting extends number formatting with locale-appropriate symbol positioning: $1,234.56 in the US, 1,234.56$ in Quebec French, \u20ac1.234,56 in Germany, and \u00a51,234,567 in Japan (no decimal for JPY). All currency conversions use a cached exchange rate table updated every 15 minutes from a reliable forex API."),
    body("Date and time formatting uses the Intl.DateTimeFormat API with timezone-aware rendering. The user\u2019s detected timezone is used as the default, but drivers operating across timezone boundaries (e.g., a driver in France accepting orders from Switzerland) can configure a display timezone independently of their device timezone. Relative time strings (\u201c5 minutes ago\u201d, \u201cin 2 hours\u201d) are localized using the Intl.RelativeTimeFormat API, which handles the grammatical variations across languages such as Arabic\u2019s dual number forms and Japanese\u2019s context-sensitive counter words."),
    spacer(100),
  ];

  // ─── SECTION 6: Responsive Design ──────────────────────────────────
  const sec6 = [
    heading("6. Responsive Design", 1),
    body("DeliveryBoost follows a mobile-first responsive design methodology, where the base stylesheet targets mobile screens and progressive enhancements are applied at wider breakpoints. This approach ensures that the mobile experience\u2014which represents over 70% of driver usage worldwide\u2014is never an afterthought. The responsive system uses Tailwind CSS 4\u2019s built-in breakpoint prefixes (sm:, md:, lg:, xl:) combined with container queries for component-level responsiveness, allowing individual cards and modules to adapt independently of the viewport width."),
    makeTable(
      ["Breakpoint", "Width Range", "Grid Columns", "Sidebar", "Card Layout", "Primary Use"],
      [
        ["Mobile", "< 640 px", "1", "Hidden (drawer)", "Stacked", "On-the-go order acceptance"],
        ["Tablet", "640\u20131023 px", "2", "Collapsed (icons)", "2-column masonry", "Vehicle-mounted displays"],
        ["Desktop", "1024\u20131279 px", "3", "Expanded (icons + labels)", "3-column masonry", "Office/home management"],
        ["Wide", "\u2265 1280 px", "4", "Expanded + analytics", "4-column masonry", "Fleet operations center"],
      ],
      [1200, 1400, 1200, 1800, 1600, 1800]
    ),
    spacer(200),
    body("On mobile, the dashboard presents a single-column feed of order cards with swipe-to-accept and swipe-to-dismiss gestures. The navbar collapses into a bottom navigation bar with five tabs: Orders, Earnings, Platforms, Pricing, and Settings. Category filter pills scroll horizontally below the bottom nav. The earnings chart converts to a simple horizontal bar chart that fits the narrow viewport, and platform connections display as a searchable list rather than an accordion. All touch targets maintain a minimum size of 44 \u00d7 44 px as required by WCAG 2.1 and Apple\u2019s Human Interface Guidelines."),
    body("At the desktop breakpoint, the full sidebar navigation becomes visible with grouped sections for each major feature area. The dashboard expands to a 3-column masonry grid with larger cards that display more information including a mini-map of the delivery route. The earnings section adds a detailed line chart alongside the category breakdown table. Platform connections display in a two-panel layout with the region/category tree on the left and the platform detail panel on the right. The wide breakpoint (\u22651280 px) adds a fourth column to the dashboard and introduces a real-time analytics sidebar showing live order flow rates, average acceptance times, and earnings velocity per category."),
    spacer(100),
  ];

  // ─── SECTION 7: Interaction Patterns ───────────────────────────────
  const sec7 = [
    heading("7. Interaction Patterns", 1),

    heading("7.1 Order Acceptance Flow", 2),
    body("The order acceptance flow is the most critical interaction in DeliveryBoost, as speed directly impacts a driver\u2019s earnings. When a new order arrives, it appears as an animated card that slides in from the right edge of the dashboard. The card displays the countdown timer prominently, and the accept button is sized at a minimum of 56 \u00d7 56 px on mobile for easy thumb tapping. On acceptance, the card animates with a shrink-and-fade exit while a success toast appears at the bottom of the screen. If the timer expires, the card greys out and slides off to the left with a subtle vibration on supported devices. The entire flow from card appearance to acceptance completion is optimized to take fewer than 2 seconds for experienced users."),

    heading("7.2 Platform Connection Flow", 2),
    body("Connecting to a delivery platform follows a region-aware OAuth 2.0 flow. When the driver clicks \u201cConnect\u201d on a platform entry, a popup window opens to the platform\u2019s OAuth authorization URL, which includes the appropriate region-specific API endpoint and locale parameters. For example, connecting to Uber Eats in Japan routes to auth.uber.com with locale=ja_JP, while connecting in Brazil routes with locale=pt_BR. After the driver authenticates and grants permissions, the platform redirects back to DeliveryBoost\u2019s callback URL with an authorization code, which is exchanged for access and refresh tokens server-side. The popup closes automatically, and the connection status updates to \u201cConnected\u201d with a green badge and a checkmark animation."),

    heading("7.3 Category Switching", 2),
    body("Switching between delivery categories is handled through the horizontal filter pills in the navbar. Tapping a category pill applies an immediate visual filter to the dashboard, fading out cards that don\u2019t match the selected category with a 200 ms CSS transition. The earnings chart simultaneously highlights the selected category\u2019s segment and dims the others. Multiple categories can be selected by tapping additional pills, with a union filter applied. A long-press on a category pill opens a context menu with options to view category-specific settings, auto-accept rules, and platform connections for that category."),

    heading("7.4 Language Switching", 2),
    body("Language switching uses Next.js 16\u2019s built-in i18n routing to update the locale prefix in the URL (e.g., /en-US/dashboard \u2192 /ar-SA/dashboard). The switch is performed client-side using the router.push() method with the new locale, which triggers a re-render of all server components with the updated locale context. During the transition, a 150 ms fade animation masks the layout shift that occurs when switching between LTR and RTL directions. The user\u2019s language preference is persisted in a cookie and synchronized across all open tabs via the BroadcastChannel API."),

    heading("7.5 Currency Switching", 2),
    body("Currency switching is handled entirely client-side using cached exchange rate data. When the user selects a new currency from the dropdown, all monetary values in the visible viewport are recalculated and re-rendered within a single animation frame using requestAnimationFrame. The transition includes a brief number-morph animation where the digits smoothly interpolate from the old value to the new value over 300 ms, providing a perceptible visual confirmation that the conversion has occurred. The selected currency is stored in localStorage and applied on subsequent visits without requiring a server round-trip."),
    spacer(100),
  ];

  // ─── SECTION 8: Animation Specifications ───────────────────────────
  const sec8 = [
    heading("8. Animation Specifications", 1),
    body("Animations in DeliveryBoost serve a functional purpose beyond visual polish: they communicate state changes, guide attention to critical information (such as incoming orders with expiring timers), and provide confirmation feedback for user actions. All animations respect the user\u2019s prefers-reduced-motion setting and degrade gracefully to instant state changes when motion is disabled. The animation system uses CSS transitions for simple property changes and Framer Motion for complex orchestration with spring physics, ensuring that every animation feels natural and responsive across the full range of supported devices."),
    makeTable(
      ["Animation", "Trigger", "Duration", "Easing", "Properties", "Reduced Motion"],
      [
        ["Card Entrance", "New order arrives", "300 ms", "spring(1, 0.8)", "translateX, opacity", "Fade in only"],
        ["Accept Exit", "Order accepted", "250 ms", "ease-in", "scale, opacity", "Instant hide"],
        ["Dismiss Exit", "Order dismissed/expired", "300 ms", "ease-out", "translateX, opacity", "Instant hide"],
        ["Category Filter", "Filter pill selected", "200 ms", "ease-in-out", "opacity, scale of cards", "Instant filter"],
        ["Language Switch", "Locale changed", "150 ms", "ease-in-out", "opacity (fade cross-dissolve)", "Instant switch"],
        ["Currency Update", "Currency changed", "300 ms", "spring(1, 0.9)", "text content (morph)", "Instant update"],
        ["Toast Notification", "Action confirmed", "350 ms", "spring(1, 0.7)", "translateY, opacity", "Instant show"],
        ["Pulse Indicator", "Live order count", "1500 ms", "ease-in-out", "box-shadow (pulse)", "Static dot"],
      ],
      [1400, 1400, 1000, 1400, 1800, 1400]
    ),
    spacer(200),
    body("The card entrance animation is the most frequently triggered animation in the application and is carefully optimized for performance. It uses the CSS will-change property on incoming cards to promote them to their own compositing layer, ensuring that the animation runs at 60 fps even on mid-range Android devices. The spring physics in the entrance animation produce a subtle overshoot that draws the eye toward the new card without being distracting. For drivers who receive a high volume of orders simultaneously (e.g., during lunch rush), a staggered delay of 50 ms per card prevents visual chaos and creates a cascading entrance effect that naturally guides attention from top to bottom."),
    spacer(100),
  ];

  // ─── SECTION 9: Accessibility Requirements ─────────────────────────
  const sec9 = [
    heading("9. Accessibility Requirements", 1),
    body("DeliveryBoost is committed to WCAG 2.1 Level AA compliance across all locales, scripts, and delivery categories. Accessibility is not treated as an afterthought or a bolt-on feature; rather, it is woven into every component from the design phase through implementation and testing. The application supports screen readers in all 20+ languages, provides keyboard navigation for every interactive element, and ensures that no information is conveyed through visual means alone. The accessibility team conducts quarterly audits with users who have motor, visual, cognitive, and auditory disabilities across five continents."),
    makeTable(
      ["Requirement", "Standard", "Implementation", "Testing Method"],
      [
        ["Color Contrast (Text)", "WCAG 2.1 AA 1.4.3", "Min 4.5:1 for body, 3:1 for large text", "Automated axe-core + manual review"],
        ["Color Contrast (UI)", "WCAG 2.1 AA 1.4.11", "Min 3:1 for interactive components", "Automated axe-core"],
        ["Color-Blind Safe Categories", "WCAG 2.1 AA 1.4.1", "Color + icon + pattern triple encoding", "Coblis simulator testing"],
        ["Keyboard Navigation", "WCAG 2.1 AA 2.1.1", "All features accessible via Tab/Enter/Space", "Manual keyboard-only testing"],
        ["Screen Reader (20+ langs)", "WCAG 2.1 AA 4.1.2", "ARIA labels in every supported language", "NVDA, JAWS, VoiceOver, TalkBack"],
        ["RTL Screen Reader", "WCAG 2.1 AA 1.3.2", "dir=auto + logical ARIA ordering", "Arabic VoiceOver + NVDA"],
        ["Focus Indicators", "WCAG 2.1 AA 2.4.7", "Visible 3 px ring in primary color", "Manual + automated"],
        ["Touch Target Size", "WCAG 2.1 AA 2.5.5", "Min 44 \u00d7 44 px on all interactive elements", "Layout inspection"],
        ["Motion Sensitivity", "WCAG 2.1 AA 2.3.1", "Respect prefers-reduced-motion", "OS setting toggle test"],
        ["Error Identification", "WCAG 2.1 AA 3.3.1", "Inline error messages with aria-describedby", "Screen reader verification"],
      ],
      [1600, 1400, 2800, 2200]
    ),
    spacer(200),
    body("RTL accessibility requires special attention because many ARIA patterns and screen reader behaviors assume LTR layout. DeliveryBoost addresses this by using logical ARIA properties (aria-labelstart vs. aria-labelend) and testing with Arabic and Hebrew screen reader users on both iOS VoiceOver and Android TalkBack. The reading order of dashboard cards is explicitly controlled through the DOM order rather than visual positioning, ensuring that screen readers announce cards in a logical sequence regardless of the layout direction. Additionally, the category filter pills use aria-pressed to communicate their toggle state and aria-live regions to announce real-time order count changes without interrupting the user\u2019s current screen reader narration."),
    spacer(100),
  ];

  // ─── SECTION 10: Performance Budgets ────────────────────────────────
  const sec10 = [
    heading("10. Performance Budgets", 1),
    body("Performance is a first-class requirement for DeliveryBoost because every millisecond of latency can result in a missed order for time-sensitive deliveries. The performance budgets are derived from real-world usage data collected from beta drivers across 15 countries and are enforced through automated CI/CD checks that block deployment if any budget is exceeded. The budgets account for the full range of supported devices, from high-end iPhones to budget Android phones with 2 GB RAM and slow 3G connections."),
    makeTable(
      ["Metric", "Budget", "Current", "Enforcement", "Measurement"],
      [
        ["First Contentful Paint (FCP)", "< 1.5 s", "1.2 s", "CI check", "Lighthouse CI"],
        ["Largest Contentful Paint (LCP)", "< 2.5 s", "2.1 s", "CI check", "Lighthouse CI"],
        ["Time to Interactive (TTI)", "< 3.0 s", "2.6 s", "CI check", "Lighthouse CI"],
        ["Cumulative Layout Shift (CLS)", "< 0.1", "0.04", "CI check", "Web Vitals"],
        ["First Input Delay (FID)", "< 100 ms", "45 ms", "CI check", "Web Vitals"],
        ["JS Bundle (initial)", "< 150 KB gzipped", "128 KB", "Webpack size limit", "Build pipeline"],
        ["JS Bundle (total)", "< 500 KB gzipped", "410 KB", "Webpack size limit", "Build pipeline"],
        ["CSS Bundle (total)", "< 50 KB gzipped", "38 KB", "Webpack size limit", "Build pipeline"],
        ["Font Payload (per locale)", "< 200 KB", "165 KB", "Custom check", "Build pipeline"],
        ["Image (hero, compressed)", "< 100 KB", "72 KB", "Custom check", "Build pipeline"],
        ["WebSocket message", "< 1 KB", "0.6 KB", "Custom check", "Integration test"],
        ["Lighthouse Score", "\u2265 90", "94", "CI check", "Lighthouse CI"],
      ],
      [1800, 1600, 1200, 1600, 1800]
    ),
    spacer(200),
    body("Image optimization follows a multi-format strategy: all photographic images are served in WebP format with AVIF fallback for browsers that support it, while vector icons use inline SVG to eliminate additional network requests. The hero background gradient is generated entirely in CSS, avoiding any image download for the most prominent visual element. Delivery platform logos are loaded lazily as they scroll into view and are served from a CDN-cached sprite sheet that bundles all 200+ logos into a single request. Each logo is encoded as a tiny SVG path (< 1 KB) to minimize the sprite sheet\u2019s total size while maintaining crisp rendering at any display density."),
    body("The real-time WebSocket connection uses a binary protocol (MessagePack) instead of JSON to reduce message size by approximately 40%, which is significant during peak hours when a driver may receive 50+ order notifications per minute. The WebSocket connection automatically falls back to Server-Sent Events (SSE) when binary transport is not available, and ultimately to short polling at 5-second intervals for the most constrained network conditions. All three transport layers share the same client-side event handler interface, ensuring that the application code is transport-agnostic and that switching between transports has zero impact on the user experience."),
    spacer(100),
  ];

  // ═══════════════════════════════════════════════════════════════════
  // ASSEMBLE DOCUMENT
  // ═══════════════════════════════════════════════════════════════════
  const doc = new Document({
    creator: "Yashas K. Gangatkar",
    title: "DeliveryBoost Frontend Specification Document v2.0",
    description: "Frontend specification for DeliveryBoost - a worldwide delivery notification aggregator",
    styles: {
      default: {
        heading1: {
          run: {
            size: 32,
            bold: true,
            font: "Times New Roman",
            color: C.primary,
          },
          paragraph: {
            spacing: { before: 360, after: 200 },
          },
        },
        heading2: {
          run: {
            size: 28,
            bold: true,
            font: "Times New Roman",
            color: C.primary,
          },
          paragraph: {
            spacing: { before: 280, after: 160 },
          },
        },
        heading3: {
          run: {
            size: 24,
            bold: true,
            font: "Times New Roman",
            color: C.primary,
          },
          paragraph: {
            spacing: { before: 200, after: 120 },
          },
        },
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
      // ─── Cover Page ─────────────────────────────────────────────
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        children: coverChildren,
      },

      // ─── TOC Section (Roman numerals) ───────────────────────────
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
            pageNumbers: { start: 1 },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ children: [PageNumber.CURRENT], size: 20, font: "Times New Roman", color: C.darkGray }),
                ],
              }),
            ],
          }),
        },
        children: tocChildren,
      },

      // ─── Body Section (Arabic numerals) ─────────────────────────
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
            pageNumbers: { start: 1 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.medGray, space: 4 } },
                children: [
                  new TextRun({ text: "DeliveryBoost Frontend Specification v2.0 | Global UX", size: 16, font: "Times New Roman", color: C.darkGray, italics: true }),
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
        children: [
          ...sec1,
          ...sec2,
          ...sec3,
          ...sec4,
          ...sec5,
          ...sec6,
          ...sec7,
          ...sec8,
          ...sec9,
          ...sec10,
        ],
      },
    ],
  });

  // ─── Write to disk ─────────────────────────────────────────────────
  const outDir = path.join("/home/z/my-project/download/capnotif-docs");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "DeliveryBoost_Frontend_Specification.docx");

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outPath, buffer);
  console.log(`Document generated successfully: ${outPath}`);
  console.log(`File size: ${(buffer.length / 1024).toFixed(1)} KB`);
}

main().catch(err => {
  console.error("Error generating document:", err);
  process.exit(1);
});
