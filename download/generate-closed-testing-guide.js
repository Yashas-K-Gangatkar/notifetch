const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  PageOrientation, LevelFormat,
} = require("docx");
const fs = require("fs");

const P = {
  primary: "#0A1628", body: "#1A2B40", secondary: "#6878A0",
  accent: "#F59E0B", surface: "#F4F8FC",
  cover: { bg: "#0A0A0A", titleColor: "F59E0B", subtitleColor: "FFFFFF", metaColor: "A0A0A0", footerColor: "6878A0" }
};
const c = (hex) => hex.replace("#", "");

function heading1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 120 },
    children: [new TextRun({ text, bold: true, color: c(P.primary), font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 32 })] });
}
function heading2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 100 },
    children: [new TextRun({ text, bold: true, color: c(P.primary), font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 28 })] });
}
function heading3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 240, after: 80 },
    children: [new TextRun({ text, bold: true, color: c(P.body), font: { ascii: "Calibri", eastAsia: "SimHei" }, size: 26 })] });
}
function bodyPara(text) {
  return new Paragraph({ alignment: AlignmentType.JUSTIFIED, indent: { firstLine: 0 }, spacing: { line: 312, after: 80 },
    children: [new TextRun({ text, size: 22, color: c(P.body), font: { ascii: "Calibri", eastAsia: "SimSun" } })] });
}
function bullet(text, level) {
  level = level || 0;
  return new Paragraph({ alignment: AlignmentType.LEFT, spacing: { line: 312, after: 40 }, indent: { left: 360 + level * 360 },
    children: [
      new TextRun({ text: "\u2022  ", size: 22, color: c(P.accent), font: { ascii: "Calibri" } }),
      new TextRun({ text, size: 22, color: c(P.body), font: { ascii: "Calibri", eastAsia: "SimSun" } }),
    ] });
}
function numberedItem(num, text) {
  return new Paragraph({ alignment: AlignmentType.LEFT, spacing: { line: 312, after: 40 }, indent: { left: 360 },
    children: [
      new TextRun({ text: num + ". ", size: 22, color: c(P.accent), bold: true, font: { ascii: "Calibri" } }),
      new TextRun({ text, size: 22, color: c(P.body), font: { ascii: "Calibri", eastAsia: "SimSun" } }),
    ] });
}
function tipBox(text) {
  return new Paragraph({ alignment: AlignmentType.LEFT, spacing: { line: 312, before: 120, after: 120 }, indent: { left: 360, right: 360 },
    shading: { type: ShadingType.CLEAR, fill: "FFF8E1" },
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: c(P.accent) } },
    children: [
      new TextRun({ text: "TIP: ", size: 22, bold: true, color: c(P.accent), font: { ascii: "Calibri" } }),
      new TextRun({ text, size: 22, color: c(P.body), font: { ascii: "Calibri", eastAsia: "SimSun" } }),
    ] });
}
function warningBox(text) {
  return new Paragraph({ alignment: AlignmentType.LEFT, spacing: { line: 312, before: 120, after: 120 }, indent: { left: 360, right: 360 },
    shading: { type: ShadingType.CLEAR, fill: "FFF3E0" },
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: "E65100" } },
    children: [
      new TextRun({ text: "WARNING: ", size: 22, bold: true, color: "E65100", font: { ascii: "Calibri" } }),
      new TextRun({ text, size: 22, color: c(P.body), font: { ascii: "Calibri", eastAsia: "SimSun" } }),
    ] });
}
function spacer(pts) {
  pts = pts || 120;
  return new Paragraph({ spacing: { before: pts, after: 0 }, children: [] });
}
function makeTable(headers, rows) {
  var colWidth = Math.floor(100 / headers.length);
  var headerRow = new TableRow({ tableHeader: true, cantSplit: true,
    children: headers.map(function(h) { return new TableCell({
      width: { size: colWidth, type: WidthType.PERCENTAGE },
      shading: { type: ShadingType.CLEAR, fill: "1A2B40" },
      margins: { top: 60, bottom: 60, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20, color: "FFFFFF", font: { ascii: "Calibri", eastAsia: "SimHei" } })] })],
    }); })
  });
  var dataRows = rows.map(function(row, idx) { return new TableRow({ cantSplit: true,
    children: row.map(function(cell) { return new TableCell({
      width: { size: colWidth, type: WidthType.PERCENTAGE },
      shading: { type: ShadingType.CLEAR, fill: idx % 2 === 0 ? "F4F8FC" : "FFFFFF" },
      margins: { top: 60, bottom: 60, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: cell, size: 20, color: c(P.body), font: { ascii: "Calibri", eastAsia: "SimSun" } })] })],
    }); })
  }); });
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: { style: BorderStyle.SINGLE, size: 2, color: "9AA6B2" }, bottom: { style: BorderStyle.SINGLE, size: 2, color: "9AA6B2" },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" }, insideVertical: { style: BorderStyle.NONE } },
    rows: [headerRow].concat(dataRows) });
}

