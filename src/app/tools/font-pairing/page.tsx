import type { Metadata } from "next";
import ToolPage from "@/components/tools/ToolPage";
import FontPairing from "@/components/tools/FontPairing";

export const metadata: Metadata = {
  title: "Font Pairing Generator",
  description: "Free font pairing generator. Find fonts that look beautiful together for your brand, Instagram posts and Canva designs, in your own colors.",
};

export default function FontPairingPage() {
  return (
    <ToolPage
      eyebrow="Free creator tool"
      title="Font pairings"
      intro="Find two fonts that look beautiful together. Type your own words, try them on a post, website or business card, and copy what you love."
      path="/tools/font-pairing"
    >
      <FontPairing />
    </ToolPage>
  );
}
