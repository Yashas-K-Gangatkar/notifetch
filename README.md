# NotiFetch

Passive-income Android app that captures delivery-platform notifications (Swiggy, Zomato, Domino's, etc.), aggregates them, and sells anonymized data as market intelligence. Users earn virtual points convertible to cash when monetization launches.

## Architecture

- **Web:** Next.js 16 + TypeScript + Tailwind + shadcn/ui, hosted on Vercel (`notifetch.in`)
- **Android:** Kotlin + Jetpack Compose + Room + Hilt, package `com.notifetch.app`
- **Auth:** Firebase (Android) + NextAuth (Web); email/OTP works, Google login needs setup
- **DB:** Postgres via Prisma (`prisma/schema.prisma`)
- **Repo:** `github.com/Yashas-K-Gangatkar/d2`

## Quick Start (Web)

```bash
npm install
npx prisma generate
npx prisma db push    # apply schema to Postgres
npm run dev           # http://localhost:3000
```

## Quick Start (Android)

See `notifetch-android/README.md` for full setup. TL;DR:

```bash
cd notifetch-android
bash build-playstore.sh    # builds signed AAB for Play Store
./gradlew :app:assembleDebug    # debug APK for testing
```

## Environment Variables

### Web (Vercel)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Postgres connection string (`postgresql://user:pass@host:port/db`) |
| `NEXTAUTH_SECRET` | ✅ | Random 32+ char string — `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ | `https://notifetch.in` (production) or `http://localhost:3000` (dev) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ | Firebase project API key (Android + Web share project) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ | `xxx.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ | `xxx.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Numeric sender ID from Firebase console |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ | Web app ID from Firebase console |
| `FIREBASE_CLIENT_EMAIL` | ✅ | Service account email from Firebase Admin SDK JSON |
| `FIREBASE_PRIVATE_KEY` | ✅ | Service account private key (with `\n` escapes) |
| `GOOGLE_CLIENT_ID` | ⚠️ | Google OAuth client ID (for Google login — currently broken) |
| `GOOGLE_CLIENT_SECRET` | ⚠️ | Google OAuth client secret |
| `RESEND_API_KEY` | ⚠️ | Resend API key for email OTP delivery |
| `ADMIN_SECRET` | 🔴 | Random string protecting `/api/admin/*` — **CURRENTLY NOT SET, admin routes are blocked** |
| `RAZORPAY_KEY_ID` | ⚠️ | Razorpay payment gateway key ID |
| `RAZORPAY_KEY_SECRET` | ⚠️ | Razorpay payment gateway secret |
| `RAZORPAY_WEBHOOK_SECRET` | ⚠️ | Razorpay webhook verification secret |

### Android (`google-services.json`)

Place at `notifetch-android/app/google-services.json`. The current version has 5 SHA-1 fingerprints registered:
- Debug (auto-generated)
- Release upload key (`59:70:88:1E:B8:0B:CE:1B:F4:A8:0E:D2:35:C4:06:3E:99:89:F5:ED`)
- Plus 3 additional SHA-1s for CI/test environments

### Build-time (GitHub Actions / local)

| Variable | Description |
|---|---|
| `NOTIFETCH_KEYSTORE_PATH` | Absolute path to `keystore.jks` (Play Store upload key). If unset, defaults to `../upload/keystore.jks` relative to `notifetch-android/` |
| `NOTIFETCH_STORE_PASSWORD` | Keystore password (default: `changeme_notifetch_store_2024`) |
| `NOTIFETCH_KEY_ALIAS` | Key alias inside keystore (default: `notifetch`) |
| `NOTIFETCH_KEY_PASSWORD` | Key password (default: same as store password) |

## CI/CD

GitHub Actions workflows live in `.github/workflows/`:

- **`web-ci.yml`** — runs on every PR touching `src/` or `prisma/`. Lint + TypeScript check + Next.js build
- **`android-ci.yml`** — runs on every PR touching `notifetch-android/`. Kotlin compile (debug + release) + lint + debug APK build
- **`pr-sanity-check.yml`** — runs on every PR. Warns if commit message mentions files that weren't actually changed (catches "fake commits")

## Pending Setup (requires manual action)

| Task | Where | Why |
|---|---|---|
| Set `ADMIN_SECRET` env var on Vercel | Vercel dashboard | Admin API routes are blocked until this is set |
| Set `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` on Vercel | Vercel dashboard + Google Cloud Console | Google login on web is currently broken |
| Verify `notifetch.in` domain in Resend | Resend dashboard + DNS | Email OTPs may land in spam |
| Add Google OAuth redirect URI for Android | Google Cloud Console | Google login on Android was removed (broken) |
| Configure branch protection on `main` | GitHub repo settings | Require PR review + status checks before merge |
| Set up Postgres daily backups | Vercel/Neon dashboard | Currently no automated backups |

## License

Proprietary. See `LICENSE` (if present) or contact the repo owner.
