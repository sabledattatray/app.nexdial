import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/constants/brand";

export const alt = "Nexdial OpenMIS — Free Browser-Side MIS & Excel Dashboard Builder";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundImage: "linear-gradient(to bottom right, #090d16, #0f172a, #1e1b4b)",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              boxShadow: "0 8px 16px rgba(79, 70, 229, 0.4)",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span style={{ fontSize: "28px", fontWeight: "800", letterSpacing: "-0.5px" }}>
            Nexdial <span style={{ color: "#818cf8" }}>OpenMIS</span>
          </span>
          <div
            style={{
              marginLeft: "16px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#34d399",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              padding: "4px 14px",
              borderRadius: "9999px",
            }}
          >
            100% In-Browser Privacy
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "950px" }}>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "900",
              lineHeight: "1.15",
              letterSpacing: "-1.5px",
              margin: 0,
              background: "linear-gradient(to right, #ffffff, #e2e8f0, #94a3b8)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Turn Spreadsheets Into Interactive Dashboards in Minutes
          </h1>
          <p
            style={{
              fontSize: "24px",
              color: "#94a3b8",
              lineHeight: "1.4",
              margin: 0,
            }}
          >
            Instant CSV & Excel profiling, interactive KPI charts, and outlier detection with zero cloud uploads.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(148, 163, 184, 0.2)",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", color: "#cbd5e1" }}>
              <span style={{ color: "#818cf8", fontWeight: "bold" }}>[+]</span> Zero Server Cost
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", color: "#cbd5e1" }}>
              <span style={{ color: "#818cf8", fontWeight: "bold" }}>[+]</span> Zero Telemetry / Local RAM
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", color: "#cbd5e1" }}>
              <span style={{ color: "#818cf8", fontWeight: "bold" }}>[+]</span> Apache ECharts Engine
            </div>
          </div>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "#818cf8" }}>
            {BRAND.domain}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