var bc = [];

// Section 1
bc.push(heading1("1. Closed Testing Overview"));
bc.push(bodyPara("Google Play requires all personal developer accounts created after November 2023 to complete a closed test before they can publish apps to production. The closed testing requirement ensures that new developers have thoroughly tested their apps with real users before making them available to the broader public. This document serves as a comprehensive guide for meeting and exceeding these requirements for NotiFetch, ensuring a smooth transition from closed testing to production release on the Google Play Store."));
bc.push(spacer(80));
bc.push(heading2("1.1 Google Play Requirements"));
bc.push(bodyPara("To satisfy Google Play\u2019s closed testing mandate, the following three conditions must all be met simultaneously. Each requirement is non-negotiable and must be fulfilled before you can apply for production access:"));
bc.push(makeTable(["Requirement", "Details", "Status"], [
  ["Publish a closed testing release", "Upload an AAB/APK to a closed testing track in Play Console", "Ready"],
  ["12 testers opted-in", "At least 12 unique Google accounts must join the testing list", "Pending"],
  ["14-day test period", "Testers must actively use the app for a minimum of 14 consecutive days", "Pending"],
]));
bc.push(spacer(80));
bc.push(warningBox("The 14-day timer only starts once 12+ testers have opted in. Simply uploading the app does not start the clock. Plan your tester recruitment before or immediately after uploading the AAB."));
bc.push(spacer(60));
bc.push(heading2("1.2 What Counts as Active Testing"));
bc.push(bodyPara("Google monitors tester activity to ensure genuine testing is occurring. Passive opt-in without actual app usage does not count toward the 14-day requirement. Active testing is defined by meaningful engagement with the app, including launching the application, navigating through different screens and features, triggering core functionality such as notification capture and viewing, and interacting with settings or profile configurations. Google tracks these interactions through installation metrics, crash reports, and usage analytics."));
bc.push(bodyPara("To maximize the quality and validity of your closed test, encourage testers to perform at least one meaningful action per day, such as checking their notification feed, reviewing earnings data, or adjusting settings. This pattern of consistent daily engagement signals genuine testing activity and satisfies Google\u2019s monitoring criteria while also providing valuable real-world feedback about the app\u2019s performance and usability."));

