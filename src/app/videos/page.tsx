import CategoryPage from "@/components/CategoryPage";

export default function VideosPage() {
  return (
    <CategoryPage
      category="video"
      label="The library"
      script="Stock Videos"
      description="Soft, vintage-feeling clips made for Reels, TikToks and Shorts."
      aspect="aspect-[9/16]"
      columns="grid-cols-2 md:grid-cols-4"
    />
  );
}