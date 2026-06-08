const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  TableOfContents, SectionType,
} = require("docx");
const fs = require("fs");

// GO-1 palette for PRD/proposal
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
  return new Paragraph({ heading: level, spacing: { before: level === HeadingLevel.HEADING_1 ? 360 : 240, after: 120, line: 312 }, children: [new TextRun({ text, bold: true, color: c(P.primary), font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: level === HeadingLevel.HEADING_1 ? 32 : level === HeadingLevel.HEADING_2 ? 28 : 24 })] });
}
function body(text) {
  return new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { line: 312, after: 80 }, children: [new TextRun({ text, size: 24, color: c(P.body), font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })] });
}
function makeTable(headers, rows) {
  const t = P.table;
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: { style: BorderStyle.SINGLE, size: 2, color: c(t.accentLine) }, bottom: { style: BorderStyle.SINGLE, size: 2, color: c(t.accentLine) }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: c(t.innerLine) }, insideVertical: { style: BorderStyle.NONE } },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: headers.map(h => new TableCell({ width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: c(t.headerBg) }, margins: { top: 60, bottom: 60, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 21, color: c(t.headerText), font: { ascii: "Times New Roman", eastAsia: "SimHei" } })] })] })) }),
      ...rows.map((row, idx) => new TableRow({ cantSplit: true, children: row.map(cell => new TableCell({ width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: idx % 2 === 0 ? c(t.surface) : "FFFFFF" }, margins: { top: 60, bottom: 60, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: cell, size: 21, color: c(P.body), font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })] })] })) })),
    ],
  });
}

function buildCover() {
  return [new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: allNoBorders, rows: [new TableRow({ height: { value: 16838, rule: "exact" }, children: [new TableCell({ width: { size: 100, type: WidthType.PERCENTAGE }, shading: { type: ShadingType.CLEAR, fill: "1A2330" }, verticalAlign: "top", children: [
    new Paragraph({ spacing: { before: 4200 } }),
    new Paragraph({ spacing: { before: 200, after: 100, line: 920, lineRule: "atLeast" }, children: [new TextRun({ text: "DeliveryBoost", bold: true, size: 72, color: P.cover.titleColor, font: { ascii: "Times New Roman", eastAsia: "SimHei" } })] }),
    new Paragraph({ spacing: { before: 120, after: 80, line: 460, lineRule: "atLeast" }, indent: { left: 100 }, border: { left: { style: BorderStyle.SINGLE, size: 18, color: "D4875A", space: 12 } }, children: [new TextRun({ text: "    Product Requirement Document", size: 30, color: P.cover.subtitleColor, font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })] }),
    new Paragraph({ spacing: { before: 60 }, indent: { left: 120 }, children: [new TextRun({ text: "Worldwide Launch  |  All Delivery Categories  |  A to Z", size: 22, color: P.cover.metaColor, font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })] }),
    new Paragraph({ spacing: { before: 600 } }),
    ...["Version 2.0  |  Global Release", "Date: June 7, 2026", "Author: Yashas K. Gangatkar", "Status: Draft  |  Confidential"].map(m => new Paragraph({ spacing: { before: 80, line: 312 }, indent: { left: 200 }, children: [new TextRun({ text: m, size: 22, color: P.cover.metaColor, font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })] })),
  ] })] })] })];
}

