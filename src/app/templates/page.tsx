import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Canva Templates for Instagram",
  description:
    "Editable Canva templates for Instagram posts, carousels and stories. Make your brand look cohesive in minutes, made for small businesses and creators.",
};

export default function TemplatesPage() {
  return (
    <CategoryPage
      category="template"
      label="The library"
      script="Canva Templates"
      description="Editable templates that make your brand look cohesive in minutes."
      aspect="aspect-[4/5]"
      columns="grid-cols-2 md:grid-cols-3"
    />
  );
}