const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, PageBreak, HeadingLevel, BorderStyle,
  Header, Footer, PageNumber, NumberFormat, SectionType,
  ShadingType, TableLayoutType, VerticalAlign,
  ExternalHyperlink, HeightRule, TableOfContents
} = require("docx");
const fs = require("fs");
const path = require("path");

// ─── Palette ──────────────────────────────────────────────
const COLORS = {
  primary:    "2A4A3A",
  body:       "000000",
  accent:     "C89F62",
  surface:    "F0EDE5",
  coverBg:    "0C1F1A",
  white:      "FFFFFF",
  tableHead:  "2A4A3A",
  lightGray:  "F5F5F0",
  midGray:    "999999",
};

// ─── Helper: Heading ──────────────────────────────────────
function heading(text, level = 1) {
  const sz = level === 1 ? 32 : 28;       // 16pt / 14pt
  const spacing = level === 1
    ? { before: 400, after: 200 }
    : { before: 300, after: 150 };
  return new Paragraph({
    heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
    spacing,
    children: [
      new TextRun({
        text,
        bold: true,
        size: sz,
        font: "Times New Roman",
        color: COLORS.primary,
      }),
    ],
  });
}

// ─── Helper: Body paragraph ───────────────────────────────
function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 160, line: 312 },
    alignment: AlignmentType.JUSTIFIED,
    children: [
      new TextRun({
        text,
        size: 24,                // 12pt
        font: "Times New Roman",
        color: opts.color || COLORS.body,
        bold: opts.bold || false,
        italics: opts.italics || false,
      }),
    ],
  });
}

// ─── Helper: Table builder ────────────────────────────────
function makeTable(headers, rows, colWidths) {
  const totalW = colWidths ? colWidths.reduce((a, b) => a + b, 0) : 9000;
  const widths = colWidths || headers.map(() => Math.floor(totalW / headers.length));

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) =>
      new TableCell({
        width: { size: widths[i], type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: COLORS.tableHead },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [new TextRun({ text: h, bold: true, size: 20, font: "Times New Roman", color: COLORS.white })],
          }),
        ],
      })
    ),
  });

  const dataRows = rows.map((row, ri) =>
    new TableRow({
      children: row.map((cell, ci) =>
        new TableCell({
          width: { size: widths[ci], type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: ri % 2 === 0 ? COLORS.lightGray : COLORS.white },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              spacing: { before: 30, after: 30 },
              alignment: ci === 0 ? AlignmentType.LEFT : AlignmentType.LEFT,
              children: [new TextRun({ text: String(cell), size: 20, font: "Times New Roman", color: COLORS.body })],
            }),
          ],
        })
      ),
    })
  );

  return new Table({
    width: { size: totalW, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    rows: [headerRow, ...dataRows],
  });
}

// ─── Helper: Accent separator line ────────────────────────
function accentLine() {
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.accent } },
    children: [],
  });
}

// ─── Helper: Empty paragraph spacer ───────────────────────
function spacer(pts = 200) {
  return new Paragraph({ spacing: { before: pts }, children: [] });
}

