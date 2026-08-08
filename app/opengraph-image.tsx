import { ImageResponse } from "next/og";

export const alt = "Westmonks — Shopify Operations & Automation";
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
        background: "#ffffff",
        color: "#18181b",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          opacity: 0.55,
          backgroundImage:
            "linear-gradient(rgba(24,24,27,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(24,24,27,.08) 1px,transparent 1px)",
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
          background: "rgba(5,150,105,.09)",
          border: "1px solid rgba(5,150,105,.18)",
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
              background: "#059669",
            }}
          />
          WESTMONKS
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              marginBottom: 22,
              color: "#059669",
              fontSize: 16,
              letterSpacing: 3,
            }}
          >
            SHOPIFY OPERATIONS × AUTOMATION × OWNERSHIP
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
