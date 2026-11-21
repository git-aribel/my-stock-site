import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Organic Stock Videos for Reels & TikTok",
  description:
    "Organic stock videos for Instagram Reels, TikTok and YouTube Shorts that don't feel like stock. Real-life, aesthetic clips for small businesses and creators.",
};

export default function VideosPage() {
  return (
    <CategoryPage
      category="video"
      label="The library"
      script="Stock Videos"
      description="Organic, real-life clips for Reels, TikToks and Shorts that don't feel like stock."
      aspect="aspect-[9/16]"
      columns="grid-cols-2 md:grid-cols-4"
    />
  );
}