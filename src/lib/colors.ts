// Small color helpers for the palette generator.

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

export function hslToHex(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return rgbToHex(f(0) * 255, f(8) * 255, f(4) * 255);
}

// Whether dark or light text reads better on this color
export function isLight(hex: string) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4;
}

function luminance(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

// A random palette that mixes different colors, like the curated ones:
// a light neutral, a soft pastel, two mid colors from other hues and a dark.
export function randomPalette(): string[] {
  const base = rand(0, 360);
  const schemes = [
    [0, 150, 210], // split complementary
    [0, 120, 240], // triadic
    [0, 40, 180], // neighbour + opposite
    [0, 90, 200], // spread out
    [0, 180, 30], // complementary + warm neighbour
  ];
  const [o1, o2, o3] = schemes[Math.floor(Math.random() * schemes.length)];
  const jitter = () => rand(-12, 12);

  // Muted, dusty tones to match the vintage look
  const light = hslToHex(base + jitter(), rand(25, 40), rand(92, 95));
  const soft = hslToHex(base + o1 + jitter(), rand(30, 50), rand(76, 84));
  const accent = hslToHex(base + o2 + jitter(), rand(20, 35), rand(56, 66));
  const feature = hslToHex(base + o3 + jitter(), rand(20, 34), rand(40, 50));
  const dark = hslToHex(base + o2 + jitter(), rand(18, 32), rand(14, 22));
  return [light, soft, accent, feature, dark];
}

// Picks the main colors from an image using a simple k-means.
export function paletteFromImage(img: HTMLImageElement, count = 5): string[] {
  const size = 80;
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, size / Math.max(img.width, img.height));
  canvas.width = Math.max(1, Math.round(img.width * scale));
  canvas.height = Math.max(1, Math.round(img.height * scale));
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  const pixels: [number, number, number][] = [];
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    pixels.push([data[i], data[i + 1], data[i + 2]]);
  }
  if (pixels.length === 0) return randomPalette();

  // Start from evenly spread pixels sorted by brightness
  const sorted = [...pixels].sort(
    (a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]),
  );
  let centers = Array.from(
    { length: count },
    (_, i) => sorted[Math.floor(((i + 0.5) / count) * sorted.length)],
  );

  for (let iter = 0; iter < 12; iter++) {
    const sums = centers.map(() => [0, 0, 0, 0]);
    for (const p of pixels) {
      let best = 0;
      let bestD = Infinity;
      centers.forEach((c, i) => {
        const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      const s = sums[best];
      s[0] += p[0];
      s[1] += p[1];
      s[2] += p[2];
      s[3] += 1;
    }
    centers = centers.map((c, i) =>
      sums[i][3]
        ? ([sums[i][0] / sums[i][3], sums[i][1] / sums[i][3], sums[i][2] / sums[i][3]] as [number, number, number])
        : c,
    );
  }

  // Drop near-duplicates, then fill any gaps with lighter/darker shades
  const unique: [number, number, number][] = [];
  for (const c of centers) {
    const close = unique.some(
      (u) => (u[0] - c[0]) ** 2 + (u[1] - c[1]) ** 2 + (u[2] - c[2]) ** 2 < 30 ** 2,
    );
    if (!close) unique.push(c);
  }
  const result = unique.map((c) => rgbToHex(c[0], c[1], c[2]));
  const mix = (c: [number, number, number], t: number, to: number) =>
    rgbToHex(c[0] + (to - c[0]) * t, c[1] + (to - c[1]) * t, c[2] + (to - c[2]) * t);
  const shades = [
    (c: [number, number, number]) => mix(c, 0.75, 255),
    (c: [number, number, number]) => mix(c, 0.6, 0),
    (c: [number, number, number]) => mix(c, 0.4, 255),
    (c: [number, number, number]) => mix(c, 0.3, 0),
  ];
  for (let i = 0; result.length < count && i < shades.length * unique.length; i++) {
    result.push(shades[Math.floor(i / unique.length)](unique[i % unique.length]));
  }

  return result.sort((a, b) => luminance(b) - luminance(a));
}

// Popular multi-color palettes, collected from color-meanings.com's vintage
// palettes and the widely shared Coolors palettes listed by Venngage and
// Design Your Way. Each is sorted lightest to darkest, so the tool's roles
// (background, soft, accent, feature, text) line up.
const PALETTES: { name: string; colors: string[] }[] = [
  // Socials Bestie's own
  { name: "Vintage Postcard", colors: ["#f6f0e6", "#dcbdb8", "#8ea7bf", "#46608a", "#4a2f27"] },
  // Vintage (color-meanings.com)
  { name: "Butterfly Garden", colors: ["#7D7F4F", "#E7C675", "#E5DDD3", "#EBA398", "#98292A"] },
  { name: "Wild Rust", colors: ["#5C3A28", "#AF9784", "#527A84", "#DC7F70", "#A58199"] },
  { name: "Confectionery", colors: ["#8F7A68", "#F5D080", "#EAE3DD", "#A5C4C6", "#D69494"] },
  { name: "Beachside Bicycles", colors: ["#AD7670", "#B49886", "#F3ECDC", "#BFD5BE", "#DFA679"] },
  { name: "Wallflowers", colors: ["#67783B", "#B5C9B1", "#DBDBDA", "#CB8A9D", "#AE9DBA"] },
  { name: "Coffeehouse", colors: ["#899E81", "#9AB19E", "#F7BDA5", "#D98A86", "#5E808C"] },
  { name: "Window Shopping", colors: ["#7CACB0", "#C6D09E", "#E0C79E", "#D8B8A9", "#867673"] },
  // Popular Coolors palettes (Venngage, Design Your Way)
  { name: "Lemon Meringue", colors: ["#003049", "#d62828", "#f77f00", "#fcbf49", "#eae2b7"] },
  { name: "Modern Minimalist", colors: ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"] },
  { name: "Candy Pink", colors: ["#355070", "#6d597a", "#b56576", "#e56b6f", "#eaac8b"] },
  { name: "Bedazzled Blue", colors: ["#3d5a80", "#98c1d9", "#e0fbfc", "#ee6c4d", "#293241"] },
  { name: "Sage & Indigo", colors: ["#033f63", "#28666e", "#7c9885", "#b5b682", "#fedc97"] },
  { name: "Burnt Sienna", colors: ["#dd6e42", "#e8dab2", "#4f6d7a", "#c0d6df", "#eaeaea"] },
  { name: "Paradise Pink", colors: ["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#073b4c"] },
  { name: "Imperial Red", colors: ["#2b2d42", "#8d99ae", "#edf2f4", "#ef233c", "#d90429"] },
];

export const CURATED_PALETTES = PALETTES.map((p) => ({
  name: p.name,
  colors: p.colors
    .map((c) => c.toLowerCase())
    .sort((a, b) => luminance(b) - luminance(a)),
}));

// Popular two-color combinations, from The Noun Project's and Oberlo's
// color combination guides. Sorted light first, dark second.
const DUOS: { name: string; colors: string[] }[] = [
  { name: "Blush & Cocoa", colors: ["#dcbdb8", "#4a2f27"] },
  { name: "Mustard & Navy", colors: ["#f4af1b", "#00154f"] },
  { name: "Off-white & Cherry", colors: ["#f4ecdf", "#e74c3c"] },
  { name: "Orange & Cerulean", colors: ["#ed7b2e", "#0e4a6b"] },
  { name: "Peach & Iris", colors: ["#ffddcc", "#4e3883"] },
  { name: "Yellow & Charcoal", colors: ["#FEE715", "#101820"] },
  { name: "Pink & Olive", colors: ["#FADADD", "#808000"] },
  { name: "Bubblegum & Slate", colors: ["#F7C5CC", "#708090"] },
  { name: "Raspberry & Graphite", colors: ["#E30B5D", "#251F1F"] },
  { name: "Seafoam & Chocolate", colors: ["#93E9BE", "#4E342E"] },
];

export const CURATED_DUOS = DUOS.map((p) => ({
  name: p.name,
  colors: p.colors
    .map((c) => c.toLowerCase())
    .sort((a, b) => luminance(b) - luminance(a)),
}));

// A random light + dark pair with enough contrast to use together.
export function randomDuo(): string[] {
  const base = rand(0, 360);
  if (Math.random() < 0.5) {
    // Soft neutral with one strong color
    return [
      hslToHex(base + rand(-15, 15), rand(25, 45), rand(91, 95)),
      hslToHex(base + rand(-30, 30), rand(35, 60), rand(28, 42)),
    ];
  }
  // Pastel with a deep color from the other side of the wheel
  return [
    hslToHex(base, rand(45, 75), rand(78, 88)),
    hslToHex(base + rand(150, 210), rand(30, 55), rand(20, 32)),
  ];
}

// Friendly names for colors, like "Cocoa" or "Sage". The closest one wins.
const NAMED_COLORS: [string, string][] = [
  ["Cream", "#faf4e5"], ["Ivory", "#fffff0"], ["Linen", "#f3ece1"], ["Pearl", "#eae0c8"], ["Porcelain", "#f2f0eb"],
  ["Snow", "#fafafa"], ["Oat", "#e3d3b8"], ["Sand", "#d8c3a5"], ["Latte", "#c9a98a"],
  ["Camel", "#c19a6b"], ["Caramel", "#b5835a"], ["Toffee", "#a58362"], ["Mocha", "#8a6a55"],
  ["Cocoa", "#664e44"], ["Chocolate", "#4e342e"], ["Espresso", "#3b2a22"], ["Taupe", "#a39382"],
  ["Peach", "#ffe8d6"], ["Apricot", "#f8c8a0"], ["Blush", "#f2d0cc"], ["Rose", "#e0a9a5"],
  ["Dusty", "#b08b7f"], ["Mauve", "#a5818f"], ["Pink", "#f7c5cc"], ["Bubblegum", "#f49ac2"],
  ["Coral", "#f08070"], ["Salmon", "#f4a08a"], ["Terracotta", "#c46a4a"], ["Clay", "#a26b5a"],
  ["Rust", "#a0522d"], ["Brick", "#8b3a2e"], ["Cherry", "#b3261e"], ["Red", "#d62828"],
  ["Berry", "#8e3b5f"], ["Raspberry", "#c4245f"], ["Wine", "#5c1f2e"], ["Plum", "#61316d"],
  ["Grape", "#5e4b8b"], ["Lilac", "#cdb4db"], ["Lavender", "#c9b6e4"], ["Iris", "#6d5fae"],
  ["Periwinkle", "#b9c8f2"], ["Powder Blue", "#c0d6df"], ["Sky", "#8ecae6"], ["Dusty Blue", "#8ea7bf"],
  ["Denim", "#46608a"], ["Ocean", "#2f6f8f"], ["Navy", "#1f2f4f"], ["Midnight", "#14213d"],
  ["Teal", "#2a9d8f"], ["Seafoam", "#9fd8c4"], ["Mint", "#c8e6d0"], ["Eucalyptus", "#7c9f99"],
  ["Sage", "#c7c3b0"], ["Pistachio", "#c8d5a8"], ["Olive", "#7a7d4f"], ["Moss", "#67783b"],
  ["Forest", "#2f3a2e"], ["Pine", "#264653"], ["Butter", "#f9e9a8"], ["Lemon", "#fcd860"],
  ["Honey", "#e9b872"], ["Mustard", "#d9a62e"], ["Tangerine", "#f77f00"], ["Stone", "#b7b2a8"],
  ["Fog", "#d9d9d6"], ["Slate", "#708090"], ["Charcoal", "#36454f"], ["Charcoal Blue", "#202833"], ["Graphite", "#251f1f"],
];

function toLab(hex: string): [number, number, number] {
  const lin = (c: number) => (c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92);
  const [r, g, b] = hexToRgb(hex).map((v) => lin(v / 255));
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}

const NAMED_LAB = NAMED_COLORS.map(([name, hex]) => ({ name, lab: toLab(hex) }));

// Names each color, never using the same name twice in one palette.
export function nameColors(hexes: string[]): string[] {
  const used = new Set<string>();
  return hexes.map((hex) => {
    const lab = toLab(hex);
    const ranked = NAMED_LAB.map((n) => ({
      name: n.name,
      d: (n.lab[0] - lab[0]) ** 2 + (n.lab[1] - lab[1]) ** 2 + (n.lab[2] - lab[2]) ** 2,
    })).sort((a, b) => a.d - b.d);
    const pick = ranked.find((r) => !used.has(r.name)) ?? ranked[0];
    used.add(pick.name);
    return pick.name;
  });
}
