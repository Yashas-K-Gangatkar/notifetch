# Digital Asset Links — `assetlinks.json`

## What is `assetlinks.json`?

The `assetlinks.json` file is part of Google's **Digital Asset Links** protocol. It establishes a verified association between your Android app (the NotiFetch TWA) and your website (https://d2-liart-nine.vercel.app).

When a Trusted Web Activity (TWA) launches, Chrome verifies that the website's `.well-known/assetlinks.json` file contains the SHA-256 fingerprint of the Android app's signing certificate. If the fingerprint matches, Chrome removes the browser UI (address bar, etc.) and displays the web app as a native Android application.

**Without a valid `assetlinks.json`, the TWA will show Chrome's address bar and custom tabs UI instead of running in full-screen mode.**

## Current Status

⚠️ **PLACEHOLDER** — The current `assetlinks.json` contains a placeholder fingerprint. You **must** replace it with the actual SHA-256 fingerprint of your app signing key before submitting to the Google Play Store.

## How to Generate the Signing Key

### Step 1: Generate a Keystore

```bash
keytool -genkeypair \
  -v \
  -keystore twa/keystore.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 25 \
  -alias notifetch \
  -storepass <YOUR_STORE_PASSWORD> \
  -keypass <YOUR_KEY_PASSWORD>
```

When prompted:
- **Name**: Your name or organization
- **Organizational Unit**: Engineering
- **Organization**: NotiFetch
- **City**: Your city
- **State**: Your state
- **Country Code**: Your 2-letter country code

> **Important**: Back up `keystore.jks` securely. If you lose this file, you will NOT be able to update your app on the Play Store. Store the passwords in a secure vault (e.g., 1Password, Bitwarden).

### Step 2: Get the SHA-256 Fingerprint

```bash
keytool -list \
  -v \
  -keystore twa/keystore.jks \
  -alias notifetch \
  -storepass <YOUR_STORE_PASSWORD>
```

This will output something like:

```
Certificate fingerprints:
   SHA1: AB:CD:EF:12:34:56:...
   SHA256: 14:6D:E9:83:B5:EF:1A:B2:...
```

Copy the **SHA256** value.

### Step 3: Update `assetlinks.json`

Replace the placeholder fingerprint with the actual SHA-256 value. Remove the colons and use the full colon-separated format:

```json
{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.notifetch.app",
    "sha256_cert_fingerprints": [
      "14:6D:E9:83:B5:EF:1A:B2:..."
    ]
  }
}
```

### Step 4: Verify the Asset Links

After deploying the updated `assetlinks.json` to your website, verify it works:

1. **Google Asset Links Tester**: https://developers.google.com/digital-asset-links/tools/generator
2. **API Check**: `https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://d2-liart-nine.vercel.app&relation=delegate_permission/common.handle_all_urls`

Both should confirm the link is valid.

## Important Notes

- **This file MUST be served over HTTPS** at `https://d2-liart-nine.vercel.app/.well-known/assetlinks.json`
- **Content-Type** must be `application/json`
- **No redirects** — the file must be served directly (no 301/302 redirects)
- **Play Store vs. Debug**: If you use different signing keys for debug and release, you can include multiple fingerprints in the `sha256_cert_fingerprints` array
- **Google Play App Signing**: If you use Google Play App Signing, Google re-signs your app with their own key. You must use **Google's signing key fingerprint**, not your upload key. Find it in the Play Console under **Release → Setup → App integrity**

## Before Play Store Submission Checklist

- [ ] Generate production keystore (`twa/keystore.jks`)
- [ ] Obtain SHA-256 fingerprint from keystore
- [ ] Update `assetlinks.json` with real fingerprint
- [ ] Deploy updated `assetlinks.json` to production website
- [ ] Verify with Google's Asset Links tool
- [ ] If using Google Play App Signing, update fingerprint to match Google's key
- [ ] Test TWA on a real Android device — address bar should be hidden