// ─── Build Document ───────────────────────────────────────
async function main() {
  const outPath = "/home/z/my-project/download/capnotif-docs/DeliveryBoost_Security_Access.docx";

  // ── Section 1: Cover Page ───────────────────────────────
  const coverSection = {
    properties: {
      page: {
        margin: { top: 0, bottom: 0, left: 0, right: 0 },
        size: { width: 12240, height: 15840 },
      },
    },
    children: [
      // Dark background via full-width table
      new Table({
        width: { size: 12240, type: WidthType.DXA },
        layout: TableLayoutType.FIXED,
        rows: [
          new TableRow({
            height: { value: 15840, rule: HeightRule.EXACT },
            children: [
              new TableCell({
                width: { size: 12240, type: WidthType.DXA },
                shading: { type: ShadingType.CLEAR, fill: COLORS.coverBg },
                verticalAlign: VerticalAlign.CENTER,
                children: [
                  spacer(2400),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 120 },
                    children: [
                      new TextRun({ text: "DeliveryBoost", bold: true, size: 144, font: "Times New Roman", color: COLORS.white }),
                    ],
                  }),
                  // Subtitle with gold left border
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 200, after: 80 },
                    indent: { left: 2400 },
                    border: { left: { style: BorderStyle.SINGLE, size: 18, color: COLORS.accent, space: 10 } },
                    children: [
                      new TextRun({ text: "Security & Access Document", size: 56, font: "Times New Roman", color: COLORS.accent }),
                    ],
                  }),
                  spacer(600),
                  // Meta lines
                  ...[
                    "Version 2.0 | Global Compliance",
                    "Date: June 7, 2026",
                    "Author: Yashas K. Gangatkar",
                    "Classification: Confidential",
                  ].map((line, idx) =>
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 80 },
                      children: [
                        new TextRun({
                          text: line,
                          size: 22,
                          font: "Times New Roman",
                          color: idx === 3 ? COLORS.accent : COLORS.white,
                          bold: idx === 3,
                        }),
                      ],
                    })
                  ),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  };

  // ── Section 2: Table of Contents ────────────────────────
  const tocSection = {
    properties: {
      page: {
        margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
      },
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ children: [PageNumber.CURRENT], size: 20, font: "Times New Roman", color: COLORS.midGray }),
            ],
          }),
        ],
      }),
    },
    children: [
      heading("Table of Contents", 1),
      accentLine(),
      spacer(100),
      new TableOfContents("Table of Contents", {
        hyperlink: true,
        headingStyleRange: "1-2",
      }),
    ],
  };

  // ── Section 3: Body (Arabic page numbers + header) ──────
  const bodyHeader = new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.accent } },
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: "DeliveryBoost Security & Access v2.0 | Global Compliance",
            size: 16,
            font: "Times New Roman",
            color: COLORS.accent,
            italics: true,
          }),
        ],
      }),
    ],
  });

  const bodyFooter = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ size: 20, font: "Times New Roman", color: COLORS.midGray, children: [PageNumber.CURRENT] }),
        ],
      }),
    ],
  });

  const bodyChildren = [];

  // ── 1. Security Overview ────────────────────────────────
  bodyChildren.push(heading("1. Security Overview", 1), accentLine());
  bodyChildren.push(body(
    "DeliveryBoost operates as the world's largest delivery notification aggregator, connecting users to over 200 delivery platforms across 190 countries. This expansive reach demands a defense-in-depth security posture that assumes no boundary is impenetrable and no single control is sufficient. Our architecture layers network security, application security, identity controls, and data protection to create overlapping safeguards that mitigate risk at every tier of the stack."
  ));
  bodyChildren.push(body(
    "A zero-trust architecture underpins every interaction within the DeliveryBoost platform. Every request—whether originating from a user device, an external delivery platform API, or an internal microservice—must be authenticated, authorized, and encrypted before any resource is granted. Network segmentation ensures that even if one component is compromised, lateral movement is constrained by micro-perimeters and strict access policies enforced at the identity layer."
  ));
  bodyChildren.push(body(
    "Security monitoring operates around the clock through a centralized Security Information and Event Management (SIEM) system that ingests telemetry from all regions. Anomaly detection models trained on baseline traffic patterns flag deviations in real time, triggering automated playbooks that isolate suspicious workloads within seconds. Regular red-team exercises and third-party audits validate the efficacy of these controls, ensuring that our security posture evolves alongside the threat landscape."
  ));

  // ── 2. Authentication & Authorization ───────────────────
  bodyChildren.push(heading("2. Authentication & Authorization", 1), accentLine());
  bodyChildren.push(heading("2.1 Authentication Architecture", 2));
  bodyChildren.push(body(
    "DeliveryBoost authenticates end users through NextAuth.js, which provides a flexible authentication layer supporting credential-based login, social OAuth providers, and enterprise SAML federation. All authentication flows enforce OAuth 2.0 with Proof Key for Code Exchange (PKCE) to prevent authorization code interception attacks. Session tokens are stored as HttpOnly, Secure, SameSite=Strict cookies and rotate on every request to limit the window of exposure from token theft."
  ));
  bodyChildren.push(body(
    "Connections to the 200+ external delivery platforms each require platform-specific API credentials, which are provisioned through a dedicated credential vault and never exposed to the client. OAuth 2.0 client credentials flows are used for server-to-server integrations, while user-authorized flows leverage the PKCE-enhanced authorization code grant. A unified credential lifecycle manager rotates API keys on configurable schedules and revokes compromised credentials immediately upon detection."
  ));

  bodyChildren.push(heading("2.2 Role-Based Access Control", 2));
  bodyChildren.push(body(
    "Access within DeliveryBoost is governed by a role-based access control (RBAC) model with four defined roles. Each role carries a precise set of permissions that follow the principle of least privilege, ensuring users can only perform actions necessary for their function. Role assignments are managed centrally and audited quarterly to detect privilege creep or orphaned accounts."
  ));

  // RBAC Table
  bodyChildren.push(makeTable(
    ["Role", "Description", "Key Permissions", "Scope"],
    [
      ["Free User", "Standard consumer account", "View notifications, manage delivery tracking, export own data", "Own data only"],
      ["Premium User", "Paid subscriber with advanced features", "All Free User permissions + priority notifications, multi-platform dashboards, advanced filters", "Own data only"],
      ["Admin", "Platform administrator", "User management, platform configuration, compliance reporting, incident escalation", "Tenant-wide"],
      ["Service Account", "Machine-to-machine identity", "API read/write scoped to service function, no UI access, automated key rotation", "Designated service scope"],
    ],
    [1800, 2400, 3000, 1800]
  ));
  bodyChildren.push(spacer(100));

  bodyChildren.push(heading("2.3 Per-Region Authentication Policies", 2));
  bodyChildren.push(body(
    "Recognizing that regulatory requirements differ across jurisdictions, DeliveryBoost enforces region-specific authentication policies. In the European Economic Area, multi-factor authentication is mandatory for all accounts and re-authentication is required every 12 hours. In India, compliance with the DPDP Act mandates OTP-based verification for consumer accounts. Brazilian users must complete two-factor authentication consistent with LGPD data-access provisions, while UAE-based accounts adhere to PDPL-mandated identity verification standards including potential integration with UAE Pass for government-verified identity."
  ));

  // ── 3. Data Protection ──────────────────────────────────
  bodyChildren.push(heading("3. Data Protection", 1), accentLine());
  bodyChildren.push(heading("3.1 Encryption Standards", 2));
  bodyChildren.push(body(
    "All data at rest is encrypted using AES-256-GCM, which provides both confidentiality and integrity verification for every encrypted record. Encryption keys are managed through a dedicated key management service that supports automatic key rotation on a 90-day cycle, with immediate rotation capability in the event of a suspected compromise. Each data shard in our distributed storage layer uses a unique data encryption key (DEK), which is itself encrypted by a master key encryption key (KEK) stored in a hardware security module (HSM)."
  ));
  bodyChildren.push(body(
    "Data in transit is protected by TLS 1.3 with forward secrecy, ensuring that intercepted traffic cannot be decrypted even if long-term keys are later compromised. Certificate pinning is enforced for mobile API clients, and all internal service-to-service communication traverses mutual TLS (mTLS) channels. Legacy TLS versions (1.0, 1.1, 1.2) are disabled across the entire infrastructure to prevent downgrade attacks."
  ));

  bodyChildren.push(heading("3.2 Data Classification", 2));
  bodyChildren.push(body(
    "Every data element processed by DeliveryBoost is classified according to a four-tier scheme that determines handling, storage, and access requirements. This classification is enforced at the application layer and verified through automated data-loss prevention (DLP) scans that run continuously against production data stores."
  ));
  bodyChildren.push(makeTable(
    ["Classification", "Examples", "Encryption", "Access Level", "Retention"],
    [
      ["Critical", "API keys, encryption keys, HSM credentials", "AES-256-GCM + HSM", "Service accounts only", "Rotate every 90 days"],
      ["Sensitive", "PII (name, address, phone), payment tokens", "AES-256-GCM", "Authorized roles + MFA", "Per regulation (max 7 yr)"],
      ["Internal", "Delivery metadata, platform health metrics, logs", "AES-256-GCM", "Authenticated users", "2 years standard"],
      ["Public", "Platform status page, marketing content, docs", "TLS in transit only", "Unauthenticated", "Indefinite"],
    ],
    [1600, 2200, 1800, 1800, 1600]
  ));
  bodyChildren.push(spacer(100));

  bodyChildren.push(heading("3.3 Key Rotation Procedures", 2));
  bodyChildren.push(body(
    "Key rotation follows a rigorous schedule to minimize the impact of potential key exposure. Data Encryption Keys (DEKs) are rotated every 90 days through an automated process that re-encrypts affected data shards without downtime using an encrypt-then-decrypt migration strategy. Key Encryption Keys (KEKs) are rotated annually or immediately upon any indication of compromise. The HSM-backed master key is rotated every two years through a ceremony involving two security officers and full audit trail generation. All rotation events are logged immutably and trigger automated compliance notifications to relevant regulatory contacts."
  ));

  // ── 4. Global Compliance Framework ──────────────────────
  bodyChildren.push(heading("4. Global Compliance Framework", 1), accentLine());
  bodyChildren.push(body(
    "DeliveryBoost's global reach necessitates compliance with data protection regulations across every jurisdiction in which we operate. Our compliance program is built on a framework of continuous monitoring, automated policy enforcement, and regular third-party audits. A dedicated compliance engineering team tracks regulatory developments worldwide and translates new requirements into technical controls within 30 days of enactment."
  ));
  bodyChildren.push(body(
    "The following table summarizes our compliance posture across the nine primary regulatory regimes applicable to the DeliveryBoost platform. Each entry has been validated by external legal counsel and is reviewed semi-annually to ensure continued accuracy."
  ));
  bodyChildren.push(makeTable(
    ["Regulation", "Region", "Applicability", "Key Requirements", "Compliance Status"],
    [
      ["GDPR", "Europe (EEA/UK)", "All EEA residents' data", "Lawful basis, DPIA, DPO, 72-hr breach notice, right to erasure", "Compliant ✓"],
      ["CCPA/CPRA", "California, USA", "CA consumer data", "Right to know, delete, opt-out of sale, limit sensitive data use", "Compliant ✓"],
      ["India DPDP Act", "India", "Indian residents' data", "Consent manager, data fiduciary obligations, cross-border transfer rules", "Compliant ✓"],
      ["Brazil LGPD", "Brazil", "Brazilian data subjects", "Legal basis, DPO appointment, data subject rights, impact assessments", "Compliant ✓"],
      ["UAE PDPL", "UAE", "UAE residents' data", "Consent, purpose limitation, data localization requirements, DPO", "Compliant ✓"],
      ["Singapore PDPA", "Singapore", "Singapore organizations", "Consent, purpose, notification, access, correction, protection obligations", "Compliant ✓"],
      ["Japan APPI", "Japan", "Japanese residents' data", "Purpose specification, consent for sensitive data, cross-border rules", "Compliant ✓"],
      ["South Korea PIPA", "South Korea", "Korean data subjects", "Explicit consent, data minimization, breach notification within 72 hrs", "Compliant ✓"],
      ["China PIPL", "China", "PRC data subjects", "Separate consent for sensitive data, security assessment for cross-border, CAC filing", "Compliant ✓"],
    ],
    [1400, 1400, 1600, 2600, 1200]
  ));
  bodyChildren.push(spacer(100));
  bodyChildren.push(body(
    "Beyond these primary regulations, DeliveryBoost maintains compliance readiness for emerging frameworks including Thailand's PDPA, Vietnam's PDPD, Saudi Arabia's PDPL, and South Africa's POPIA. Our modular compliance architecture allows rapid onboarding of new regulatory requirements without disrupting existing controls."
  ));

  // ── 5. API Security ─────────────────────────────────────
  bodyChildren.push(heading("5. API Security", 1), accentLine());
  bodyChildren.push(body(
    "The DeliveryBoost API serves as the primary interface through which clients and integration partners interact with the platform. Given the volume and sensitivity of data flowing through our endpoints—tracking updates from 200+ carriers, user notification preferences, and delivery confirmations—API security is paramount. Every API request passes through a layered security stack that includes rate limiting, input validation, authentication, and threat detection before reaching application logic."
  ));

  bodyChildren.push(heading("5.1 Rate Limiting", 2));
  bodyChildren.push(body(
    "Global rate limiting is enforced at the edge using a sliding-window algorithm with per-endpoint, per-user, and per-IP granularity. Free-tier users are limited to 100 requests per minute, while Premium users receive 1,000 requests per minute. Service accounts are provisioned with custom rate limits aligned to their integration needs. Burst allowances accommodate legitimate traffic spikes, but sustained overages trigger progressive throttling and eventual temporary suspension with automated notification to the account holder."
  ));

  bodyChildren.push(heading("5.2 Input Validation", 2));
  bodyChildren.push(body(
    "All API inputs are validated against strict Zod schemas that define expected types, ranges, and formats before any processing occurs. Schemas are versioned alongside API releases and enforced at the gateway layer, rejecting malformed payloads with descriptive 400-series responses before they reach downstream services. Additional sanitization layers strip potentially dangerous HTML, SQL fragments, and script injections from string inputs, and file uploads are scanned for malware before storage."
  ));

  bodyChildren.push(heading("5.3 Security Headers & CORS", 2));
  bodyChildren.push(makeTable(
    ["Header", "Value", "Purpose"],
    [
      ["Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'", "Prevent XSS by restricting resource origins"],
      ["Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload", "Force HTTPS for all connections"],
      ["X-Frame-Options", "DENY", "Prevent clickjacking via iframe embedding"],
      ["X-Content-Type-Options", "nosniff", "Prevent MIME-type sniffing"],
      ["Referrer-Policy", "strict-origin-when-cross-origin", "Limit referrer information leakage"],
      ["Permissions-Policy", "geolocation=(), camera=(), microphone=()", "Disable unnecessary browser features"],
    ],
    [2800, 3600, 2600]
  ));
  bodyChildren.push(spacer(100));
  bodyChildren.push(body(
    "Cross-Origin Resource Sharing (CORS) policies are configured to allow requests only from DeliveryBoost-owned domains and explicitly whitelisted partner origins. Preflight requests are validated against the full origin whitelist, and credentials are only included in cross-origin responses when the origin matches exactly. Wildcard origins are never permitted in production environments."
  ));

  bodyChildren.push(heading("5.4 DDoS Protection", 2));
  bodyChildren.push(body(
    "DeliveryBoost leverages Cloudflare's enterprise DDoS protection suite to absorb volumetric attacks before they reach our origin infrastructure. Layer 3/4 attacks are mitigated at Cloudflare's edge network spanning 300+ data centers worldwide, while Layer 7 attacks are detected through behavioral analysis and challenge-based verification. Custom WAF rules protect API endpoints from application-layer exploits, and real-time traffic dashboards enable our security team to adjust mitigation strategies during active attack campaigns."
  ));

  // ── 6. Vulnerability Management ─────────────────────────
  bodyChildren.push(heading("6. Vulnerability Management", 1), accentLine());
  bodyChildren.push(body(
    "DeliveryBoost maintains a proactive vulnerability management program that identifies, triages, and remediates security weaknesses before they can be exploited. The program integrates automated scanning, manual testing, and community-driven discovery to provide comprehensive coverage across our application, infrastructure, and supply chain."
  ));

  bodyChildren.push(heading("6.1 Penetration Testing", 2));
  bodyChildren.push(body(
    "Quarterly penetration tests are conducted by independent third-party firms selected through a rotating vendor program to ensure fresh perspectives. Tests cover the full attack surface including web applications, mobile clients, API endpoints, authentication flows, and internal network segments. Critical and high-severity findings must be remediated within 72 hours and 14 days respectively, with retesting mandatory before closure. Annual red-team exercises simulate advanced persistent threats, testing not only technical controls but also incident detection and response capabilities."
  ));

  bodyChildren.push(heading("6.2 Automated Security Testing in CI/CD", 2));
  bodyChildren.push(body(
    "Every code change passes through a multi-stage security pipeline before reaching production. Static Application Security Testing (SAST) scans source code for vulnerabilities such as injection flaws, insecure deserialization, and hard-coded credentials. Dynamic Application Security Testing (DAST) probes running application instances in staging environments for runtime vulnerabilities. Software Composition Analysis (SCA) identifies known vulnerabilities in third-party dependencies and flags them as blocking issues in the merge pipeline."
  ));

  bodyChildren.push(heading("6.3 Dependency Scanning & Bug Bounty", 2));
  bodyChildren.push(body(
    "Dependabot monitors all repository dependencies continuously, automatically generating pull requests for version updates and security patches. Critical dependency vulnerabilities trigger immediate alerts to the security team and are treated with the same urgency as direct code vulnerabilities. Our public bug bounty program, hosted on HackerOne, rewards security researchers for responsible disclosure of vulnerabilities, with bounties ranging from $200 for low-severity issues to $15,000 for critical remote code execution findings. All submissions are triaged within 24 hours."
  ));

  // ── 7. Incident Response ────────────────────────────────
  bodyChildren.push(heading("7. Incident Response", 1), accentLine());
  bodyChildren.push(body(
    "DeliveryBoost maintains a formal incident response plan that defines clear roles, escalation paths, and communication protocols for security incidents of all severity levels. The plan is tested quarterly through tabletop exercises and annually through full-scale simulation drills that involve cross-functional teams across all regions. Response playbooks are maintained for the most common incident categories including data breach, credential compromise, DDoS attack, and insider threat."
  ));

  bodyChildren.push(heading("7.1 Severity Classification", 2));
  bodyChildren.push(makeTable(
    ["Severity", "Definition", "Response Time", "Communication", "Examples"],
    [
      ["SEV-1", "Critical: Active data breach or complete service compromise", "< 15 minutes", "Immediate: CISO, legal, affected users, regulators within 72 hrs", "Mass PII exfiltration, ransomware, root compromise"],
      ["SEV-2", "High: Significant security event with potential data exposure", "< 1 hour", "Within 4 hrs: Security team, engineering leads, management", "Credential leak, single-tenant breach, API abuse"],
      ["SEV-3", "Medium: Vulnerability exploited with limited impact", "< 4 hours", "Within 24 hrs: Security team, affected product teams", "Non-sensitive data leak, minor injection flaw"],
      ["SEV-4", "Low: Potential vulnerability or security anomaly", "< 24 hours", "Next business day: Security team triage", "Suspicious login pattern, policy violation"],
    ],
    [1000, 2000, 1400, 2000, 2600]
  ));
  bodyChildren.push(spacer(100));

  bodyChildren.push(heading("7.2 Global Incident Response Team", 2));
  bodyChildren.push(body(
    "A 24/7 global incident response team operates from three regional security operations centers in London, Singapore, and São Paulo, ensuring continuous coverage across all time zones. Each center is staffed with security analysts, incident commanders, and on-call engineering leads who can mobilize domain-specific expertise within minutes. Handoff procedures between centers follow a standardized playbook that includes full context transfer, open action items, and active incident status to prevent information loss during shift transitions."
  ));

  bodyChildren.push(heading("7.3 Communication & Post-Mortem", 2));
  bodyChildren.push(body(
    "Incident communication follows jurisdiction-specific protocols: GDPR-regulated incidents require notification to supervisory authorities within 72 hours, LGPD incidents must be reported to the ANPD within a reasonable timeframe, and PDPL incidents in the UAE require notification to the relevant data authority. All incidents, regardless of severity, conclude with a blameless post-mortem process that produces a root-cause analysis, timeline reconstruction, and actionable improvement items with assigned owners and deadlines. Post-mortem reports are published internally within five business days and shared with affected stakeholders."
  ));

  // ── 8. Access Control ───────────────────────────────────
  bodyChildren.push(heading("8. Access Control", 1), accentLine());
  bodyChildren.push(body(
    "Access to DeliveryBoost's infrastructure and sensitive resources is governed by a multi-layered access control framework that combines identity verification, role-based permissions, and continuous audit logging. The principle of least privilege is enforced at every layer, and all access grants are time-bounded with automatic expiration to prevent privilege accumulation."
  ));

  bodyChildren.push(heading("8.1 Infrastructure Access", 2));
  bodyChildren.push(body(
    "All infrastructure is hosted on Vercel, with administrative access controlled through Vercel's built-in RBAC system. Engineers are assigned to role-based teams (Viewer, Developer, Admin) with access scoped to specific projects. Production environment access requires additional approval from two authorized administrators and is logged with full session recording. No direct SSH or database access is permitted in production; all operations are performed through approved CI/CD pipelines and administrative dashboards."
  ));

  bodyChildren.push(heading("8.2 Secret Management", 2));
  bodyChildren.push(body(
    "Application secrets, API keys, and database credentials are stored in Vercel's encrypted environment variable store and injected at runtime. Secrets are never committed to source code, and pre-commit hooks scan for accidental secret inclusion. A dedicated secrets rotation service cycles non-user-facing credentials every 90 days and user-facing OAuth tokens on a configurable schedule. Access to secret management interfaces requires hardware security key authentication and is logged immutably."
  ));

  bodyChildren.push(heading("8.3 Encryption Key Hierarchy", 2));
  bodyChildren.push(body(
    "The encryption key hierarchy follows a three-tier model: a hardware-protected Master Key stored in an HSM, Key Encryption Keys (KEKs) that encrypt data encryption keys, and Data Encryption Keys (DEKs) that encrypt application data. Each tier operates on a distinct rotation schedule—2 years, 1 year, and 90 days respectively—with emergency rotation procedures that can execute within one hour for any key tier. Key ceremony procedures require dual-control authentication for any operation involving the Master Key or KEKs."
  ));

  bodyChildren.push(heading("8.4 Audit Logging", 2));
  bodyChildren.push(body(
    "Every access event, configuration change, and data operation is recorded in an append-only audit log with cryptographic integrity verification. Logs are retained for a minimum of seven years to satisfy the most stringent regulatory requirements across our operating jurisdictions. Real-time log analysis detects anomalous access patterns and triggers automated alerts to the security operations team. Quarterly access reviews examine audit logs for privilege escalation, unauthorized access attempts, and dormant account activity."
  ));

  // ── 9. Privacy & Data Handling ──────────────────────────
  bodyChildren.push(heading("9. Privacy & Data Handling", 1), accentLine());
  bodyChildren.push(body(
    "Privacy is embedded into every stage of DeliveryBoost's data processing lifecycle, from collection through deletion. Our privacy engineering team works alongside product development to ensure that data protection considerations are addressed at the design phase, not retrofitted after deployment. This privacy-by-design approach is codified in our development standards and validated through mandatory privacy reviews for all new features."
  ));

  bodyChildren.push(heading("9.1 Data Minimization", 2));
  bodyChildren.push(body(
    "DeliveryBoost collects only the data strictly necessary to provide delivery notification services. User profiles require minimal identifying information—email address and optional phone number for notification delivery. Location data is processed ephemerally to match users with nearby delivery platforms and is not stored in persistent form unless the user explicitly enables location-based features. Delivery metadata is aggregated and anonymized for analytics purposes, with raw event data purged after 90 days unless retention is required by applicable law."
  ));

  bodyChildren.push(heading("9.2 Right to Export & Deletion", 2));
  bodyChildren.push(body(
    "Users can export all personal data held by DeliveryBoost in a machine-readable JSON format through the account settings page, fulfilling data portability requirements under GDPR Article 20, CCPA, and other regulations. The right to deletion is implemented as a cascading erasure process: user-facing data is deleted within 24 hours of request, backup copies are purged within the next backup rotation cycle (maximum 30 days), and anonymized analytics aggregates are retained without re-identification risk. Deletion requests are tracked through a dedicated workflow that confirms completion and notifies the user."
  ));

  bodyChildren.push(heading("9.3 Cookie Consent", 2));
  bodyChildren.push(body(
    "Cookie consent is managed through a jurisdiction-aware consent banner that adapts its behavior based on the user's detected region. In GDPR jurisdictions, the banner operates on an opt-in basis—no non-essential cookies are set until explicit consent is given, and users can withdraw consent at any time through persistent cookie settings. In CCPA jurisdictions, the banner provides clear notice and an opt-out mechanism for data sale (as broadly defined). Cookie consent preferences are stored in a first-party, server-side preference record to ensure persistence across devices and sessions."
  ));

  bodyChildren.push(heading("9.4 Age-Gating for Regulated Categories", 2));
  bodyChildren.push(body(
    "Delivery categories involving regulated products—alcohol, cannabis, tobacco, and pharmacy items—are subject to mandatory age-gating controls. Users must verify their age through a government-ID verification process before accessing notification settings for these categories. Age verification status is cached for a configurable period (typically 12 months) and re-verification is triggered when the cached credential expires or when the user modifies their regulated-category preferences. These controls are detailed further in Section 10."
  ));

  // ── 10. Age-Restricted Category Compliance ───────────────
  bodyChildren.push(heading("10. Age-Restricted Category Compliance", 1), accentLine());
  bodyChildren.push(body(
    "As a global delivery notification aggregator covering categories such as alcohol, cannabis, tobacco, and pharmaceutical products, DeliveryBoost must comply with a complex patchwork of age-verification and restricted-product regulations that vary dramatically across jurisdictions. Our compliance approach combines technology-driven verification, jurisdiction-aware feature availability, and partnership-level accountability to ensure that age-restricted notifications reach only verified adults."
  ));

  bodyChildren.push(heading("10.1 Verification Systems", 2));
  bodyChildren.push(body(
    "DeliveryBoost employs a multi-factor age verification system that combines document verification, database cross-referencing, and liveness detection. Users seeking to receive notifications for age-restricted categories must complete a one-time verification that includes uploading a government-issued photo ID, which is validated against official databases where available and through AI-powered document authentication. Liveness detection prevents the use of photographs or digital copies of identification documents. Verification results are encrypted and stored separately from user profiles, linked only by a cryptographic token that confirms verification status without exposing the underlying identity documents."
  ));

  bodyChildren.push(heading("10.2 Jurisdiction-Aware Availability", 2));
  bodyChildren.push(body(
    "Age-restricted notification categories are only displayed to users in jurisdictions where the corresponding product category is legally available for delivery. This jurisdiction mapping is maintained by our legal compliance team and encoded into a configuration service that is queried in real time when rendering the user's category preferences. For example, cannabis delivery notifications are available only to verified users in jurisdictions where cannabis delivery is legal (e.g., certain US states, Canada, Thailand), while alcohol notifications are broadly available with age verification in most markets but restricted or unavailable in dry jurisdictions. The configuration service updates within 24 hours of any legal change."
  ));

  bodyChildren.push(heading("10.3 Legal Compliance per Market", 2));
  bodyChildren.push(body(
    "Each market in which DeliveryBoost operates age-restricted categories is governed by a market-specific compliance plan that addresses local licensing requirements, delivery partner certifications, and regulatory reporting obligations. In the United States, state-by-state compliance accounts for varying alcohol and cannabis delivery laws, including dry counties and medical-use-only cannabis markets. In India, alcohol delivery notifications are disabled entirely in states where alcohol delivery is prohibited. In the UAE and other Islamic jurisdictions, alcohol and cannabis notifications are completely unavailable regardless of individual user verification status. These market-level controls are enforced at the API layer, preventing any bypass at the client level."
  ));
  bodyChildren.push(body(
    "Pharmaceutical delivery notifications require additional safeguards including verification that the user holds a valid prescription where applicable, and that the delivering pharmacy is licensed in the user's jurisdiction. DeliveryBoost partners only with licensed, verified pharmacies and dispensaries for these categories, and our platform enforces partner-level compliance checks on a quarterly basis. Failure to maintain compliance standards results in immediate suspension of the partner's notification integration until remediation is verified."
  ));

  // ── Assemble document ───────────────────────────────────
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Times New Roman", size: 24, color: COLORS.body },
        },
        heading1: {
          run: { font: "Times New Roman", size: 32, bold: true, color: COLORS.primary },
        },
        heading2: {
          run: { font: "Times New Roman", size: 28, bold: true, color: COLORS.primary },
        },
      },
    },
    sections: [
      coverSection,
      tocSection,
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        headers: { default: bodyHeader },
        footers: { default: bodyFooter },
        children: bodyChildren,
      },
    ],
  });

  // ── Write file ──────────────────────────────────────────
  const buffer = await Packer.toBuffer(doc);
  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outPath, buffer);
  console.log(`✅ Document saved to ${outPath}`);
  console.log(`   Size: ${(buffer.length / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error("❌ Generation failed:", err);
  process.exit(1);
});
