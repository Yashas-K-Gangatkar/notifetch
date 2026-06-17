# 🔒 NotiFetch — Play Store Upload Keystore Credentials

> **CRITICAL BACKUP FILE — STORE IN 2+ SECURE LOCATIONS**
>
> If you lose the keystore OR the password, you CANNOT update your existing
> Play Store listing. Google's upload key reset takes 1-3 business days.

---

## Keystore File

| Property | Value |
|----------|-------|
| **Filename** | `keystore.jks` |
| **Type** | PKCS12 |
| **Size** | 2,766 bytes |
| **Created** | Jun 8, 2026 |
| **Valid until** | Jun 2, 2051 (25-year validity) |

## Credentials

| Property | Value |
|----------|-------|
| **Store password** | `changeme_notifetch_store_2024` |
| **Key alias** | `notifetch` |
| **Key password** | `changeme_notifetch_store_2024` (same as store password) |

## Certificate Fingerprints

| Hash | Value |
|------|-------|
| **SHA-1** | `59:70:88:1E:B8:0B:CE:1B:F4:A8:0E:D2:35:C4:06:3E:99:89:F5:ED` |
| **SHA-256** | `B3:93:B5:CF:4D:C0:B5:C2:6F:96:7B:63:BE:41:A8:D6:7D:C7:06:17:92:27:32:C6:D1:AF:66:75:BB:29:75:7E` |

## Certificate Owner

```
CN=NotiFetch, OU=Engineering, O=NotiFetch, L=Mumbai, ST=Maharashtra, C=IN
```

## Algorithm

- Signature: SHA384withRSA
- Key: 2048-bit RSA

---

## 🛡️ Backup Recommendations

Store this file (`keystore.jks`) AND this credentials document in **at least 2** of:

1. **Password manager** (1Password, Bitwarden, LastPass) — store as a secure note with the keystore file attached
2. **Encrypted cloud storage** (Google Drive, Dropbox) — put both files in an encrypted zip first
3. **Hardware USB drive** (encrypted) — physical offline backup
4. **Email to yourself** ( Gmail with 2FA) — last resort

## 🚨 If You Lose This Keystore

1. You CANNOT push updates to your existing Play Store listing (`com.notifetch.app`)
2. Recovery options:
   - **Play Console upload key reset**: Play Console → App integrity → Request upload key reset (1-3 business days, Google support reviews)
   - **New listing**: Create a brand new app with a new package name (you'd lose all installs/reviews)

## ✅ Verification Command

To verify the keystore is intact at any time:

```bash
keytool -list -keystore keystore.jks -storepass changeme_notifetch_store_2024
```

Expected output should show:
```
Keystore type: PKCS12
Your keystore contains 1 entry
notifetch, Jun 8, 2026, PrivateKeyEntry,
Certificate fingerprint (SHA-256): B3:93:B5:CF:4D:C0:B5:C2:6F:96:7B:63:BE:41:A8:D6:7D:C7:06:17:92:27:32:C6:D1:AF:66:75:BB:29:75:7E
```

## 📦 Using The Keystore (For Future Builds)

The build script `notifetch-android/build-playstore.sh` automatically:
1. Looks for `upload/keystore.jks` (this file)
2. Uses the env vars `NOTIFETCH_STORE_PASSWORD`, `NOTIFETCH_KEY_ALIAS`, `NOTIFETCH_KEY_PASSWORD`
3. Defaults to the credentials above if env vars are not set

To rebuild the AAB in the future:
```bash
# 1. Place keystore at: /home/z/my-project/upload/keystore.jks
# 2. Run:
cd /home/z/my-project/notifetch-android
JAVA_HOME=/home/z/my-project/jdk21 bash build-playstore.sh
```

---

**Generated**: 2026-06-17
**Project**: NotiFetch (com.notifetch.app)
**GitHub**: https://github.com/Yashas-K-Gangatkar/d2
**Live site**: https://notifetch.in
