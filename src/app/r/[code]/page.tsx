import { redirect } from "next/navigation";

/**
 * /r/[code] — Referral deep link handler
 *
 * When a user clicks a referral link (notifetch.in/r/NF-ABC123),
 * this page redirects to the Play Store with the referral code.
 *
 * On Android, it tries to open the app via intent first, then falls
 * back to the Play Store.
 *
 * On desktop, it redirects to the homepage.
 */

export default async function ReferralPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  // Validate the referral code format (NF-XXXXXX)
  const isValidCode = /^[A-Z0-9\-]{4,20}$/i.test(code);

  if (!isValidCode) {
    redirect("/");
  }

  const playStoreUrl = `https://play.google.com/store/apps/details?id=com.notifetch.app&referrer=${encodeURIComponent(`referral_code=${code}`)}`;
  const homepageUrl = "/?ref=" + encodeURIComponent(code);

  return (
    <html>
      <head>
        <title>NotiFetch — You&apos;ve been invited!</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="refresh" content={`0; url=${playStoreUrl}`} />
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg, #FF5A1F 0%, #F59E0B 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
          }
          .container {
            max-width: 400px;
            background: rgba(255,255,255,0.1);
            border-radius: 24px;
            padding: 40px 24px;
            backdrop-filter: blur(10px);
          }
          .logo {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 8px;
          }
          .subtitle {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 24px;
          }
          .message {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
          }
          .code {
            font-size: 24px;
            font-weight: 800;
            background: rgba(255,255,255,0.2);
            padding: 12px 24px;
            border-radius: 12px;
            margin: 16px 0;
            letter-spacing: 2px;
            display: inline-block;
          }
          .button {
            display: inline-block;
            background: white;
            color: #FF5A1F;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 16px;
            margin-top: 16px;
          }
          .loading {
            font-size: 14px;
            opacity: 0.8;
            margin-top: 16px;
          }
        `}</style>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var ua = navigator.userAgent || navigator.vendor || window.opera;
            var isAndroid = /android/i.test(ua);
            var playStoreUrl = "${playStoreUrl}";
            var homepageUrl = "${homepageUrl}";

            if (isAndroid) {
              var intentUrl = "intent://r/${code}#Intent;scheme=notifetch;package=com.notifetch.app;S.browser_fallback_url=" + encodeURIComponent(playStoreUrl) + ";end";
              var timer = setTimeout(function() {
                window.location.href = playStoreUrl;
              }, 2000);
              window.location.href = intentUrl;
            } else {
              setTimeout(function() {
                window.location.href = homepageUrl;
              }, 3000);
            }
          })();
        `}} />
      </head>
      <body>
        <div className="container">
          <div className="logo">🔔 NotiFetch</div>
          <div className="subtitle">Never miss a delivery order</div>
          <div className="message">You&apos;ve been invited! 🎉</div>
          <p style={{ fontSize: "14px", opacity: 0.9, margin: "8px 0" }}>
            Get premium access to all platforms till December 20
          </p>
          <div className="code">${code}</div>
          <p style={{ fontSize: "13px", opacity: 0.8 }}>
            Opening Play Store... If nothing happens, tap the button below.
          </p>
          <a href={playStoreUrl} className="button">
            Download NotiFetch
          </a>
          <div className="loading">Redirecting...</div>
        </div>
      </body>
    </html>
  );
}
