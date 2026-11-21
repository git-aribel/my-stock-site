import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Organic Stock Photos & Backgrounds",
  description:
    "Natural, aesthetic stock photos and backgrounds for Instagram posts and stories. Everyday images for small businesses and creators that feel real, not staged.",
};

export default function ImagesPage() {
  return (
    <CategoryPage
      category="image"
      label="The library"
      script="Images"
      description="Natural, everyday photos and backgrounds that feel real, not staged."
      aspect="aspect-square"
      columns="grid-cols-2 md:grid-cols-3"
    />
  );
}