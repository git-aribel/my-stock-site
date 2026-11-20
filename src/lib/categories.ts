export const CATEGORIES: Record<
  string,
  { label: string; path: string; aspect: string; columns: string }
> = {
  video: {
    label: "Stock Videos",
    path: "/videos",
    aspect: "aspect-[9/16]",
    columns: "grid-cols-2 md:grid-cols-4",
  },
  template: {
    label: "Canva Templates",
    path: "/templates",
    aspect: "aspect-[4/5]",
    columns: "grid-cols-2 md:grid-cols-3",
  },
  image: {
    label: "Images",
    path: "/images",
    aspect: "aspect-square",
    columns: "grid-cols-2 md:grid-cols-3",
  },
  sticker: {
    label: "Stickers",
    path: "/stickers",
    aspect: "aspect-square",
    columns: "grid-cols-2 md:grid-cols-4",
  },
};
