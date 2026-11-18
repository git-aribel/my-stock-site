import CategoryPage from "@/components/CategoryPage";

export default function ImagesPage() {
  return (
    <CategoryPage
      category="image"
      label="The library"
      script="Images"
      description="Aesthetic photos, textures and backgrounds for your posts and designs."
      aspect="aspect-square"
      columns="grid-cols-2 md:grid-cols-3"
    />
  );
}