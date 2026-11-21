import { ImageResponse } from "next/og";
import { SITE_CATEGORY, SITE_NAME } from "@/lib/site";

// The preview card shown when someone shares the site on social media,
// iMessage, Slack...
export const alt = `${SITE_NAME}, ${SITE_CATEGORY.toLowerCase()}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbf7f0",
          padding: 32,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#4a2f27",
            borderRadius: 24,
            color: "#f6f0e6",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 28, letterSpacing: 8, textTransform: "uppercase", color: "#b9c8f2" }}>
            {SITE_CATEGORY}
          </div>
          <div style={{ marginTop: 28, fontSize: 120, fontWeight: 700, letterSpacing: -4, color: "#b9c8f2" }}>
            {SITE_NAME}
          </div>
          <div style={{ marginTop: 28, fontSize: 40, maxWidth: 900, opacity: 0.85 }}>
            Everything you need to show up on social media
          </div>
          <div style={{ marginTop: 44, display: "flex", gap: 18, fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: "#dcbdb8" }}>
            Organic stock videos · Canva templates · Free planning tools
          </div>
        </div>
      </div>
    ),
    size,
  );
}
