// ✏️ preview = how many of the newest items non-members can see
// (0 = members only, nothing shown)
export const CATEGORIES: Record<
  string,
  { label: string; path: string; aspect: string; columns: string; preview: number; noun: string }
> = {
  video: {
    label: "Stock Videos",
    path: "/videos",
    aspect: "aspect-[9/16]",
    columns: "grid-cols-2 md:grid-cols-4",
    preview: 4,
    noun: "videos",
  },
  template: {
    label: "Canva Templates",
    path: "/templates",
    aspect: "aspect-[4/5]",
    columns: "grid-cols-2 md:grid-cols-3",
    preview: 0,
    noun: "templates",
  },
  image: {
    label: "Images",
    path: "/images",
    aspect: "aspect-square",
    columns: "grid-cols-2 md:grid-cols-3",
    preview: 6,
    noun: "images",
  },
  sticker: {
    label: "Stickers",
    path: "/stickers",
    aspect: "aspect-square",
    columns: "grid-cols-2 md:grid-cols-4",
    preview: 4,
    noun: "stickers",
  },
};