// Section 2
bc.push(heading1("2. Step-by-Step Setup Guide"));
bc.push(heading2("2.1 Upload the AAB to Play Console"));
bc.push(bodyPara("Before uploading, ensure you have created your app in Google Play Console and completed the store listing. The AAB file has already been built and signed for release. Follow these steps to upload it to the closed testing track:"));
bc.push(numberedItem(1, "Open Google Play Console (play.google.com/console)"));
bc.push(numberedItem(2, "Select your NotiFetch app from the app list"));
bc.push(numberedItem(3, "Navigate to Testing > Closed Testing in the left sidebar"));
bc.push(numberedItem(4, "Click \u201cCreate new release\u201d to start the upload process"));
bc.push(numberedItem(5, "Upload the AAB file: NotiFetch-v2.7.0-vc23-release.aab (9.7 MB)"));
bc.push(numberedItem(6, "Enter release notes (see Section 5 for prepared release notes)"));
bc.push(numberedItem(7, "Review the release details and click \u201cStart rollout to closed testing\u201d"));
bc.push(spacer(60));
bc.push(tipBox("If you encounter a deobfuscation file upload prompt, include the Crashlytics mapping file for better crash reports."));
bc.push(spacer(60));
bc.push(heading2("2.2 Create a Tester List"));
bc.push(bodyPara("Closed testing on Google Play uses email-based tester lists. You can create up to 200 tester lists, each containing up to 2,000 email addresses. For NotiFetch, you need a minimum of 12 testers. Here is how to set up your tester list:"));
bc.push(numberedItem(1, "In Play Console, go to Testing > Closed Testing"));
bc.push(numberedItem(2, "Under \u201cTester lists\u201d, click \u201cCreate list\u201d"));
bc.push(numberedItem(3, "Name the list (e.g., \u201cNotiFetch Alpha Testers\u201d)"));
bc.push(numberedItem(4, "Add tester email addresses (see Section 6 for the prepared list)"));
bc.push(numberedItem(5, "Save the list and assign it to your closed testing track"));
bc.push(spacer(60));
bc.push(bodyPara("Once the list is created and assigned, Google sends an opt-in email to each tester. Testers must click the opt-in link to join the test. Only after they accept and install the app do they count toward the 12-tester minimum."));
bc.push(heading2("2.3 Share the Testing Link"));
bc.push(bodyPara("After creating the closed testing release, Play Console generates a unique testing link. This link allows opted-in testers to access the app on the Play Store. Share this link with all testers via email, messaging apps, or any communication channel."));
bc.push(spacer(40));
bc.push(new Paragraph({ alignment: AlignmentType.LEFT, indent: { left: 720 }, spacing: { line: 312, after: 80 },
  shading: { type: ShadingType.CLEAR, fill: "F4F8FC" },
  children: [new TextRun({ text: "play.google.com/apps/testing/com.notifetch.app", size: 22, color: c(P.accent), font: { ascii: "Calibri" } })] }));
bc.push(spacer(40));
bc.push(warningBox("Testers must opt-in BEFORE the testing link works. If they try to access the link without opting in first, they will see an error."));
bc.push(heading2("2.4 Monitor the 14-Day Timer"));
bc.push(bodyPara("The 14-day countdown begins automatically once 12 or more testers have opted into the closed test. You can monitor the progress in Play Console under Testing > Closed Testing, where a status indicator shows how many testers have opted in and how many days remain. If tester count drops below 12 at any point, the timer may pause or reset, so ensure your testers remain active throughout the entire period."));

// Section 3
bc.push(heading1("3. Tester Onboarding Guide"));
bc.push(bodyPara("Providing clear onboarding instructions to your testers is essential for ensuring they can successfully install, use, and provide feedback on NotiFetch. The following guide should be shared with all testers when they join the closed test."));
bc.push(heading2("3.1 Pre-Installation Requirements"));
bc.push(bodyPara("Before installing NotiFetch, testers need to ensure their device meets the minimum requirements:"));
bc.push(makeTable(["Requirement", "Details"], [
  ["Android version", "Android 7.0 (API 24) or higher"],
  ["Google account", "Must use the same email that received the testing invitation"],
  ["Storage space", "At least 15 MB free for app installation"],
  ["Internet connection", "Required for initial setup and notification sync"],
  ["Delivery apps", "At least one delivery app installed (Swiggy, Zomato, Amazon, etc.)"],
]));
bc.push(spacer(80));
bc.push(heading2("3.2 Installation Steps for Testers"));
bc.push(bodyPara("Share these step-by-step instructions with your testers:"));
bc.push(numberedItem(1, "Check your email for the Google Play testing invitation from NotiFetch"));
bc.push(numberedItem(2, "Click the \u201cOpt-in\u201d button in the invitation email to join the test"));
bc.push(numberedItem(3, "Open the testing link on your Android device"));
bc.push(numberedItem(4, "Install NotiFetch from the Play Store (it will show as a testing version)"));
bc.push(numberedItem(5, "Open the app and follow the on-screen consent and permission setup"));
bc.push(numberedItem(6, "Grant notification access when prompted (required for the app to function)"));
bc.push(numberedItem(7, "Start using the app daily to track delivery notifications"));
bc.push(spacer(60));
bc.push(tipBox("If a tester cannot find the invitation email, ask them to check their spam/junk folder. They can also join directly by visiting the testing link while signed into the correct Google account."));

