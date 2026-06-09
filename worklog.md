---
Task ID: 1
Agent: Main Agent
Task: Prepare NotiFetch v2.1.0 for Google Play Store submission

Work Log:
- Verified keystore at twa/keystore.jks with SHA-256 fingerprint 81:97:95:57:6B:2F:1C:94:D2:7A:6B:63:E2:3C:7C:C7:D8:58:50:CB:CA:A1:E5:00:7A:23:BB:3B:44:DD:AB:FE
- Identified google-services.json as placeholder — Firebase setup required before FCM/Auth will work
- Made FirebaseModule.kt graceful — app won't crash with placeholder Firebase config
- Bumped version to versionCode=3, versionName="2.1.0" in build.gradle.kts
- Updated ProfileScreen.kt to use BuildConfig.VERSION_NAME dynamically
- Added network_security_config.xml (TLS-only, Play Store requirement for API 24+)
- Added PROPERTY_SPECIAL_USE_FGS_SUBTYPE to manifest for foreground service declaration
- Added detailed manifest comments explaining notification listener purpose for Play Store reviewers
- Committed and pushed all changes to GitHub (commit 8a8f94c)
- Generated comprehensive 14-page Play Store Submission Guide PDF with:
  - Pre-submission checklist
  - Firebase project setup (step-by-step with SHA-256)
  - AAB build instructions
  - Google Play Console setup
  - Store listing content (title, descriptions, screenshots)
  - Data Safety declarations
  - Content Rating questionnaire answers
  - Legal compliance URLs
  - Upload and review process
  - Quick reference table

Stage Summary:
- Code changes committed and pushed to GitHub
- Play Store Submission Guide PDF saved at /home/z/my-project/download/NotiFetch-PlayStore-Submission-Guide.pdf
- Next step: User must create Firebase project, set keystore passwords, build AAB on their machine with Android Studio