function buildBody() {
  return [
    heading("1. Executive Summary"),
    body("DeliveryBoost is the world's first universal delivery driver notification aggregator, designed to serve gig economy workers across every continent, every delivery category, and every platform. In today's fragmented gig economy, delivery drivers operate across multiple platforms simultaneously, juggling food delivery apps, grocery shopping services, package delivery networks, pharmacy couriers, and dozens of other specialized delivery verticals. This fragmentation results in missed orders, reduced earnings, cognitive overload, and an unsustainable working experience that hurts the very workers who power the on-demand economy."),
    body("DeliveryBoost solves this by providing a single, intelligent command center that aggregates notifications from every delivery platform worldwide into one unified real-time feed. Whether a driver is delivering pizza in New York via DoorDash, picking up groceries in London via Deliveroo, couriering documents in Tokyo via Uber Eats, hauling packages in Berlin via Amazon Flex, delivering medicine in Mumbai via PharmEasy, or transporting flower arrangements in Sao Paulo via Rappi, DeliveryBoost brings every notification into one consistent, actionable interface with one-tap accept/dismiss, intelligent auto-accept rules, real-time earnings tracking across all platforms and currencies, and multi-language support."),
    body("The product launches with a global free tier covering core aggregation across all supported platforms, and a premium tier at $9.99 USD per month (with regional pricing adjustments) that unlocks auto-accept rules, advanced cross-platform analytics, priority notification delivery, and AI-powered order recommendations. DeliveryBoost targets an addressable market of over 80 million gig delivery workers worldwide, spanning food delivery, grocery shopping, package logistics, pharmacy and health, alcohol and beverage, flower and gift, pet supply, cannabis (where legal), document courier, same-day express, last-mile logistics, and every other delivery vertical that exists on the planet."),

    heading("2. Problem Statement"),
    body("The global gig delivery economy is enormous and growing, with an estimated 80 million active delivery workers across 190 countries and over 500 distinct delivery platforms. However, the fundamental user experience for these workers is broken. Each platform operates in isolation, with its own mobile application, notification system, alert sounds, data formats, and interaction patterns. Drivers who want to maximize their earnings by working across multiple platforms face a fragmented and stressful experience that directly costs them money."),
    body("Consider a typical scenario: a driver in Chicago works across DoorDash, UberEats, Grubhub, Instacart, and Amazon Flex simultaneously. They keep five apps open on two phones, each pinging with different sounds at different volumes. During a dinner rush, a $25 DoorDash order arrives while the driver is reading an UberEats delivery detail, and by the time they switch apps, the order is gone. This single missed order could have been the highest-paying delivery of the evening. Multiply this scenario across millions of drivers working billions of hours, and the aggregate earnings loss is staggering."),
    body("The problem is even more acute for drivers in international markets. A driver in London might juggle Deliveroo, Just Eat, Uber Eats, and Stuart. A driver in Mumbai manages Zomato, Swiggy, and Dunzo. A driver in Sao Paulo balances Rappi, iFood, and 99Food. Each market has its own platform ecosystem, and no cross-platform solution exists to unify the experience. Furthermore, the problem extends far beyond food delivery. Drivers who also deliver groceries, packages, pharmacy orders, and other goods face even greater fragmentation because these verticals use entirely different applications with different workflows."),
    body("The core problems are: missed high-value orders due to notification overload, with research suggesting 15-25% of orders are missed during peak hours; cognitive fatigue from constantly switching between applications with different interfaces; inability to set consistent acceptance criteria across platforms; no unified view of earnings across platforms and currencies; and language barriers for immigrant drivers working in markets where platform apps are not available in their preferred language."),

    heading("3. Product Vision & Goals"),
    heading("3.1 Vision Statement", HeadingLevel.HEADING_2),
    body("To become the indispensable global command center for every delivery driver on Earth, transforming a fragmented, stressful, multi-platform experience into a single, intelligent, and empowering workflow that maximizes earnings and minimizes friction across all delivery categories and all geographies."),

    heading("3.2 Strategic Goals", HeadingLevel.HEADING_2),
    makeTable(
      ["Goal", "Description", "Success Metric"],
      [
        ["Universal Aggregation", "Support every delivery platform in every market, from food to packages to pharmacy to courier and beyond", "50+ platforms at global launch, 200+ within 12 months"],
        ["All Delivery Categories", "Cover every vertical: food, grocery, pharmacy, packages, alcohol, flowers, pets, cannabis, documents, express, last-mile, and more", "12+ delivery categories supported at launch"],
        ["Earnings Maximization", "Help drivers earn more through intelligent filtering, auto-accept, and cross-platform optimization", "Users report 20%+ earnings increase globally"],
        ["Global Accessibility", "Multi-language, multi-currency, culturally adaptive interface that works everywhere", "20+ languages at launch, 50+ within 12 months"],
        ["Zero Missed Orders", "Ensure every order notification reaches the driver within 2 seconds, regardless of platform or location", "99.9% notification delivery rate globally"],
      ]
    ),

    heading("4. Delivery Categories (A to Z)"),
    body("DeliveryBoost is designed to aggregate notifications from every type of delivery service that exists globally. The following table catalogs all delivery categories from A to Z, with examples of platforms in each category and the regions where they operate. This comprehensive taxonomy ensures that no delivery vertical is overlooked in the product design."),

    makeTable(
      ["Category", "Description", "Example Platforms", "Key Regions"],
      [
        ["Alcohol & Beverage", "Delivery of beer, wine, spirits, and non-alcoholic beverages to customers of legal drinking age", "Drizly, Minibar, Saucey, Flaviar, Vivino, Total Wine Delivery", "North America, Europe, Australia"],
        ["Bike Courier", "On-demand bicycle messenger services for documents, small parcels, and urgent deliveries within urban areas", "Stuart, Gophr, Cycle.Land, Bicycle Courier Melbourne, BikeNYC", "Europe, North America, Australia"],
        ["Cannabis (Legal Markets)", "Delivery of cannabis products in jurisdictions where recreational or medical cannabis is legal", "Eaze, Weedmaps, Dutchie, Leafly, Emjay, Caliva", "US (select states), Canada, Uruguay, Thailand"],
        ["Document & Legal Courier", "Specialized courier services for legal documents, contracts, court filings, and time-sensitive paperwork", "LegalZoom Courier, ABC Legal, One Legal, Lextranet, Process Server", "North America, Europe"],
        ["Express & Same-Day", "Rapid delivery services offering same-day or sub-2-hour delivery for parcels and goods", "Postmates, DHL Express, FedEx SameDay, UPS Express Critical, Stuart", "Global"],
        ["Flower & Gift", "Delivery of floral arrangements, gift baskets, and special occasion items", "1-800-Flowers, FTD, Interflora, Bloom & Wild, FloraQueen, Ferns N Petals", "Global"],
        ["Food Delivery", "Restaurant meal delivery, the largest and most prevalent delivery category worldwide", "DoorDash, UberEats, Grubhub, Deliveroo, Just Eat, Zomato, Swiggy, Rappi, iFood, Meituan, Ele.me, Foodpanda, Wolt, Glovo, Talabat", "Global"],
        ["Grocery & Shopping", "Delivery of groceries, household essentials, and consumer goods from stores to customers", "Instacart, Amazon Fresh, Walmart Grocery, Shipt, Cornershop, BigBasket, Grofers, Tesco Delivery, Ocado", "Global"],
        ["Health & Pharmacy", "Delivery of prescription medications, over-the-counter drugs, and health products", "PharmEasy, Netmeds, 1mg, Capsule, NimbleRx, NowRx, Lloyds Direct, Echo", "Asia, North America, Europe"],
        ["International Shipping", "Cross-border delivery and freight forwarding for packages and goods", "MyUS, Shipito, Stackry, Borderlinx, Viabox, ShopandShip", "Global"],
        ["Last-Mile Logistics", "Final-mile delivery services connecting warehouses and fulfillment centers to end customers", "Amazon Flex, Ontrac, LaserShip, AxleHire, Veho, Dropoff", "North America, Europe"],
        ["Meal Kit & Prepared", "Delivery of pre-portioned meal kit ingredients or fully prepared meal plans", "HelloFresh, Blue Apron, Home Chef, Freshly, EveryPlate, Gousto, Mindful Chef", "North America, Europe, Australia"],
        ["Moving & Hauling", "On-demand moving assistance and large item transportation services", "Dolly, Bellhops, Lugg, GetMovers, TaskRabbit (moving), Muval", "North America, Australia"],
        ["Package & Parcel", "General package delivery services including residential and commercial parcel delivery", "Amazon Flex, FedEx, UPS, DHL, USPS Gig, DX Delivery, Evri, Yodel, Australia Post Gig", "Global"],
        ["Pet Supply", "Delivery of pet food, medications, toys, and accessories for domestic animals", "Chewy, Petco, PetSmart, Zooplus, Pets at Home, Fetch, Wag!", "North America, Europe"],
        ["Quick Commerce (Q-Commerce)", "Ultra-fast delivery of convenience items within 10-30 minutes from dark stores", "Gopuff, Getir, Gorillas, Jokr, Flink, Delivery Hero, Blinkit, Zepto", "North America, Europe, Asia"],
        ["Return & Reverse Logistics", "Pickup services for product returns, exchanges, and reverse shipping", "Happy Returns, Returnly, Loop, Narvar, Optoro", "North America, Europe"],
        ["Specialty & Niche", "Delivery of specialized items including electronics, fashion, books, auto parts, and more", "Best Buy Delivery, ASOS, Zalando, Napa Auto Parts, O'Reilly Delivery", "Global"],
        ["Tobacco & Vape (Legal)", "Delivery of tobacco products and vaping supplies in jurisdictions where legal", "GoPuff (tobacco), Saucey, Drizly (tobacco), 1-800-Flowers (gifts)", "North America (select regions)"],
        ["Volunteer & Community", "Community-based volunteer delivery networks for food banks, mutual aid, and disaster relief", "Food Rescue US, Feeding America, Mutual Aid Delivery, Community Fridges", "Global"],
      ]
    ),

    heading("5. Global Platform Coverage"),
    heading("5.1 North America", HeadingLevel.HEADING_2),
    makeTable(
      ["Platform", "Category", "Integration Priority", "API Status"],
      [
        ["DoorDash", "Food Delivery", "P0", "Partner API available"],
        ["UberEats", "Food Delivery", "P0", "OAuth + REST API"],
        ["Grubhub", "Food Delivery", "P0", "OAuth + REST API"],
        ["Instacart", "Grocery & Shopping", "P0", "Partner API available"],
        ["Amazon Flex", "Package & Parcel / Last-Mile", "P0", "OAuth + REST API"],
        ["Postmates", "Food Delivery / Express", "P1", "UberEats API (subsidiary)"],
        ["Shipt", "Grocery & Shopping", "P1", "OAuth + REST API"],
        ["Walmart Spark", "Grocery & Shopping / Package", "P1", "Partner API available"],
        ["Gopuff", "Quick Commerce", "P1", "OAuth + REST API"],
        ["Drizly", "Alcohol & Beverage", "P2", "Partner API available"],
        ["Chewy", "Pet Supply", "P2", "Affiliate API"],
        ["FedEx Gig", "Package & Parcel", "P2", "OAuth + REST API"],
        ["1-800-Flowers", "Flower & Gift", "P2", "Partner API available"],
        ["Eaze", "Cannabis (Legal)", "P2", "OAuth + REST API"],
        ["Dolly", "Moving & Hauling", "P2", "OAuth + REST API"],
      ]
    ),

    heading("5.2 Europe", HeadingLevel.HEADING_2),
    makeTable(
      ["Platform", "Category", "Integration Priority", "API Status"],
      [
        ["Deliveroo", "Food Delivery", "P0", "OAuth + REST API"],
        ["Just Eat", "Food Delivery", "P0", "OAuth + REST API"],
        ["Wolt", "Food Delivery / Quick Commerce", "P0", "OAuth + REST API"],
        ["Glovo", "Food Delivery / Multi-category", "P1", "OAuth + REST API"],
        ["Stuart", "Bike Courier / Express", "P1", "OAuth + REST API"],
        ["Getir", "Quick Commerce", "P1", "OAuth + REST API"],
        ["Foodpanda", "Food Delivery", "P1", "OAuth + REST API"],
        ["Ocado", "Grocery & Shopping", "P2", "Partner API available"],
        ["Tesco Delivery", "Grocery & Shopping", "P2", "Partner API available"],
        ["HelloFresh", "Meal Kit & Prepared", "P2", "Partner API available"],
      ]
    ),

    heading("5.3 Asia-Pacific", HeadingLevel.HEADING_2),
    makeTable(
      ["Platform", "Category", "Integration Priority", "API Status"],
      [
        ["Meituan", "Food Delivery / Multi-category", "P0", "OAuth + REST API"],
        ["Ele.me (Hungry?", "Food Delivery", "P0", "OAuth + REST API"],
        ["Zomato", "Food Delivery", "P0", "OAuth + REST API"],
        ["Swiggy", "Food Delivery", "P0", "OAuth + REST API"],
        ["Foodpanda (APAC)", "Food Delivery", "P1", "OAuth + REST API"],
        ["GrabFood", "Food Delivery / Multi-category", "P1", "OAuth + REST API"],
        ["gofood (Gojek)", "Food Delivery / Multi-category", "P1", "OAuth + REST API"],
        ["BigBasket", "Grocery & Shopping", "P1", "OAuth + REST API"],
        ["Blinkit", "Quick Commerce", "P1", "OAuth + REST API"],
        ["PharmEasy", "Health & Pharmacy", "P2", "OAuth + REST API"],
        ["Dunzo", "Express / Multi-category", "P2", "OAuth + REST API"],
        ["Zepto", "Quick Commerce", "P2", "OAuth + REST API"],
      ]
    ),

    heading("5.4 Latin America", HeadingLevel.HEADING_2),
    makeTable(
      ["Platform", "Category", "Integration Priority", "API Status"],
      [
        ["Rappi", "Food Delivery / Multi-category", "P0", "OAuth + REST API"],
        ["iFood", "Food Delivery", "P0", "OAuth + REST API"],
        ["99Food", "Food Delivery", "P1", "OAuth + REST API"],
        ["Cornershop", "Grocery & Shopping", "P1", "OAuth + REST API"],
        ["Mercado Envios", "Package & Parcel", "P2", "Partner API available"],
        ["SinDelantal", "Food Delivery", "P2", "OAuth + REST API"],
      ]
    ),

    heading("5.5 Middle East & Africa", HeadingLevel.HEADING_2),
    makeTable(
      ["Platform", "Category", "Integration Priority", "API Status"],
      [
        ["Talabat", "Food Delivery", "P0", "OAuth + REST API"],
        ["Careem Food", "Food Delivery / Multi-category", "P1", "OAuth + REST API"],
        ["Noon Food", "Food Delivery", "P1", "OAuth + REST API"],
        ["Jumia Food", "Food Delivery / Multi-category", "P1", "OAuth + REST API"],
        ["Glovo (MEA)", "Food Delivery / Multi-category", "P2", "OAuth + REST API"],
      ]
    ),

    heading("6. Target Users & Personas"),
    heading("6.1 Primary Persona: The Full-Time Multi-Platform Driver", HeadingLevel.HEADING_2),
    body("Name: Marcus, 32, full-time gig driver in Chicago, USA. Marcus works 45-55 hours per week across DoorDash, UberEats, Grubhub, Instacart, and Amazon Flex. He delivers food, groceries, and packages interchangeably based on which platform is busiest at any given time. Marcus uses two phones to keep all apps visible simultaneously, but still misses 4-5 high-value orders per shift due to notification overload. He wants a single dashboard that shows every incoming opportunity with smart filtering so he can focus on the most profitable orders without the stress of monitoring five apps at once."),

    heading("6.2 Secondary Persona: The International Multi-Vertical Driver", HeadingLevel.HEADING_2),
    body("Name: Priya, 28, part-time driver in Mumbai, India. Priya works 25-30 hours per week across Zomato, Swiggy, Dunzo, and PharmEasy, delivering food, groceries, quick-commerce items, and pharmacy orders. She switches between food delivery during lunch and dinner rushes and pharmacy orders during quieter afternoon hours. Priya needs multi-language support (Hindi and English), INR currency display, and auto-accept rules that adjust automatically when she switches between delivery categories with different payout structures."),

    heading("6.3 Tertiary Persona: The European Bike Courier", HeadingLevel.HEADING_2),
    body("Name: Lukas, 24, bike courier in Berlin, Germany. Lukas delivers for Deliveroo, Wolt, Stuart, and Foodpanda using his bicycle. He values speed and simplicity, needing a lightweight mobile interface that works well on a handlebar-mounted phone. Lukas requires EUR currency, German and English language support, and auto-accept rules tuned for bike delivery (shorter distance limits, lower minimum payouts than car drivers)."),

    heading("7. Feature Requirements"),
    heading("7.1 Core Features (Free Tier - Global)", HeadingLevel.HEADING_2),
    makeTable(
      ["Feature ID", "Feature", "Description", "Priority"],
      [
        ["F-001", "Universal Notification Feed", "Real-time aggregated feed of all incoming delivery orders from all connected platforms across all categories, displayed in a consistent card-based layout with platform and category color coding", "P0"],
        ["F-002", "Platform Connections", "Toggle-based connection management for every supported delivery platform globally, with OAuth 2.0 authentication and visual status indicators per platform", "P0"],
        ["F-003", "One-Tap Accept/Dismiss", "Single-click order acceptance or dismissal from any platform in any category, with immediate visual feedback and platform API integration", "P0"],
        ["F-004", "Category-Colored Order Cards", "Order cards color-coded by delivery category (food, grocery, package, pharmacy, etc.) with distinct icons and visual indicators for instant recognition", "P0"],
        ["F-005", "Multi-Currency Earnings Dashboard", "Weekly and session earnings tracker with automatic currency conversion, supporting USD, EUR, GBP, INR, BRL, AED, JPY, CNY, and 50+ additional currencies", "P0"],
        ["F-006", "Multi-Language Interface", "Full application interface available in 20+ languages including English, Spanish, Portuguese, French, German, Hindi, Mandarin, Arabic, Japanese, Korean, and more", "P0"],
        ["F-007", "Auto-Refresh Feed", "Dashboard automatically refreshes every 4 seconds to ensure real-time order visibility without manual page reloads", "P0"],
        ["F-008", "Dark Mode", "System-aware dark mode with manual toggle, defaulting to dark theme for optimal visibility during night driving", "P1"],
        ["F-009", "Cross-Platform Order Deduplication", "Intelligent deduplication when the same restaurant or store appears on multiple platforms, showing the highest-paying option first", "P1"],
        ["F-010", "Category Switcher", "Quick filter to show only orders from specific delivery categories (food only, grocery only, packages only, etc.) or all categories simultaneously", "P1"],
      ]
    ),

    heading("7.2 Premium Features ($9.99/month with regional pricing)", HeadingLevel.HEADING_2),
    makeTable(
      ["Feature ID", "Feature", "Description", "Priority"],
      [
        ["F-011", "Auto-Accept Rules Engine", "Configurable rules for automatic order acceptance based on minimum payout, maximum distance, minimum rating, delivery category, and time-of-day profiles", "P0"],
        ["F-012", "Category-Specific Rules", "Different auto-accept thresholds per delivery category (e.g., $8 minimum for food, $15 for packages, $5 for pharmacy)", "P0"],
        ["F-013", "Time-Based Rule Profiles", "Save and auto-switch between different auto-accept profiles based on time of day (lunch rush, dinner rush, late night)", "P1"],
        ["F-014", "Advanced Global Analytics", "Cross-platform, cross-category earnings analytics with historical comparison, peak hour analysis, category breakdowns, and regional comparisons", "P1"],
        ["F-015", "AI Order Recommendations", "Machine learning model that predicts order value, tip probability, and completion time to recommend the best orders to accept", "P1"],
        ["F-016", "Priority Notifications", "Faster notification delivery with reduced latency compared to free tier, ensuring premium users see orders first", "P2"],
        ["F-017", "Route Optimization", "Suggest optimal delivery routes when handling multiple active orders across different platforms", "P2"],
        ["F-018", "Earnings Forecasting", "AI-powered earnings projections based on historical data, current demand patterns, and local event schedules", "P2"],
        ["F-019", "Unlimited Platform Connections", "No limit on number of platforms that can be connected simultaneously (free tier limited to 5)", "P1"],
        ["F-020", "Cross-Currency Arbitrage Alerts", "Notify drivers operating near currency borders or in tourist zones about orders with higher effective payouts due to currency conversion advantages", "P2"],
      ]
    ),

    heading("8. Regional Pricing Strategy"),
    makeTable(
      ["Region", "Monthly Price (Local)", "Monthly Price (USD equiv.)", "Rationale"],
      [
        ["United States", "$9.99 USD", "$9.99", "Reference market; competitive with single platform premium tiers"],
        ["Canada", "$12.99 CAD", "$9.60", "CAD-adjusted pricing; slightly below US to drive adoption"],
        ["United Kingdom", "GBP 7.99", "$10.10", "Aligned with UK delivery subscription pricing norms"],
        ["European Union", "EUR 8.99", "$9.80", "Averaged across Eurozone; country-specific adjustments possible"],
        ["India", "INR 299", "$3.60", "Purchasing power parity adjustment; competitive with local app subscriptions"],
        ["Brazil", "BRL 29.90", "$5.90", "Emerging market pricing; aligned with local streaming subscriptions"],
        ["UAE", "AED 29.99", "$8.17", "Premium market pricing reflecting local cost of living"],
        ["China", "CNY 49", "$6.80", "Competitive with local super-app subscription tiers"],
        ["Japan", "JPY 1,280", "$8.50", "Aligned with Japanese subscription service pricing norms"],
        ["Southeast Asia", "USD 3.99", "$3.99", "Regional pricing for Indonesia, Philippines, Vietnam, Thailand"],
      ]
    ),

    heading("9. Non-Functional Requirements"),
    makeTable(
      ["Category", "Requirement", "Target"],
      [
        ["Performance", "Order notification latency", "< 2 seconds globally (edge-cached)"],
        ["Performance", "Dashboard auto-refresh interval", "4 seconds"],
        ["Performance", "Initial page load time", "< 3 seconds on 4G globally"],
        ["Reliability", "Uptime target", "99.9% monthly (global edge network)"],
        ["Reliability", "Notification delivery rate", "99.95% of orders displayed within target latency"],
        ["Security", "Platform credential storage", "AES-256 encryption at rest"],
        ["Security", "API communication", "TLS 1.3 for all API calls"],
        ["Security", "Authentication", "OAuth 2.0 with PKCE for platform connections"],
        ["Compliance", "GDPR (Europe)", "Full compliance with data processing requirements"],
        ["Compliance", "CCPA (California)", "Right to know, delete, and opt-out"],
        ["Compliance", "India DPDP Act", "Data protection compliance for Indian users"],
        ["Compliance", "LGPD (Brazil)", "Data protection compliance for Brazilian users"],
        ["Compliance", "PDPA (Southeast Asia)", "Data protection for Singapore, Thailand, Philippines"],
        ["Usability", "Time to accept an order", "< 3 seconds from notification display"],
        ["Usability", "Mobile responsiveness", "Full functionality on screens >= 320px width"],
        ["Accessibility", "WCAG compliance", "WCAG 2.1 Level AA across all languages"],
        ["Localization", "Language support", "20+ languages at launch, 50+ within 12 months"],
        ["Localization", "Currency support", "60+ currencies with real-time exchange rates"],
        ["Localization", "Time zone handling", "Automatic detection and per-session display"],
      ]
    ),

    heading("10. Global Release Roadmap"),
    makeTable(
      ["Phase", "Timeline", "Markets", "Platforms", "Features"],
      [
        ["Phase 1: US/UK Launch", "Q3 2026", "USA, UK, Canada", "15 platforms", "Core feed, accept/dismiss, earnings, auto-accept, 5 languages"],
        ["Phase 2: Europe Expansion", "Q4 2026", "EU, Australia, Japan", "25 additional platforms", "Category-specific rules, multi-currency analytics, 10 more languages"],
        ["Phase 3: Asia-Pacific", "Q1 2027", "India, China, SE Asia", "20 additional platforms", "AI recommendations, route optimization, 10 more languages"],
        ["Phase 4: Latin America", "Q2 2027", "Brazil, Mexico, Colombia", "10 additional platforms", "Regional analytics, cross-currency alerts, 5 more languages"],
        ["Phase 5: Middle East & Africa", "Q3 2027", "UAE, Saudi Arabia, Africa", "10 additional platforms", "Arabic RTL support, regional compliance, 5 more languages"],
        ["Phase 6: Full Global", "Q4 2027", "190 countries", "200+ platforms", "All categories, all platforms, 50+ languages, native mobile apps"],
      ]
    ),

    heading("11. Success Metrics & KPIs"),
    makeTable(
      ["Metric", "Target (12 months)", "Measurement Method"],
      [
        ["Monthly Active Users (Global)", "500,000 MAU", "Analytics dashboard"],
        ["Geographic Distribution", "Users in 50+ countries", "GeoIP analytics"],
        ["Free-to-Premium Conversion", "8-12% globally", "Subscription analytics"],
        ["Average Session Duration", "60+ minutes", "Session tracking"],
        ["Cross-Platform Connections", "Average 3+ platforms per user", "Connection analytics"],
        ["Cross-Category Engagement", "30%+ users active in 2+ categories", "Category event tracking"],
        ["Order Acceptance Rate", "70%+ of displayed orders", "In-app event tracking"],
        ["User Retention (30-day)", "55%+", "Cohort analysis"],
        ["Net Promoter Score", "55+", "In-app survey (localized)"],
        ["Average Earnings Increase", "20%+ self-reported", "Quarterly user survey"],
      ]
    ),

    heading("12. Risks & Mitigations"),
    makeTable(
      ["Risk", "Impact", "Probability", "Mitigation"],
      [
        ["Platform API changes or restrictions", "High", "Medium", "Maintain abstraction layer; monitor API changelogs; build fallback scraping; diversify across 200+ platforms"],
        ["Regulatory barriers in specific countries", "High", "Medium", "Engage local legal counsel; comply with regional data protection laws; position as notification tool not automation"],
        ["Low conversion in price-sensitive markets", "Medium", "High", "PPP-adjusted regional pricing; freemium value demonstration; annual discount; free trial periods"],
        ["Cannabis/tobacco/alcohol regulatory exposure", "Medium", "Low", "Strict age-gating; jurisdiction-specific availability toggles; legal review per market"],
        ["Security breach of platform credentials", "Critical", "Low", "SOC 2 Type II; AES-256 encryption; minimal credential storage; regular penetration testing"],
        ["Platform legal challenges (ToS violations)", "High", "Medium", "Legal review per platform; API-first approach; position as user-authorized notification aggregator"],
        ["Cultural UX mismatches in international markets", "Medium", "Medium", "Local UX research; beta testing with local drivers; culturally adaptive design system"],
        ["Currency volatility affecting pricing", "Low", "Medium", "Quarterly price reviews; local currency pricing; automated exchange rate adjustments"],
      ]
    ),
  ];
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" }, size: 24, color: c(P.body) }, paragraph: { spacing: { line: 312 } } },
      heading1: { run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 32, bold: true, color: c(P.primary) }, paragraph: { spacing: { before: 360, after: 160, line: 312 } } },
      heading2: { run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 28, bold: true, color: c(P.primary) }, paragraph: { spacing: { before: 240, after: 120, line: 312 } } },
      heading3: { run: { font: { ascii: "Times New Roman", eastAsia: "SimHei" }, size: 24, bold: true, color: c(P.primary) }, paragraph: { spacing: { before: 200, after: 100, line: 312 } } },
    },
  },
  sections: [
    { properties: { page: { size: pgSize, margin: { top: 0, bottom: 0, left: 0, right: 0 } } }, children: buildCover() },
    { properties: { type: SectionType.NEXT_PAGE, page: { size: pgSize, margin: pgMargin, pageNumbers: { start: 1, formatType: NumberFormat.UPPER_ROMAN } } },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080" })] })] }) },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 480, after: 360 }, children: [new TextRun({ text: "Table of Contents", bold: true, size: 32, font: { ascii: "Times New Roman", eastAsia: "SimHei" } })] }),
        new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
        new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "Note: This Table of Contents is generated via field codes. To ensure page number accuracy after editing, please right-click the TOC and select \"Update Field.\"", italics: true, size: 18, color: "888888" })] }),
        new Paragraph({ children: [new PageBreak()] }),
      ],
    },
    { properties: { type: SectionType.NEXT_PAGE, page: { size: pgSize, margin: pgMargin, pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } } },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "DeliveryBoost PRD v2.0  |  Global Launch", size: 18, color: "808080", font: { ascii: "Times New Roman" } })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080" })] })] }) },
      children: buildBody(),
    },
  ],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/home/z/my-project/download/capnotif-docs/DeliveryBoost_PRD.docx", buf);
  console.log("DeliveryBoost PRD v2.0 generated successfully");
});
