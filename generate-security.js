const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  TableOfContents, SectionType,
} = require("docx");
const fs = require("fs");

// Palette: WR-2 (Retro Green) for security docs
const P = {
  primary: "2A4A3A", body: "000000", secondary: "5A6A5A",
  accent: "2A4A3A", surface: "F0EDE5",
  cover: { titleColor: "FFFFFF", subtitleColor: "B0B8C0", metaColor: "90989F", footerColor: "687078" },
  table: { headerBg: "2A4A3A", headerText: "FFFFFF", accentLine: "2A4A3A", innerLine: "D0D8D0", surface: "F0EDE5" },
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
          shading: { type: ShadingType.CLEAR, fill: "0C1F1A" },
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
              border: { left: { style: BorderStyle.SINGLE, size: 18, color: "C89F62", space: 12 } },
              children: [new TextRun({ text: "    Security & Access Document", size: 32, color: P.cover.subtitleColor, font: { ascii: "Times New Roman", eastAsia: "Microsoft YaHei" } })],
            }),
            new Paragraph({ spacing: { before: 600 } }),
            ...["Version 1.0", "Date: June 7, 2026", "Author: Yashas K. Gangatkar", "Classification: Confidential"].map(m => new Paragraph({
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
    heading("1. Security Overview"),
    body("CapNotif handles sensitive user data including delivery platform credentials, personal identification information, and financial earnings data. The security architecture is designed with a defense-in-depth approach, implementing multiple layers of protection to ensure that even if one layer is compromised, additional safeguards prevent unauthorized access to user data. This document outlines the security policies, access control mechanisms, encryption standards, and compliance requirements that govern the CapNotif application."),
    body("The security model is built on three foundational principles: least privilege access, where every component and user has only the minimum permissions necessary to perform their function; defense in depth, where multiple independent security controls protect critical assets; and zero trust, where no request or connection is implicitly trusted regardless of its origin. These principles guide all architectural decisions from authentication flows to data storage encryption."),

    heading("2. Authentication & Authorization"),
    heading("2.1 User Authentication", HeadingLevel.HEADING_2),
    body("CapNotif uses NextAuth.js as its authentication framework, providing a secure and flexible authentication system that supports multiple identity providers. The primary authentication methods include email and password credentials with bcrypt hashing (cost factor 12), Google OAuth 2.0 for social login, and GitHub OAuth 2.0 as an alternative provider. All authentication flows enforce HTTPS and use HTTP-only, Secure, SameSite=Lax cookies for session management to prevent cross-site scripting (XSS) and cross-site request forgery (CSRF) attacks."),
    body("Session tokens are implemented as JSON Web Tokens (JWT) with a configurable expiration period of 24 hours for active sessions. Tokens include the user ID, email, subscription tier, and a cryptographic signature verified on every request. Refresh tokens are not stored client-side; instead, the session is silently renewed through the NextAuth callback when the JWT approaches expiration, provided the user remains active on the platform."),

    heading("2.2 Platform Authentication", HeadingLevel.HEADING_2),
    body("Delivery platform connections use OAuth 2.0 authorization code flow with PKCE (Proof Key for Code Exchange) to securely obtain access tokens without exposing authorization codes. The PKCE flow is mandatory for all platform connections, preventing authorization code interception attacks even on compromised network connections. When a user connects a delivery platform, they are redirected to the platform's OAuth consent screen, where they explicitly authorize CapNotif to access their delivery account data."),
    body("Platform access tokens and refresh tokens are never exposed to the client browser. After the OAuth callback, tokens are immediately encrypted using AES-256-GCM and stored in the database. All subsequent API calls to delivery platforms are made from server-side API routes, which decrypt the tokens at runtime, perform the platform API call, and return only the necessary data to the client. This architecture ensures that platform credentials remain protected even if the client-side JavaScript is compromised."),

    heading("2.3 Role-Based Access Control", HeadingLevel.HEADING_2),
    makeTable(
      ["Role", "Description", "Permissions"],
      [
        ["Free User", "Registered user on free tier", "View order feed, connect up to 3 platforms, basic earnings view, notification settings"],
        ["Premium User", "Paid subscriber ($9.99/month)", "All Free permissions plus auto-accept rules, advanced analytics, unlimited platforms, priority notifications"],
        ["Admin", "System administrator", "User management, platform integration configuration, system monitoring, audit log access"],
        ["Service Account", "Backend service identity", "Database read/write, platform API access, encryption key access, limited to specific service scope"],
      ]
    ),

    heading("3. Data Protection"),
    heading("3.1 Encryption at Rest", HeadingLevel.HEADING_2),
    body("All sensitive data stored in the database is encrypted at the application layer using AES-256-GCM before being written to disk. The encryption key hierarchy follows a two-tier model: a master encryption key (MEK) stored in Vercel environment variables, and data encryption keys (DEK) derived per-record using HKDF-SHA256 with a record-specific salt. This approach enables key rotation without re-encrypting all records, as only the DEK needs to be re-encrypted with the new MEK."),
    body("Specific fields that are encrypted include: platform access tokens, platform refresh tokens, user email addresses (in addition to database-level encryption), and any personally identifiable information collected during onboarding. Encryption and decryption operations use constant-time comparison functions to prevent timing side-channel attacks, and all encryption operations include authentication tags to detect tampering."),

    heading("3.2 Encryption in Transit", HeadingLevel.HEADING_2),
    body("All network communication is encrypted using TLS 1.3, enforced at the Vercel edge network level. Connections using older TLS versions (1.0, 1.1, 1.2) are rejected. HTTP Strict Transport Security (HSTS) is enabled with a minimum max-age of one year, including subdomains and preload directives. This ensures that browsers always connect via HTTPS, preventing man-in-the-middle attacks and protocol downgrade attempts."),
    body("Internal communication between application components, including database connections, cache connections, and inter-service API calls, also uses TLS encryption. Database connections to Vercel Postgres require SSL certificates, and Vercel KV connections are encrypted via TLS. The application verifies certificate validity on all connections and rejects self-signed or expired certificates."),

    heading("3.3 Data Classification", HeadingLevel.HEADING_2),
    makeTable(
      ["Classification", "Examples", "Storage", "Access", "Retention"],
      [
        ["Critical", "Platform tokens, encryption keys", "AES-256 encrypted, isolated KV store", "Service accounts only", "Until user disconnects platform"],
        ["Sensitive", "User email, earnings data, order history", "AES-256 encrypted in Postgres", "User + authorized services", "2 years after last activity"],
        ["Internal", "Session state, rate limit counters", "Vercel KV (encrypted at rest)", "Application layer only", "24 hours (auto-expiring)"],
        ["Public", "Pricing information, feature descriptions", "Static content, CDN cached", "Unrestricted", "Indefinite"],
      ]
    ),

    heading("4. API Security"),
    heading("4.1 Rate Limiting", HeadingLevel.HEADING_2),
    body("API rate limiting is implemented at multiple levels to protect against abuse and ensure fair resource allocation. Global rate limiting is enforced per authenticated user using a sliding window algorithm backed by Vercel KV, allowing 100 requests per minute for standard API endpoints and 20 requests per minute for authentication-related endpoints. Platform-specific API calls are rate-limited according to each platform's documented limits, with a 20% safety margin to avoid triggering platform throttling."),
    body("Rate limit responses include standard HTTP 429 status codes with Retry-After headers indicating when the client may resume requests. Repeated rate limit violations trigger progressive cooling periods, with escalating temporary blocks ranging from 1 minute for the first violation to 1 hour for repeated violations. Rate limit counters are scoped per-user and per-endpoint, ensuring that heavy usage of one endpoint does not block access to other functionality."),

    heading("4.2 Input Validation & Sanitization", HeadingLevel.HEADING_2),
    body("All API endpoints implement strict input validation using Zod schemas that define the expected shape, type, and constraints of request parameters. Validation occurs before any business logic processing, and invalid requests are rejected immediately with descriptive error messages that do not reveal internal implementation details. String inputs are sanitized to prevent SQL injection (through Prisma parameterized queries), XSS (through output encoding), and command injection (through input allowlisting)."),
    body("File upload endpoints, if any, enforce strict content-type validation, maximum file size limits, and virus scanning through ClamAV integration. Upload filenames are sanitized and replaced with UUID-based identifiers to prevent path traversal attacks. All uploaded content is stored in isolated object storage with no execute permissions."),

    heading("4.3 CORS & Security Headers", HeadingLevel.HEADING_2),
    makeTable(
      ["Header", "Value", "Purpose"],
      [
        ["Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'", "Prevent XSS by restricting resource loading"],
        ["X-Frame-Options", "DENY", "Prevent clickjacking via iframe embedding"],
        ["X-Content-Type-Options", "nosniff", "Prevent MIME type sniffing"],
        ["Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload", "Enforce HTTPS connections"],
        ["Referrer-Policy", "strict-origin-when-cross-origin", "Control referrer information leakage"],
        ["Permissions-Policy", "camera=(), microphone=(), geolocation=(self)", "Restrict browser API access"],
      ]
    ),

    heading("5. Vulnerability Management"),
    heading("5.1 Dependency Scanning", HeadingLevel.HEADING_2),
    body("All project dependencies are automatically scanned for known vulnerabilities through GitHub Dependabot, which monitors the package manifest for outdated or insecure versions. Dependabot automatically creates pull requests for security updates, which are prioritized for review and merging. The CI/CD pipeline includes an npm audit step that fails the build for critical or high-severity vulnerabilities, ensuring that vulnerable dependencies never reach production."),
    body("Dependency pinning is enforced for all direct and transitive dependencies using lockfile integrity checks. The lockfile is committed to the repository and verified during CI builds to prevent supply chain attacks through dependency confusion or registry manipulation. Any dependency update requires explicit review and approval before merging."),

    heading("5.2 Penetration Testing", HeadingLevel.HEADING_2),
    body("CapNotif undergoes regular penetration testing on a quarterly basis, conducted by an independent third-party security firm. The scope includes all web application endpoints, authentication flows, API routes, and data storage mechanisms. Penetration test findings are classified using the OWASP Risk Rating Methodology and remediated according to the following SLAs: Critical findings within 24 hours, High within 72 hours, Medium within 2 weeks, and Low within 1 month."),
    body("In addition to formal penetration testing, the development team conducts continuous security testing through automated tools integrated into the CI/CD pipeline. These include SAST (Static Application Security Testing) using SonarCloud, DAST (Dynamic Application Security Testing) using OWASP ZAP, and SCA (Software Composition Analysis) using Snyk. All findings from automated tools are triaged weekly and remediated according to the same SLA framework."),

    heading("6. Incident Response"),
    heading("6.1 Incident Classification", HeadingLevel.HEADING_2),
    makeTable(
      ["Severity", "Definition", "Response Time", "Notification"],
      [
        ["SEV-1 (Critical)", "Active data breach, service completely down, encryption key compromise", "15 minutes", "All stakeholders + affected users within 1 hour"],
        ["SEV-2 (High)", "Partial service degradation, potential data exposure, authentication bypass", "1 hour", "Engineering lead + product owner within 4 hours"],
        ["SEV-3 (Medium)", "Performance degradation, non-critical feature failure, rate limit anomalies", "4 hours", "Engineering team within 24 hours"],
        ["SEV-4 (Low)", "Minor bugs, cosmetic issues, informational security events", "24 hours", "Logged for weekly review"],
      ]
    ),

    heading("6.2 Incident Response Process", HeadingLevel.HEADING_2),
    body("The incident response process follows a six-phase model: Detection, where incidents are identified through monitoring alerts or user reports; Triage, where the incident is classified by severity and assigned to the appropriate responder; Containment, where immediate actions are taken to prevent further damage; Eradication, where the root cause is identified and remediated; Recovery, where normal operations are restored and verified; and Post-Mortem, where a blameless retrospective is conducted to identify process improvements and preventive measures."),
    body("All incidents are documented in a centralized incident log with timestamps, actions taken, and outcomes. SEV-1 and SEV-2 incidents require a formal post-mortem document within 48 hours of resolution, including a timeline of events, root cause analysis, and action items for preventing recurrence. Post-mortem documents are reviewed in a weekly engineering meeting and tracked to completion."),

    heading("7. Compliance & Audit"),
    heading("7.1 Regulatory Compliance", HeadingLevel.HEADING_2),
    makeTable(
      ["Regulation", "Applicability", "Status", "Key Requirements"],
      [
        ["SOC 2 Type II", "All user data processing", "Planned Q1 2027", "Access controls, encryption, audit logging, incident response"],
        ["GDPR", "EU user data (if applicable)", "Compliance planned", "Data minimization, right to deletion, consent management"],
        ["CCPA", "California user data", "Compliance planned", "Right to know, right to delete, opt-out of data sale"],
        ["OWASP Top 10", "All web application security", "Ongoing", "Injection, authentication, XSS, misconfiguration prevention"],
      ]
    ),

    heading("7.2 Audit Logging", HeadingLevel.HEADING_2),
    body("All security-relevant events are logged to a tamper-evident audit log stored in Axiom with append-only retention policies. Audit log entries include timestamp, user ID, action performed, resource affected, source IP address, and outcome (success or failure). Logs are retained for a minimum of one year and are available for compliance audits and forensic investigations."),
    body("Logged events include: authentication attempts (successful and failed), platform connection and disconnection, changes to auto-accept rules, subscription changes, API key rotations, admin actions, and data export requests. Failed authentication attempts exceeding five within a 15-minute window trigger an automatic account lockout and security alert notification to the account holder."),

    heading("8. Access Control Implementation"),
    heading("8.1 Infrastructure Access", HeadingLevel.HEADING_2),
    body("Access to production infrastructure is controlled through Vercel's role-based access control system, with separate roles for deployment, monitoring, and administration. No team member has direct database access to production; all data access is performed through the application API layer or through approved administrative tools with audit logging. SSH access to servers is not applicable in the Vercel serverless architecture, but any administrative API access requires multi-factor authentication and is logged with full context."),

    heading("8.2 Secret Management", HeadingLevel.HEADING_2),
    body("All secrets, including database connection strings, encryption keys, platform API keys, and third-party service credentials, are stored in Vercel encrypted environment variables. Secrets are never committed to the repository, logged in application output, or exposed in client-side code. The .env.local file is included in .gitignore and is used only for local development with non-production values."),
    body("Secret rotation is performed on a quarterly schedule for all API keys and encryption keys. The master encryption key rotation process follows a documented procedure that ensures zero-downtime rotation through the two-tier key hierarchy: new data is encrypted with the new MEK, while existing data remains accessible through the old MEK until a background migration process re-encrypts all records with the new key."),

    heading("9. Privacy & Data Handling"),
    body("CapNotif collects only the minimum data necessary to provide its services. User data includes email address, display name, and delivery platform credentials. Earnings data and order history are derived from platform API responses and are not independently collected. No location data is collected beyond what is necessary for platform API integration, and no behavioral tracking or advertising identifiers are used."),
    body("Users can request a complete data export at any time through the account settings page, receiving a machine-readable JSON file containing all stored personal data. Users can also request permanent account deletion, which removes all personal data, encrypted credentials, and associated records within 30 days, with the exception of data that must be retained for legal or compliance purposes as documented in the data retention policy."),
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
            children: [new TextRun({ text: "CapNotif Security & Access v1.0", size: 18, color: "808080", font: { ascii: "Times New Roman" } })],
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
  fs.writeFileSync("/home/z/my-project/download/capnotif-docs/CapNotif_Security_Access.docx", buf);
  console.log("Security & Access document generated successfully");
});
