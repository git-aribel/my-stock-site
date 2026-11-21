import type { Metadata } from "next";
import ToolPage from "@/components/tools/ToolPage";
import ColorPalette from "@/components/tools/ColorPalette";

export const metadata: Metadata = {
  title: "Color Palette Generator",
  description: "Free color palette generator for your brand. Build a brand board with 5-color palettes and 2-color pairs for your Instagram and Canva designs.",
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
