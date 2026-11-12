import CategoryPage from "@/components/CategoryPage";

export default function StickersPage() {
  return (
    <CategoryPage
      label="The library"
      script="Stickers"
      description="Little illustrations, flowers and details to scatter across your designs."
      aspect="aspect-square"
      columns="grid-cols-2 md:grid-cols-4"
      panel="linen"
      count={8}
    />
  );
}