bc.push(heading2("3.3 What Testers Should Test"));
bc.push(bodyPara("To ensure comprehensive coverage, provide your testers with a structured testing checklist:"));
bc.push(makeTable(["Feature Area", "Test Actions", "Expected Outcome"], [
  ["Notification Capture", "Receive delivery notifications from Swiggy, Zomato, Amazon, etc.", "Notifications appear in the dashboard within seconds"],
  ["Dashboard", "Browse captured notifications, filter by platform, search", "All notifications displayed correctly, filters work"],
  ["Earnings Tracker", "View daily/weekly/monthly earnings, platform breakdown", "Earnings data calculated correctly from notification values"],
  ["Settings", "Toggle dark mode, adjust sync interval", "Settings persist across app restarts"],
  ["Profile", "Sign in with Google, view subscription status", "Authentication works, profile data loads correctly"],
  ["Export", "Export notification data as CSV", "CSV file generated with correct data, shareable"],
  ["Permissions", "Revoke and re-grant notification access", "App detects permission state, prompts correctly"],
  ["Crash Reporting", "Use app normally for 14 days", "No crashes, hangs, or ANR errors"],
  ["Battery Usage", "Monitor battery consumption over 24 hours", "Minimal battery drain (less than 2% per day)"],
  ["Offline Mode", "Use app without internet, then reconnect", "Cached notifications visible, sync resumes"],
]));

// Section 4
bc.push(heading1("4. Feedback Collection"));
bc.push(bodyPara("Collecting structured feedback from testers is essential for improving the app and demonstrating to Google Play that genuine testing is occurring. Implement multiple feedback channels to make it easy for testers to report issues."));
bc.push(heading2("4.1 Feedback Channels"));
bc.push(bodyPara("Set up the following feedback channels and share them with your testers:"));
bc.push(bullet("Google Play Console In-App Feedback: Enable the in-app feedback button in Play Console settings. Testers can shake their device or tap a button to submit feedback directly."));
bc.push(bullet("Email: Provide a dedicated testing email address. Email is best for detailed bug reports with screenshots and step-by-step reproduction instructions."));
bc.push(bullet("Google Form: Create a structured feedback form with fields for bug type, severity, steps to reproduce, and screenshots."));
bc.push(bullet("WhatsApp/Telegram Group: Create a tester group chat for quick questions, real-time discussion, and informal feedback."));
bc.push(spacer(60));
bc.push(heading2("4.2 Feedback Template"));
bc.push(bodyPara("Provide testers with a structured template to ensure consistent, actionable feedback:"));
bc.push(makeTable(["Field", "Description"], [
  ["Tester Name", "Your name or identifier"],
  ["Date", "Date the issue was observed (YYYY-MM-DD)"],
  ["Feature", "Which feature or screen is affected"],
  ["Bug Type", "Crash / UI Issue / Functional / Performance / Suggestion"],
  ["Severity", "Critical (app unusable) / Major (feature broken) / Minor (cosmetic)"],
  ["Steps to Reproduce", "Detailed steps to trigger the issue"],
  ["Expected Result", "What should have happened"],
  ["Actual Result", "What actually happened"],
  ["Device Info", "Phone model, Android version, app version"],
  ["Screenshots/Video", "Attach visual evidence if possible"],
]));

// Section 5
bc.push(heading1("5. Release Notes"));
bc.push(heading2("5.1 Closed Testing Release Notes (v2.7.0)"));
bc.push(bodyPara("The following release notes should be entered in Play Console when uploading the closed testing AAB:"));
bc.push(spacer(40));
bc.push(new Paragraph({ alignment: AlignmentType.LEFT, indent: { left: 360 }, spacing: { line: 312, after: 60 },
  children: [new TextRun({ text: "Welcome to NotiFetch v2.7.0 - Closed Testing Release", bold: true, size: 22, color: c(P.accent), font: { ascii: "Calibri" } })] }));
