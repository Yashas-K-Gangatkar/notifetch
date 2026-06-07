# NotiFetch Privacy Policy

**Last Updated: March 4, 2026**
**Effective Date: March 4, 2026**

---

NotiFetch ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and web service (collectively, the "Service"), available at [https://d2-liart-nine.vercel.app](https://d2-liart-nine.vercel.app) and as a Trusted Web Activity (TWA) on the Google Play Store.

Please read this privacy policy carefully. By using NotiFetch, you agree to the collection and use of information in accordance with this policy.

---

## 1. Information We Collect

### 1.1 Information You Provide

| Data Type | Purpose | Required |
|-----------|---------|----------|
| **Email address** | Account creation, authentication, and communication | Yes |
| **Display name** | Personalization of your dashboard | No |
| **Payment information** | Premium subscription purchases (processed by Razorpay — we do not store card details) | Only for premium features |

### 1.2 Information Collected Automatically

| Data Type | Purpose | How Collected |
|-----------|---------|---------------|
| **FCM (Firebase Cloud Messaging) token** | Delivering push notifications to your device | Automatically generated when you enable notifications |
| **Notification metadata** | Organizing and displaying your delivery notifications | Via Android Notification Listener Service (see Section 2) |
| **Device information** | App optimization and crash reporting | Automatically collected (device model, OS version, app version) |
| **Usage analytics** | Understanding feature usage and improving the Service | Anonymized and aggregated via Firebase Analytics |

### 1.3 Information We Do NOT Collect

We want to be explicit about what we **never** collect:

- ❌ **Delivery platform login credentials** — We never ask for, collect, or store your passwords, API keys, or login tokens for Swiggy, Zomato, Amazon, Flipkart, or any other delivery platform
- ❌ **Payment card details** — All payment processing is handled by Razorpay; we never see or store your full card number, CVV, or bank details
- ❌ **SMS messages** — We do not read, collect, or process your SMS messages
- ❌ **Contacts** — We do not access your contact list
- ❌ **Location data** — We do not track your GPS location
- ❌ **Call logs** — We do not access your phone calls
- ❌ **Photos or media** — We do not access your camera, gallery, or media files
- ❌ **Browser history** — We do not track your browsing activity outside the Service

---

## 2. Notification Listener Service Usage

### 2.1 How It Works

NotiFetch uses Android's **Notification Listener Service** (`NotificationListenerService`) to capture and organize delivery-related notifications from other apps installed on your device. This is a core feature of the Service.

### 2.2 What We Capture

When you grant notification access permission, NotiFetch reads the following from incoming notifications:

- **Notification text content** (title, body, summary text)
- **Source application** (e.g., Swiggy, Amazon, Zomato)
- **Timestamp** of the notification
- **Category** (if provided by the source app)

### 2.3 What We Do NOT Capture

- ❌ Notification actions or button responses
- ❌ Notification reply text that you type
- ❌ Sensitive notifications from banking, health, or authentication apps — we filter these out
- ❌ Content from notifications marked as `FLAG_SECURITY` or containing sensitive categories

### 2.4 User Control

- **Permission is optional** — You can use NotiFetch without granting notification access (with limited functionality)
- **Revocable** — You can revoke notification access at any time from Android Settings → Apps → NotiFetch → Notification access
- **Transparent** — All captured notifications are visible to you in the app dashboard
- **Deletable** — You can delete any captured notification from your history at any time

---

## 3. How We Use Your Information

We use the information we collect for the following purposes:

| Purpose | Data Used | Legal Basis |
|---------|-----------|-------------|
| **Provide the Service** | Email, notification metadata, FCM token | Contract performance |
| **Send push notifications** | FCM token, notification preferences | Consent |
| **Earnings tracking** | Notification metadata from delivery platforms | Contract performance |
| **Account management** | Email, display name | Contract performance |
| **Process payments** | Email, Razorpay transaction ID | Contract performance |
| **Improve the Service** | Anonymized usage analytics, crash reports | Legitimate interest |
| **Customer support** | Email, account details | Legitimate interest |
| **Security and fraud prevention** | Device info, access logs | Legitimate interest |
| **Legal compliance** | As required by law | Legal obligation |

---

## 4. Data Storage and Security

### 4.1 Storage

- **Primary database**: Hosted on **Neon** (serverless PostgreSQL) with encryption at rest
- **Application hosting**: Hosted on **Vercel** with automatic HTTPS/TLS encryption
- **File storage**: No file uploads are stored by the Service

### 4.2 Security Measures

- All data in transit is encrypted using **TLS 1.3**
- All data at rest is encrypted using **AES-256**
- Authentication tokens are stored securely and never exposed to client-side code
- API endpoints are protected with rate limiting and input validation
- Regular security audits are performed on the infrastructure

### 4.3 Data Retention

| Data Type | Retention Period |
|-----------|-----------------|
| Account information | Until account deletion |
| Notification metadata | Until you delete it, or account deletion |
| Earnings records | Until you delete them, or account deletion |
| FCM tokens | Until you disable notifications or delete your account |
| Payment records (transaction IDs) | As required by financial regulations (typically 5 years) |
| Analytics data (anonymized) | Up to 26 months |
| Crash reports | Up to 90 days |

### 4.4 Data Residency

Our primary infrastructure is hosted in the following regions:
- **Vercel**: Global edge network (primary: ap-south-1)
- **Neon Database**: ap-south-1 (Mumbai, India)
- **Firebase**: us-central1 (Iowa, United States)

---

## 5. Third-Party Services

NotiFetch integrates with the following third-party services. Each has their own privacy policy:

### 5.1 Vercel (Application Hosting)
- **Purpose**: Web application hosting and serverless API functions
- **Data processed**: Application code, API request/response data
- **Privacy policy**: [https://vercel.com/legal/privacy-policy](https://vercel.com/legal/privacy-policy)
- **Compliance**: SOC 2 Type II, GDPR

### 5.2 Neon (Database Hosting)
- **Purpose**: Serverless PostgreSQL database for data storage
- **Data processed**: All user data stored in the database
- **Privacy policy**: [https://neon.tech/privacy](https://neon.tech/privacy)
- **Compliance**: SOC 2 Type II, GDPR

### 5.3 Firebase / Google (Analytics & Push Notifications)
- **Purpose**: Push notifications (FCM), analytics, crash reporting
- **Data processed**: FCM tokens, anonymized usage data, crash reports
- **Privacy policy**: [https://policies.google.com/privacy](https://policies.google.com/privacy)
- **Compliance**: GDPR, CCPA, SOC 2/3

### 5.4 Razorpay (Payment Processing)
- **Purpose**: Processing premium subscription payments
- **Data processed**: Payment transaction data (we only receive transaction ID and status)
- **Privacy policy**: [https://razorpay.com/privacy/](https://razorpay.com/privacy/)
- **Compliance**: PCI DSS Level 1, RBI compliant, GDPR

### 5.5 Google Play Services (Android TWA)
- **Purpose**: Trusted Web Activity container for the Android app
- **Data processed**: App launch data, Digital Asset Links verification
- **Privacy policy**: [https://policies.google.com/privacy](https://policies.google.com/privacy)

We do **not** sell, rent, or share your personal data with any third parties for their own marketing purposes.

---

## 6. Your Rights

### 6.1 GDPR Rights (European Economic Area)

If you are a resident of the European Economic Area (EEA), you have the following rights under the General Data Protection Regulation (GDPR):

| Right | Description |
|-------|-------------|
| **Right to Access** | Request a copy of the personal data we hold about you |
| **Right to Rectification** | Request correction of inaccurate or incomplete data |
| **Right to Erasure** | Request deletion of your personal data ("right to be forgotten") |
| **Right to Restrict Processing** | Request that we limit how we use your data |
| **Right to Data Portability** | Receive your data in a structured, commonly used format |
| **Right to Object** | Object to our processing of your personal data |
| **Right to Withdraw Consent** | Withdraw consent at any time where processing is based on consent |

To exercise any of these rights, contact us at **privacy@notifetch.app**. We will respond to your request within 30 days.

### 6.2 CCPA Rights (California Residents)

If you are a California resident, you have the following rights under the California Consumer Privacy Act (CCPA):

| Right | Description |
|-------|-------------|
| **Right to Know** | Know what personal information we collect, use, and disclose |
| **Right to Delete** | Request deletion of your personal information |
| **Right to Opt-Out** | Opt out of the sale of your personal information (we do not sell your data) |
| **Right to Non-Discrimination** | Not be discriminated against for exercising your privacy rights |

**Notice at Collection**: We collect the categories of personal information described in Section 1 of this policy.

**We do not sell personal information.** We have never sold personal information and will not sell it in the future.

To exercise your CCPA rights, contact us at **privacy@notifetch.app**.

### 6.3 Other Jurisdictions

If you are located outside the EEA and California, you may still have data protection rights under your local laws. Please contact us and we will endeavor to accommodate your request.

---

## 7. Data Deletion

### 7.1 Deleting Specific Data

You can delete specific data within the app:
- **Individual notifications**: Swipe to delete or long-press → Delete
- **Earnings records**: Delete from the Earnings dashboard
- **Platform filters**: Remove from Settings

### 7.2 Account Deletion

To delete your entire account and all associated data:

1. Open NotiFetch → Settings → Account → Delete Account
2. Or email us at **privacy@notifetch.app** with the subject "Account Deletion Request"

Upon account deletion:
- Your email and profile information are permanently deleted
- All notification metadata is permanently deleted
- All earnings records are permanently deleted
- Your FCM token is deregistered
- Deletion is **irreversible** — we cannot recover your data after deletion

We process account deletion requests within **7 business days**.

---

## 8. Children's Privacy

NotiFetch is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete that information promptly.

If you believe a child under 13 has provided us with personal information, please contact us at **privacy@notifetch.app**.

---

## 9. International Data Transfers

Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that are different from the laws of your country.

We ensure appropriate safeguards are in place for international transfers:
- **Standard Contractual Clauses (SCCs)**: Used for transfers from the EEA
- **Adequacy decisions**: Where applicable, we rely on EU adequacy decisions
- **Encryption**: All data is encrypted in transit and at rest, regardless of location

---

## 10. Cookies and Tracking

NotiFetch uses minimal cookies and tracking technologies:

| Type | Purpose | Duration |
|------|---------|----------|
| **Authentication cookies** | Maintain your login session | Session / 30 days |
| **CSRF tokens** | Security protection against cross-site request forgery | Session |
| **Firebase Analytics** | Anonymized usage analytics (can be disabled in Settings) | Persistent (anonymized) |

We do **not** use:
- ❌ Advertising cookies or trackers
- ❌ Cross-app tracking identifiers
- ❌ Third-party marketing pixels
- ❌ Social media tracking

---

## 11. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. When we do, we will:

1. Update the "Last Updated" date at the top of this policy
2. Notify you via email for material changes
3. Notify you via in-app notification for significant changes
4. Obtain your consent if required by law

We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.

---

## 12. Contact Information

If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

| Channel | Details |
|---------|---------|
| **Email (Privacy)** | privacy@notifetch.app |
| **Email (Support)** | support@notifetch.app |
| **Website** | [https://d2-liart-nine.vercel.app](https://d2-liart-nine.vercel.app) |
| **Mailing Address** | NotiFetch, [Address to be provided] |

### Data Protection Officer

For GDPR-related inquiries, our Data Protection Officer can be reached at:
**dpo@notifetch.app**

### Supervisory Authority

If you are in the EEA and believe your data protection rights have been violated, you have the right to lodge a complaint with your local supervisory authority.

---

## 13. Legal Basis for Processing (GDPR)

We process your personal data under the following legal bases as defined by Article 6 of the GDPR:

| Processing Activity | Legal Basis | Article 6 Basis |
|---------------------|-------------|-----------------|
| Account creation and management | Contract performance | 6(1)(b) |
| Notification capture and display | Contract performance | 6(1)(b) |
| Earnings tracking and display | Contract performance | 6(1)(b) |
| Push notifications | Consent | 6(1)(a) |
| Payment processing | Contract performance | 6(1)(b) |
| Analytics and service improvement | Legitimate interest | 6(1)(f) |
| Security and fraud prevention | Legitimate interest | 6(1)(f) |
| Legal compliance | Legal obligation | 6(1)(c) |

---

## 14. Automated Decision-Making

We do **not** use automated decision-making or profiling that produces legal or similarly significant effects. All data processing is for the purposes described in this policy and does not involve automated decisions about you.

---

*This Privacy Policy is effective as of the date stated above and applies to all users of NotiFetch.*

© 2024–2026 NotiFetch. All rights reserved.
