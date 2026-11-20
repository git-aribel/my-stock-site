// Font pairings used by the font pairing and color palette tools.
// All fonts are free on Google Fonts.
export type FontPair = {
  name: string;
  mood: string;
  heading: string;
  headingFallback: "serif" | "sans-serif" | "cursive";
  body: string;
  bodyFallback: "serif" | "sans-serif";
};

export const FONT_PAIRS: FontPair[] = [
  { name: "Timeless", mood: "Classic and calm", heading: "Playfair Display", headingFallback: "serif", body: "Lato", bodyFallback: "sans-serif" },
  { name: "Editorial", mood: "Like a fashion magazine", heading: "Cormorant Garamond", headingFallback: "serif", body: "Montserrat", bodyFallback: "sans-serif" },
  { name: "Modern Muse", mood: "Fresh and confident", heading: "DM Serif Display", headingFallback: "serif", body: "DM Sans", bodyFallback: "sans-serif" },
  { name: "Soft Romance", mood: "Light and dreamy", heading: "Italiana", headingFallback: "serif", body: "Jost", bodyFallback: "sans-serif" },
  { name: "Classic Chic", mood: "Bookish and polished", heading: "Libre Baskerville", headingFallback: "serif", body: "Source Sans 3", bodyFallback: "sans-serif" },
  { name: "Clean Contrast", mood: "Friendly and clear", heading: "Poppins", headingFallback: "sans-serif", body: "Lora", bodyFallback: "serif" },
  { name: "Vintage Diary", mood: "Bold and nostalgic", heading: "Abril Fatface", headingFallback: "serif", body: "Karla", bodyFallback: "sans-serif" },
  { name: "Quiet Luxury", mood: "High-end and minimal", heading: "Bodoni Moda", headingFallback: "serif", body: "Inter", bodyFallback: "sans-serif" },
  { name: "Sweet & Soft", mood: "Warm and playful", heading: "Fraunces", headingFallback: "serif", body: "Nunito", bodyFallback: "sans-serif" },
  { name: "Boho Studio", mood: "Earthy and relaxed", heading: "Gloock", headingFallback: "serif", body: "Work Sans", bodyFallback: "sans-serif" },
  { name: "Love Letter", mood: "Romantic and handwritten", heading: "Pinyon Script", headingFallback: "cursive", body: "Raleway", bodyFallback: "sans-serif" },
  { name: "Wedding Day", mood: "Elegant and graceful", heading: "Great Vibes", headingFallback: "cursive", body: "Cormorant", bodyFallback: "serif" },
  { name: "Gallery", mood: "Artsy and modern", heading: "Syne", headingFallback: "sans-serif", body: "Inter", bodyFallback: "sans-serif" },
  { name: "Retro Pop", mood: "Fun and loud", heading: "Shrikhand", headingFallback: "cursive", body: "Rubik", bodyFallback: "sans-serif" },
  { name: "Serene", mood: "Clean and spa-like", heading: "Marcellus", headingFallback: "serif", body: "Mulish", bodyFallback: "sans-serif" },
  { name: "Headline News", mood: "Strong and punchy", heading: "Bebas Neue", headingFallback: "sans-serif", body: "Libre Franklin", bodyFallback: "sans-serif" },
  { name: "Parisian", mood: "Effortless and chic", heading: "Gilda Display", headingFallback: "serif", body: "Nunito Sans", bodyFallback: "sans-serif" },
  { name: "Soft Minimal", mood: "Simple and gentle", heading: "Quicksand", headingFallback: "sans-serif", body: "Lora", bodyFallback: "serif" },
];

export function fontStack(name: string, fallback: string) {
  return `'${name}', ${fallback}`;
}

export function googleFontsUrl(families: string[]) {
  const unique = [...new Set(families)];
  const params = unique
    .map((f) => `family=${f.replace(/ /g, "+")}`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

export function fontCss(pair: FontPair) {
  return [
    `@import url('${googleFontsUrl([pair.heading, pair.body])}');`,
    "",
    `h1, h2, h3 {`,
    `  font-family: ${fontStack(pair.heading, pair.headingFallback)};`,
    `}`,
    "",
    `body, p {`,
    `  font-family: ${fontStack(pair.body, pair.bodyFallback)};`,
    `}`,
  ].join("\n");
}
