import { ImageResponse } from "next/og"
import { siteConfig } from "@/lib/site"

export const runtime = "edge"
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(145deg, #0B1220 0%, #111827 45%, #0F172A 100%)",
        color: "#F8FAFC",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: "rgba(0, 122, 255, 0.18)",
            border: "2px solid #007AFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 30,
            fontWeight: 700,
            color: "#007AFF",
          }}
        >
          JF
        </div>
        <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.03em" }}>
          {siteConfig.name}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 920 }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.04em",
          }}
        >
          {siteConfig.tagline}
        </div>
        <div style={{ fontSize: 28, color: "#94A3B8", lineHeight: 1.35, maxWidth: 860 }}>
          Score resume fit, close skill gaps, and track applications with AI.
        </div>
      </div>

      <div style={{ display: "flex", color: "#64748B", fontSize: 22 }}>
        Resume match · Career tools · Application tracker
      </div>
    </div>,
    { ...size },
  )
}
