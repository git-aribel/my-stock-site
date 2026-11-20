"use client";

import { useState } from "react";
import { FONT_PAIRS, fontCss, fontStack, type FontPair } from "@/lib/fontPairs";
import { copyText, downloadCanvas, useGoogleFonts } from "@/lib/useGoogleFonts";

type Format = "website" | "social" | "card";

const THEMES = [
  { name: "Cream", bg: "#f6f0e6", text: "#4a2f27", accent: "#46608a" },
  { name: "Cocoa", bg: "#4a2f27", text: "#f6f0e6", accent: "#b9c8f2" },
  { name: "Denim", bg: "#46608a", text: "#fbf7f0", accent: "#dcbdb8" },
  { name: "Blush", bg: "#dcbdb8", text: "#36211b", accent: "#46608a" },
  { name: "Ink", bg: "#1f1b1a", text: "#f5f0ea", accent: "#c79f9b" },
  { name: "White", bg: "#ffffff", text: "#222222", accent: "#8ea7bf" },
];

const label = "text-[0.65rem] uppercase tracking-[0.25em] text-cocoa/70";
const input =
  "w-full border border-cocoa/30 bg-cream px-3 py-2 font-serif text-lg text-cocoa outline-none focus:border-denim";
const btn =
  "border border-cocoa px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-rose/40";
const btnDark =
  "bg-cocoa px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep";

