import CategoryPage from "@/components/CategoryPage";

export default function TemplatesPage() {
  return (
    <CategoryPage
      label="The library"
      script="Canva Templates"
      description="Editable templates that make your brand look cohesive in minutes."
      aspect="aspect-[4/5]"
      columns="grid-cols-2 md:grid-cols-3"
      panel="panel-rose"
      count={6}
    />
  );
}