bc.push(new Paragraph({ alignment: AlignmentType.LEFT, indent: { left: 360 }, spacing: { line: 312, after: 40 },
  children: [new TextRun({ text: "NEW FEATURES:", bold: true, size: 22, color: c(P.body), font: { ascii: "Calibri" } })] }));
bc.push(bullet("Freemium model with Pro and Premium subscription tiers via Razorpay"));
bc.push(bullet("Earnings tracker for gig workers with daily/weekly/monthly breakdown"));
bc.push(bullet("Platform-wise earnings comparison and payment status tracking"));
bc.push(bullet("CSV export for notification data with Android share sheet integration"));
bc.push(bullet("About section in Settings with app version and update checker"));
bc.push(spacer(40));
bc.push(new Paragraph({ alignment: AlignmentType.LEFT, indent: { left: 360 }, spacing: { line: 312, after: 40 },
  children: [new TextRun({ text: "IMPROVEMENTS:", bold: true, size: 22, color: c(P.body), font: { ascii: "Calibri" } })] }));
bc.push(bullet("Firebase Crashlytics integration for real-time crash reporting"));
bc.push(bullet("Enhanced privacy policy with DPDP Act and GDPR compliance"));
bc.push(bullet("Dark mode preference preserved across app restarts"));
bc.push(bullet("Notification sync respects user preferences on boot"));
bc.push(spacer(40));
bc.push(new Paragraph({ alignment: AlignmentType.LEFT, indent: { left: 360 }, spacing: { line: 312, after: 40 },
  children: [new TextRun({ text: "TESTING FOCUS AREAS:", bold: true, size: 22, color: c(P.body), font: { ascii: "Calibri" } })] }));
bc.push(bullet("Notification capture from Swiggy, Zomato, Amazon, Flipkart, Uber, and other platforms"));
bc.push(bullet("Earnings tracking accuracy and display"));
bc.push(bullet("Subscription purchase flow via Razorpay"));
bc.push(bullet("App stability and battery usage over extended use"));
bc.push(bullet("Export functionality and data accuracy"));

// Section 6
bc.push(heading1("6. Tester Recruitment"));
bc.push(heading2("6.1 Finding 12 Testers"));
bc.push(bodyPara("Recruiting 12 or more testers for a closed test can be challenging, especially for a new app with no existing user base. The following strategies have proven effective for developer accounts that need to meet the closed testing requirement."));
bc.push(heading3("6.1.1 Personal Network"));
bc.push(bodyPara("Start with your personal and professional network. Friends, family, colleagues, and classmates are often the easiest testers to recruit because they have a personal connection to you and are motivated to help. Target people who regularly use delivery apps, as they will provide the most relevant testing feedback. A personal message explaining why you need their help and what they need to do is far more effective than a generic mass email."));
bc.push(heading3("6.1.2 Online Communities"));
bc.push(bodyPara("Post in relevant online communities to find testers who are genuinely interested in the app. Effective platforms include Reddit (r/Android, r/india, r/swiggy), Telegram groups for gig workers, Discord servers for Android developers, and online forums like XDA Developers. When posting, clearly explain what the app does, what testers need to do, and how long the testing period lasts."));
bc.push(heading3("6.1.3 Social Media"));
bc.push(bodyPara("Leverage social media platforms like Twitter/X, LinkedIn, Instagram, and Facebook. Create a short, engaging post that explains the app value and asks for volunteers. Use relevant hashtags like #AndroidTesting, #DeliveryApp, and #GigWorkers to increase visibility. Consider creating a short demo video or screenshot carousel to make the post more engaging."));
bc.push(heading3("6.1.4 Tester Services"));
bc.push(bodyPara("Several online services connect developers with volunteer testers. Platforms like BetaFamily, BetaTesting, and r/AndroidBetaTest on Reddit can help you find experienced testers. Some services charge fees, but the free community-based options are often sufficient for meeting the 12-tester minimum. Be clear about the time commitment (14 days) and the device requirement (Android 7.0+)."));