function headingFont(p: FontPair) {
  return fontStack(p.heading, p.headingFallback);
}
function bodyFont(p: FontPair) {
  return fontStack(p.body, p.bodyFallback);
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

export default function FontPairing() {
  const [index, setIndex] = useState(0);
  const [brand, setBrand] = useState("Socials Bestie");
  const [headline, setHeadline] = useState("Content that feels like you");
  const [about, setAbout] = useState(
    "Simple tools and pretty templates to help you show up online with confidence.",
  );
  const [format, setFormat] = useState<Format>("social");
  const [size, setSize] = useState(100);
  const [theme, setTheme] = useState(0); // -1 = the user's own colors
  const [custom, setCustom] = useState(THEMES[0]);
  const [toast, setToast] = useState<string | null>(null);

  const pair = FONT_PAIRS[index];
  const t = theme === -1 ? custom : THEMES[theme];

  // Editing any color switches to "your colors", starting from what's shown
  function editColor(key: "bg" | "text" | "accent", value: string) {
    setCustom({ ...t, name: "Yours", [key]: value });
    setTheme(-1);
  }

  // Load every pairing's fonts so the list below shows real previews
  useGoogleFonts(FONT_PAIRS.flatMap((p) => [p.heading, p.body]));

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  function surprise() {
    let next = index;
    while (next === index) next = Math.floor(Math.random() * FONT_PAIRS.length);
    setIndex(next);
  }

  async function copy(text: string, msg: string) {
    flash((await copyText(text)) ? msg : "Couldn't copy. Please try again.");
  }

  // Draws the format that's on screen (website, post or card) as a PNG
  async function download() {
    await Promise.all([
      document.fonts.load(`64px '${pair.heading}'`),
      document.fonts.load(`32px '${pair.body}'`),
    ]);
    const scale = size / 100;
    const H_FONT = headingFont(pair);
    const B_FONT = bodyFont(pair);
    const dims = { website: [1600, 900], social: [1080, 1350], card: [1050, 600] }[format];
    const [W, H] = dims;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    const spaced = (px: number) => {
      ctx.letterSpacing = `${px}px`;
    };
    ctx.fillStyle = t.bg;
    ctx.fillRect(0, 0, W, H);
    ctx.textBaseline = "middle";

    type Block = { text: string; font: string; color: string; lh: number; alpha?: number; spacing?: number };
    // Lays out blocks centered horizontally, stacked and centered between top and bottom
    function stack(blocks: Block[], top: number, bottom: number, maxWidth: number, gap: number) {
      ctx.textAlign = "center";
      const laid = blocks.map((b) => {
        ctx.font = b.font;
        spaced(b.spacing ?? 0);
        return { ...b, lines: wrap(ctx, b.text, maxWidth) };
      });
      const total = laid.reduce((sum, b) => sum + b.lines.length * b.lh, 0) + gap * (laid.length - 1);
      let y = top + (bottom - top - total) / 2;
      for (const b of laid) {
        ctx.font = b.font;
        spaced(b.spacing ?? 0);
        ctx.fillStyle = b.color;
        ctx.globalAlpha = b.alpha ?? 1;
        for (const line of b.lines) {
          ctx.fillText(line, W / 2, y + b.lh / 2);
          y += b.lh;
        }
        ctx.globalAlpha = 1;
        y += gap;
      }
      return y - gap;
    }

    if (format === "website") {
      // Top bar
      const nav = 140;
      ctx.textAlign = "left";
      ctx.fillStyle = t.text;
      ctx.font = `44px ${H_FONT}`;
      spaced(0);
      ctx.fillText(brand, 60, nav / 2, W / 2);
      ctx.textAlign = "right";
      ctx.font = `28px ${B_FONT}`;
      ctx.fillText("Shop      About      Contact", W - 60, nav / 2);
      ctx.fillStyle = `${t.text}22`;
      ctx.fillRect(0, nav, W, 2);

      // Hero, leaving room for the button
      const end = stack(
        [
          { text: headline, font: `${Math.round(104 * scale)}px ${H_FONT}`, color: t.text, lh: Math.round(120 * scale) },
          { text: about, font: `36px ${B_FONT}`, color: t.text, lh: 54, alpha: 0.8 },
        ],
        nav,
        H - 120,
        1100,
        40,
      );
      ctx.font = `26px ${B_FONT}`;
      spaced(5);
      const label = "SHOP NOW";
      const bw = ctx.measureText(label).width + 100;
      const by = end + 60;
      ctx.fillStyle = t.text;
      ctx.fillRect(W / 2 - bw / 2, by, bw, 80);
      ctx.fillStyle = t.bg;
      ctx.textAlign = "center";
      ctx.fillText(label, W / 2, by + 40);
    } else if (format === "social") {
      stack(
        [
          { text: brand.toUpperCase(), font: `28px ${B_FONT}`, color: t.accent, lh: 44, spacing: 8 },
          { text: headline, font: `${Math.round(106 * scale)}px ${H_FONT}`, color: t.text, lh: Math.round(122 * scale) },
          { text: about, font: `38px ${B_FONT}`, color: t.text, lh: 58, alpha: 0.8 },
        ],
        0,
        H,
        W - 200,
        50,
      );
    } else {
      // Business card: name top left, details bottom left
      const pad = 72;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = t.text;
      ctx.font = `${Math.round(72 * scale)}px ${H_FONT}`;
      spaced(0);
      const nameLines = wrap(ctx, brand, W - pad * 2);
      nameLines.forEach((line, i) => ctx.fillText(line, pad, pad + i * Math.round(84 * scale)));

      ctx.textBaseline = "alphabetic";
      ctx.font = `30px ${B_FONT}`;
      ctx.globalAlpha = 0.8;
      ctx.fillText("hello@yourbrand.com · @yourbrand", pad, H - pad);
      ctx.globalAlpha = 1;
      ctx.fillStyle = t.accent;
      spaced(6);
      const tag = wrap(ctx, headline.toUpperCase(), W - pad * 2);
      tag.reverse().forEach((line, i) => ctx.fillText(line, pad, H - pad - 52 - i * 42));
    }

    const slug = pair.name.toLowerCase().replace(/\W+/g, "-");
    downloadCanvas(canvas, `font-pairing-${slug}-${format === "social" ? "post" : format}.png`);
  }

  const hFont = { fontFamily: headingFont(pair) };
  const bFont = { fontFamily: bodyFont(pair) };
  const hSize = (px: number) => ({ fontSize: `${(px * size) / 100}px` });

  return (
    <div className="space-y-12">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,360px)_1fr] lg:items-start">
        {/* Controls */}
        <div className="space-y-6">
          <div className="border border-cocoa/25 bg-paper p-6">
            <p className={label}>01 · Your words</p>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="fp-brand" className={label}>Brand name</label>
                <input id="fp-brand" value={brand} maxLength={40} onChange={(e) => setBrand(e.target.value)} className={input} />
              </div>
              <div className="space-y-2">
                <label htmlFor="fp-head" className={label}>Headline</label>
                <input id="fp-head" value={headline} maxLength={80} onChange={(e) => setHeadline(e.target.value)} className={input} />
              </div>
              <div className="space-y-2">
                <label htmlFor="fp-about" className={label}>About your brand</label>
                <textarea id="fp-about" value={about} maxLength={200} rows={3} onChange={(e) => setAbout(e.target.value)} className={input} />
              </div>
            </div>
          </div>

          <div className="border border-cocoa/25 bg-paper p-6">
            <p className={label}>02 · Format</p>
            <div className="mt-3 grid grid-cols-3">
              {(
                [
                  ["website", "Website"],
                  ["social", "Post"],
                  ["card", "Card"],
                ] as [Format, string][]
              ).map(([f, name]) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={`py-2 text-[0.65rem] uppercase tracking-[0.2em] transition ${
                    format === f ? "bg-denim text-cream" : "border border-cocoa/30 text-cocoa hover:bg-rose/30"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            <p className={`${label} mt-6`}>03 · Colors</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {THEMES.map((th, i) => (
                <button
                  key={th.name}
                  type="button"
                  title={th.name}
                  aria-label={`${th.name} colors`}
                  onClick={() => setTheme(i)}
                  className={`h-9 w-9 rounded-full border-2 transition ${
                    theme === i ? "border-cocoa scale-110" : "border-cocoa/20"
                  }`}
                  style={{ background: `linear-gradient(135deg, ${th.bg} 50%, ${th.accent} 50%)` }}
                />
              ))}
              {theme === -1 && (
                <span
                  title="Your colors"
                  className="h-9 w-9 scale-110 rounded-full border-2 border-cocoa"
                  style={{ background: `linear-gradient(135deg, ${custom.bg} 50%, ${custom.accent} 50%)` }}
                />
              )}
            </div>

            <p className="mt-4 font-serif text-base text-ink/70">
              Or use your own brand colors:
            </p>
            <div className="mt-2 space-y-2">
              {(
                [
                  ["bg", "Background"],
                  ["text", "Text"],
                  ["accent", "Accent"],
                ] as ["bg" | "text" | "accent", string][]
              ).map(([key, name]) => (
                <ColorField
                  key={key}
                  label={name}
                  value={t[key]}
                  onChange={(v) => editColor(key, v)}
                />
              ))}
            </div>

            <label htmlFor="fp-size" className={`${label} mt-6 block`}>
              Headline size · {size}%
            </label>
            <input
              id="fp-size"
              type="range"
              min={60}
              max={140}
              step={5}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="mt-2 w-full accent-cocoa"
            />
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className={label}>Your pairing</p>
              <p className="mt-1 font-script text-4xl text-denim">{pair.name}</p>
              <p className="font-serif text-lg text-ink/75">
                {pair.heading} + {pair.body}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" aria-label="Previous pairing" className={btn} onClick={() => setIndex((index - 1 + FONT_PAIRS.length) % FONT_PAIRS.length)}>
                ←
              </button>
              <button type="button" className={btnDark} onClick={surprise}>
                Surprise me
              </button>
              <button type="button" aria-label="Next pairing" className={btn} onClick={() => setIndex((index + 1) % FONT_PAIRS.length)}>
                →
              </button>
            </div>
          </div>

          <div
            className="mt-6 overflow-hidden border border-cocoa/20 shadow-[0_20px_50px_-25px_rgba(74,47,39,0.5)]"
            style={{ background: t.bg, color: t.text }}
          >
            {format === "website" && (
              <div>
                <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: `${t.text}22` }}>
                  <span style={{ ...hFont, fontSize: "22px" }}>{brand}</span>
                  <span className="hidden gap-5 text-sm sm:flex" style={bFont}>
                    <span>Shop</span><span>About</span><span>Contact</span>
                  </span>
                </div>
                <div className="px-6 py-14 text-center md:px-14 md:py-20">
                  <h2 className="leading-tight" style={{ ...hFont, ...hSize(52) }}>{headline}</h2>
                  <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed opacity-80" style={bFont}>{about}</p>
                  <span className="mt-8 inline-block px-6 py-3 text-sm uppercase tracking-[0.2em]" style={{ ...bFont, background: t.text, color: t.bg }}>
                    Shop now
                  </span>
                </div>
              </div>
            )}

            {format === "social" && (
              <div className="mx-auto flex aspect-[4/5] max-w-md flex-col items-center justify-center px-8 text-center">
                <p className="text-xs uppercase tracking-[0.3em]" style={{ ...bFont, color: t.accent }}>{brand}</p>
                <h2 className="mt-5 leading-tight" style={{ ...hFont, ...hSize(44) }}>{headline}</h2>
                <p className="mt-5 text-base leading-relaxed opacity-80" style={bFont}>{about}</p>
              </div>
            )}

            {format === "card" && (
              <div className="p-6 md:p-10">
                <div className="mx-auto flex aspect-[1.75] max-w-lg flex-col justify-between p-6 shadow-lg md:p-8" style={{ background: t.bg, border: `1px solid ${t.text}22` }}>
                  <h2 className="leading-tight" style={{ ...hFont, ...hSize(34) }}>{brand}</h2>
                  <div style={bFont} className="text-sm leading-relaxed">
                    <p style={{ color: t.accent }} className="uppercase tracking-[0.2em]">{headline}</p>
                    <p className="mt-1 opacity-80">hello@yourbrand.com · @yourbrand</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className={btnDark} onClick={() => copy(fontCss(pair), "Font CSS copied")}>
              Copy font CSS
            </button>
            <button type="button" className={btn} onClick={() => copy(`Heading: ${pair.heading}\nBody: ${pair.body}`, "Font names copied")}>
              Copy font names
            </button>
            <button type="button" className={btn} onClick={download}>
              Download preview
            </button>
            {toast && <span className="self-center font-serif text-lg text-denim">{toast}</span>}
          </div>
          <p className="mt-3 font-serif text-base text-cocoa/60">
            All fonts are free on Google Fonts and also available in Canva.
          </p>
        </div>
      </div>

      {/* All pairings */}
      <div>
        <h2 className="text-center font-script text-5xl text-denim">Browse all pairings</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FONT_PAIRS.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setIndex(i);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`border p-5 text-left transition hover:bg-paper ${
                i === index ? "border-denim bg-paper" : "border-cocoa/20"
              }`}
            >
              <p className="text-3xl leading-tight text-ink" style={{ fontFamily: headingFont(p) }}>
                {p.name}
              </p>
              <p className="mt-2 text-base text-ink/70" style={{ fontFamily: bodyFont(p) }}>
                {p.mood}. {p.heading} + {p.body}.
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ColorField({
  label: name,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const [shown, setShown] = useState(value);
  // Keep the text box in sync when the color changes elsewhere
  if (shown !== value) {
    setShown(value);
    setDraft(value);
  }

  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        aria-label={`${name} color`}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-12 cursor-pointer border border-cocoa/30 bg-cream p-0.5"
      />
      <input
        value={draft}
        aria-label={`${name} hex code`}
        maxLength={7}
        onChange={(e) => {
          const v = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
          setDraft(v);
          if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v.toLowerCase());
        }}
        className="w-28 border border-cocoa/30 bg-cream px-2 py-1.5 font-mono text-sm text-cocoa uppercase outline-none focus:border-denim"
      />
      <span className="text-[0.6rem] uppercase tracking-[0.2em] text-cocoa/70">
        {name}
      </span>
    </div>
  );
}
