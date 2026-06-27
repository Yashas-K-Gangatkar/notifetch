import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NotiFetch — One Feed. All Notifications. Every Platform. Worldwide.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #b45309 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "24px",
              background: "rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "56px",
              fontWeight: 900,
              color: "white",
            }}
          >
            NF
          </div>
          <div
            style={{
              color: "white",
              fontSize: "56px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            NotiFetch
          </div>
        </div>
        <div
          style={{
            color: "white",
            fontSize: "72px",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: "1000px",
          }}
        >
          One Feed. All Notifications.
          <br />
          Every Platform. Worldwide.
        </div>
        <div
          style={{
            color: "rgba(255, 255, 255, 0.85)",
            fontSize: "32px",
            fontWeight: 500,
            marginTop: "32px",
            maxWidth: "900px",
          }}
        >
          Aggregate delivery notifications from 119+ platforms — no credentials needed.
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "48px",
            fontSize: "24px",
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <span>notiFetch.in</span>
          <span>•</span>
          <span>Doing is Doing — DID</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
