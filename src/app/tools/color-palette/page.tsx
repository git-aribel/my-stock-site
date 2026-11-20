import type { Metadata } from "next";
import ToolPage from "@/components/tools/ToolPage";
import ColorPalette from "@/components/tools/ColorPalette";

export const metadata: Metadata = {
  title: "Color Palette Generator | Socials Bestie",
  description: "Create a color palette and brand board for your brand. Free with a Socials Bestie account.",
};

export default function ColorPalettePage() {
  return (
    <ToolPage
      eyebrow="Free creator tool"
      title="Color palettes"
      intro="Generate a palette, pull one from a favourite photo, or start from an aesthetic. Then turn it into a brand board you can download."
      path="/tools/color-palette"
    >
      <ColorPalette />
    </ToolPage>
  );
}
