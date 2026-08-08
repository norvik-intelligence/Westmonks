import { ImageResponse } from "next/og";

export const alt = "Westmonks — Shopify Automation & AI Operations";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#050505",
        color: "#f4f4ef",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          opacity: 0.16,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.16) 1px,transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 70,
          top: 72,
          display: "flex",
          width: 360,
          height: 360,
          borderRadius: 999,
          background: "rgba(199,255,74,.10)",
          border: "1px solid rgba(199,255,74,.18)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          padding: "58px 66px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 19,
            fontWeight: 700,
            letterSpacing: 4,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#c7ff4a",
            }}
          />
          WESTMONKS
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              marginBottom: 22,
              color: "#c7ff4a",
              fontSize: 16,
              letterSpacing: 3,
            }}
          >
            SHOPIFY OPERATIONS × AUTOMATION × AI
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 900,
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 0.94,
              letterSpacing: -4.5,
            }}
          >
            Dein Store wächst. Das Chaos nicht.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              color: "#71717a",
              fontSize: 26,
            }}
          >
            Backend-Automatisierungen für Rechnungen, Bestand und Support.
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
