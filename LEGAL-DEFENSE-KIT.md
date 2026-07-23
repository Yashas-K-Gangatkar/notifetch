# NotiFetch — Legal Defense Kit

> **CONFIDENTIAL LEGAL DOCUMENT — NOT FOR PUBLIC DISTRIBUTION**

## 1. Threat Assessment

| Threat | Probability | Impact | Risk Level | Mitigation |
|--------|------------|--------|------------|------------|
| Cease & desist from Swiggy/Zomato | HIGH | HIGH | CRITICAL | Nominative fair use + user choice model |
| Google Play suspension | MEDIUM | CRITICAL | CRITICAL | Opt-in sync + APK backup + appeal ready |
| Trademark infringement lawsuit | LOW | HIGH | HIGH | Section 30 Trade Marks Act + disclaimers |
| Data privacy complaint (DPDP) | LOW | MEDIUM | MEDIUM | Privacy policy + data deletion + 90-day retention |

## 2. Legal Foundation

### Indian Law
- **Trade Marks Act, 1999 — Section 30**: Limits on effect of registered trademark (nominative fair use)
- **IT Act, 2000 — Section 43A**: Reasonable security practices
- **DPDP Act, 2023**: Personal data protection compliance
- **Copyright Act, 1957 — Section 52**: Fair dealing for identification

### US Law (Play Store/global users)
- **Lanham Act, 15 U.S.C. § 1115(b)(4)**: Nominative fair use defense
- **DMCA**: Safe harbor for user-initiated content

### Key Case Law
- *New Kids on the Block v. News America Publishing* (1992) — Nominative fair use test
- *Playboy Enterprises v. Welles* (2002) — Fair use for identification
- *Toyota Motor Sales v. Tabari* (2001) — Trademark to describe product is fair use

## 3. Defense: Trademark Claims

### Nominative Fair Use Test (3 prongs)
1. ✅ Product not identifiable without trademark (users need to know notification source)
2. ✅ Only text name used (no logos, no brand colors)
3. ✅ No suggestion of sponsorship (explicit disclaimers everywhere)

### User Choice Model (KILLER defense)
- Users can rename ALL platforms in Settings
- NotiFetch doesn't mandate any trademark — user chooses
- Under intermediary liability principles, we're not liable for user-chosen content

## 4. Defense: Terms of Service Violations

**Key argument:** "NotiFetch does not access, scrape, or interact with any delivery platform's application, servers, or APIs. NotiFetch uses Google's Notification Listener Service API — a legitimate Android system feature. The user explicitly grants this permission. NotiFetch only displays notifications the user has already received."

### Precedent
- IFTTT/Zapier — Read notifications/emails from third-party apps, still operating
- Pushbullet — Reads all notifications, still on Play Store after 10 years
- Google's own "Notification History" — Android 11+ built-in feature

## 5. Defense: Google Play Policy

### Compliance Checklist
- ✅ Core functionality: Notification aggregation (clear user benefit)
- ✅ User-initiated permission: User grants access via Android Settings
- ✅ Server sync is OPT-IN (OFF by default since v2.9.86)
- ✅ Data deletion available (Settings → Delete Account)
- ✅ Privacy policy accessible from app + Play Store
- ✅ "Not affiliated" disclaimers throughout
- ✅ APK distribution ready (notifetch.in/download)

### If Suspended
1. **0-2h**: Screenshot notice, file appeal
2. **2-24h**: Launch APK distribution, notify WhatsApp community
3. **1-7d**: Submit to Amazon Appstore, Samsung Galaxy Store
4. **If needed**: Legal notice to Google India, CCI complaint

## 6. Response Templates

### Cease & Desist Response (excerpt)
> "NotiFetch denies all allegations of trademark infringement. Our use of your client's marks falls within the doctrine of nominative fair use, as recognized under Section 30 of the Trade Marks Act, 1999 (India) and 15 U.S.C. § 1115(b)(4) (United States). NotiFetch uses Android's Notification Listener Service — a legitimate Google-provided API — to display notifications the user has already received. We do not access your client's applications, APIs, or servers."

### Google Play Appeal (excerpt)
> "NotiFetch complies with all Google Play policies. Server sync is OFF by default (opt-in only). Users are clearly informed what data is collected. The app includes explicit disclaimers. We request reinstatement and are happy to make any necessary changes."

## 7. Technical Safeguards
- ✅ Only notification text stored (no credentials, OTPs, payment info)
- ✅ 90-day automatic deletion
- ✅ User can delete all data instantly
- ✅ Server sync opt-in (not opt-out)
- ✅ APK distribution as Play Store backup

## 8. Emergency Contacts
- Founder: yashask2006@gmail.com
- Support: support@notifetch.app
- Legal inquiries: legal@notifetch.app
- Google Play: Play Console Help Center

## 9. Insurance Recommendations
- Cyber Liability Insurance (₹10-50L coverage)
- Professional Indemnity Insurance
- Providers: HDFC ERGO, ICICI Lombard, Bajaj Allianz
- Estimated cost: ₹15,000-30,000/year

## 10. Compliance Checklist
- [ ] Register trademark "NotiFetch" (₹6,500, ipindia.gov.in)
- [ ] Get GST registration (if revenue > ₹20L/year)
- [ ] Sign DPAs with Vercel, Neon, Firebase
- [ ] Get Cyber Liability Insurance
- [ ] Appoint Data Protection Officer (founder for now)
- [ ] Create data breach response plan

---
*This document is confidential. Review with a licensed lawyer before any legal action. Contact Nishith Desai Associates, Khaitan & Co, or Cyril Amarchand Mangaldas for technology law expertise.*
