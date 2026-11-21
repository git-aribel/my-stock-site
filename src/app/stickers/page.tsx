import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Stickers & Illustrations for Social Media",
  description:
    "Cute stickers and illustrations to layer over your Instagram stories, Reels and Canva designs.",
};

export default function StickersPage() {
  return (
    <CategoryPage
      category="sticker"
      label="The library"
      script="Stickers"
      description="Little illustrations, flowers and details to scatter across your designs."
      aspect="aspect-square"
      columns="grid-cols-2 md:grid-cols-4"
    />
  );
}