bc.push(heading2("6.2 Tester Email List Template"));
bc.push(bodyPara("Use the following template to prepare your tester email list for Play Console. You need at least 12 valid Google account email addresses. It is recommended to gather 15-20 testers to account for drop-offs."));
bc.push(makeTable(["#", "Email Address", "Name", "Role", "Status"], [
  ["1", "tester1@gmail.com", "Tester 1", "Primary tester - daily usage", "Pending opt-in"],
  ["2", "tester2@gmail.com", "Tester 2", "Primary tester - daily usage", "Pending opt-in"],
  ["3", "tester3@gmail.com", "Tester 3", "Primary tester - daily usage", "Pending opt-in"],
  ["4", "tester4@gmail.com", "Tester 4", "Primary tester - daily usage", "Pending opt-in"],
  ["5", "tester5@gmail.com", "Tester 5", "Primary tester - daily usage", "Pending opt-in"],
  ["6", "tester6@gmail.com", "Tester 6", "Secondary tester - regular usage", "Pending opt-in"],
  ["7", "tester7@gmail.com", "Tester 7", "Secondary tester - regular usage", "Pending opt-in"],
  ["8", "tester8@gmail.com", "Tester 8", "Secondary tester - regular usage", "Pending opt-in"],
  ["9", "tester9@gmail.com", "Tester 9", "Secondary tester - regular usage", "Pending opt-in"],
  ["10", "tester10@gmail.com", "Tester 10", "Secondary tester - regular usage", "Pending opt-in"],
  ["11", "tester11@gmail.com", "Tester 11", "Backup tester - periodic usage", "Pending opt-in"],
  ["12", "tester12@gmail.com", "Tester 12", "Backup tester - periodic usage", "Pending opt-in"],
  ["13", "tester13@gmail.com", "Tester 13", "Backup tester - overflow", "Pending opt-in"],
  ["14", "tester14@gmail.com", "Tester 14", "Backup tester - overflow", "Pending opt-in"],
  ["15", "tester15@gmail.com", "Tester 15", "Backup tester - overflow", "Pending opt-in"],
]));

// Section 7
bc.push(heading1("7. Pre-Submission Compliance Checklist"));
bc.push(bodyPara("Before and during the closed testing period, ensure the following compliance requirements are met. Each item must be completed to satisfy Google Play policies and ensure a smooth transition to production."));
bc.push(makeTable(["Category", "Item", "Status", "Notes"], [
  ["Store Listing", "App title (30 chars max)", "Done", "NotiFetch: Delivery Tracker"],
  ["Store Listing", "Short description (80 chars max)", "Done", "Track all delivery notifications..."],
  ["Store Listing", "Full description (4000 chars max)", "Done", "See listing.md"],
  ["Store Listing", "App icon (512x512 PNG)", "Done", "Adaptive icon with amber bell"],
  ["Store Listing", "Feature graphic (1024x500)", "Done", "See play-store-assets/"],
  ["Store Listing", "Screenshots (2-8 phone)", "Done", "5 screenshots generated"],
  ["Store Listing", "Category selection", "Done", "Primary: Productivity, Secondary: Business"],
  ["Legal", "Privacy policy URL", "Done", "notifetch.in/privacy"],
  ["Legal", "Data safety section", "Pending", "Must fill in Play Console"],
  ["Legal", "Content rating questionnaire", "Pending", "Everyone - no restricted content"],
  ["Legal", "App content declarations", "Pending", "Digital purchases via Razorpay"],
  ["Technical", "AAB uploaded to closed testing", "Ready", "NotiFetch-v2.7.0-vc23-release.aab"],
  ["Technical", "Release notes entered", "Ready", "See Section 5"],
  ["Technical", "Crashlytics mapping file", "Ready", "Included with AAB"],
  ["Technical", "Signing key fingerprint", "Done", "SHA-256: 8D:30:53:71:82:93:57:32:26:76..."],
  ["Testing", "12+ testers opted-in", "Pending", "Recruit and onboard testers"],
  ["Testing", "14-day test period completed", "Pending", "Starts after 12 opt-ins"],
  ["Testing", "No critical crashes during test", "Pending", "Monitor Crashlytics dashboard"],
  ["Testing", "Feedback collected and reviewed", "Pending", "Use structured feedback template"],
]));

// Section 8
bc.push(heading1("8. Post-Testing: Moving to Production"));
bc.push(heading2("8.1 Applying for Production Access"));
bc.push(bodyPara("Once the 14-day closed testing period is complete and all requirements are met, you can apply for production access through Google Play Console. The process involves navigating to your app dashboard and selecting the option to promote your closed testing release to production. Google will review your app for compliance with their policies before approving it. This review typically takes 1-3 business days but can take longer during peak periods."));
bc.push(bodyPara("Before applying for production access, ensure that your closed test did not reveal any critical or major bugs that remain unfixed. If testers reported significant issues, address those first, upload a new version, and run another test cycle. While Google does not require a perfect app for production, unresolved critical issues will result in rejection during the production review."));
bc.push(heading2("8.2 Production Release Checklist"));
bc.push(bodyPara("When you are ready to promote the app to production, work through this final checklist:"));
bc.push(numberedItem(1, "Verify all 12+ testers completed the full 14-day testing period"));
bc.push(numberedItem(2, "Review and address all critical and major bug reports from testers"));
bc.push(numberedItem(3, "Ensure the store listing is complete with all required assets"));
bc.push(numberedItem(4, "Confirm the privacy policy is live and accessible at the declared URL"));
bc.push(numberedItem(5, "Complete the Data Safety section in Play Console with accurate disclosures"));
bc.push(numberedItem(6, "Fill in the content rating questionnaire with correct responses"));
bc.push(numberedItem(7, "Review and submit the app content declarations (digital purchases)"));
bc.push(numberedItem(8, "Promote the closed testing release to production or upload a new AAB"));
bc.push(numberedItem(9, "Set pricing and distribution countries"));
bc.push(numberedItem(10, "Submit for Google Play review and approval"));
bc.push(spacer(60));
bc.push(tipBox("Keep your closed testing track active even after going to production. It serves as a staging environment for future updates, allowing you to test new features with a smaller group before rolling them out to all users."));

// COVER
var coverSection = {
  properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 0, bottom: 0, left: 0, right: 0 } } },
  children: [
    new Table({ width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
      rows: [new TableRow({ height: { value: 16838, rule: "exact" }, children: [new TableCell({
        width: { size: 100, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: c(P.cover.bg) },
        verticalAlign: "top",
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
        children: [
          spacer(4000),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 900, lineRule: "atLeast" },
            children: [new TextRun({ text: "NotiFetch", size: 80, bold: true, color: c(P.cover.titleColor), font: { ascii: "Calibri", eastAsia: "SimHei" } })] }),
          spacer(200),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 500, lineRule: "atLeast" },
            children: [new TextRun({ text: "Closed Testing Guide", size: 44, color: c(P.cover.subtitleColor), font: { ascii: "Calibri", eastAsia: "SimHei" } })] }),
          spacer(100),
          new Paragraph({ alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Google Play Store Requirement Compliance", size: 24, color: c(P.cover.metaColor), font: { ascii: "Calibri" } })] }),
          spacer(2400),
          new Paragraph({ alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Version 2.7.0  |  June 2026", size: 22, color: c(P.cover.footerColor), font: { ascii: "Calibri" } })] }),
          spacer(100),
          new Paragraph({ alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "notifetch.in", size: 22, color: c(P.accent), font: { ascii: "Calibri" } })] }),
        ]
      })] })] }),
  ]
};

var doc = new Document({
  styles: { default: { document: {
    run: { font: { ascii: "Calibri", eastAsia: "Microsoft YaHei" }, size: 22, color: c(P.body) },
    paragraph: { spacing: { line: 312 } },
  }}},
  sections: [
    coverSection,
    { properties: { page: {
      size: { width: 11906, height: 16838 },
      margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
      pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
    }},
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "NotiFetch Closed Testing Guide  |  ", size: 16, color: "A0A0A0", font: { ascii: "Calibri" } }),
        new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "A0A0A0", font: { ascii: "Calibri" } }),
      ] })] }) },
    children: bc }
  ]
});

Packer.toBuffer(doc).then(function(buffer) {
  fs.writeFileSync("/home/z/my-project/download/NotiFetch-Closed-Testing-Guide.docx", buffer);
  console.log("Document generated successfully!");
}).catch(function(err) { console.error("Error:", err); process.exit(1); });
