"use client";

import { useEffect, useRef, useState } from "react";
import {
  CURATED_DUOS,
  CURATED_PALETTES,
  hexToRgb,
  isLight,
  nameColors,
  paletteFromImage,
  randomDuo,
  randomPalette,
} from "@/lib/colors";
import { FONT_PAIRS, fontStack } from "@/lib/fontPairs";
import { copyText, downloadCanvas, useGoogleFonts } from "@/lib/useGoogleFonts";

const label = "text-[0.65rem] uppercase tracking-[0.25em] text-cocoa/70";
const input =
  "w-full border border-cocoa/30 bg-cream px-3 py-2 font-serif text-lg text-cocoa outline-none focus:border-denim";
const btn =
  "border border-cocoa px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-rose/40";
const btnDark =
  "bg-cocoa px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep";

type Mode = "five" | "two";


// Where each color sits in the 5-color mosaic: [column, row start, row span]
// on a 2 x 6 grid. Dark on the top left, light background below it, and
// the three middle colors stacked on the right.
const MOSAIC: Record<number, [number, number, number]> = {
  4: [1, 1, 3],
  0: [1, 4, 3],
  3: [2, 1, 2],
  1: [2, 3, 2],
  2: [2, 5, 2],
};

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export default function ColorPalette() {
  // 5-color palettes and 2-color pairs are kept separately, so switching
  // back and forth doesn't lose either one
  const [mode, setMode] = useState<Mode>("five");
  const [five, setFive] = useState<string[]>(CURATED_PALETTES[0].colors);
  const [two, setTwo] = useState<string[]>(CURATED_DUOS[0].colors);
  const [lockedFive, setLockedFive] = useState<boolean[]>([false, false, false, false, false]);
  const [lockedTwo, setLockedTwo] = useState<boolean[]>([false, false]);
  const isTwo = mode === "two";
  const colors = isTwo ? two : five;
  const setColors = isTwo ? setTwo : setFive;
  const locked = isTwo ? lockedTwo : lockedFive;
  const setLocked = isTwo ? setLockedTwo : setLockedFive;
  const curated = isTwo ? CURATED_DUOS : CURATED_PALETTES;

  const names = nameColors(colors);

  // What each color is used for on the brand board
  const roles = isTwo
    ? { bg: two[0], soft: two[1], accent: two[1], feature: two[1], ink: two[1] }
    : { bg: five[0], soft: five[1], accent: five[2], feature: five[3], ink: five[4] };
  const [brand, setBrand] = useState("Your Brand");
  const [tagline, setTagline] = useState("Pretty content, made simple");
  const [pairIndex, setPairIndex] = useState(0);
  const [logo, setLogo] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const pair = FONT_PAIRS[pairIndex];
  useGoogleFonts([
    pair.heading,
    pair.body,
    "Cormorant Garamond:ital,wght@0,400;0,500;1,500",
    "Jost:wght@400;500",
  ]);
  const hFont = fontStack(pair.heading, pair.headingFallback);
  const bFont = fontStack(pair.body, pair.bodyFallback);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  function applyPalette(next: string[]) {
    setColors((prev) => prev.map((c, i) => (locked[i] ? c : next[i])));
  }

  function generate() {
    applyPalette(isTwo ? randomDuo() : randomPalette());
  }

  // Space bar makes a new palette, unless you're typing
  const generateRef = useRef(generate);
  useEffect(() => {
    generateRef.current = generate;
  });
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (e.code === "Space" && !["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(tag)) {
        e.preventDefault();
        generateRef.current();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function onPhoto(file: File) {
    if (photo) URL.revokeObjectURL(photo);
    const url = URL.createObjectURL(file);
    setPhoto(url);
    try {
      applyPalette(paletteFromImage(await loadImage(url), colors.length));
    } catch {
      flash("Couldn't read that image.");
    }
  }

  function onLogo(file: File) {
    if (logo) URL.revokeObjectURL(logo);
    setLogo(URL.createObjectURL(file));
  }

  async function copy(text: string, msg: string) {
    flash((await copyText(text)) ? msg : "Couldn't copy. Please try again.");
  }

  // Saves the palette as an image, in the same layout as on screen
  async function downloadPalette() {
    await Promise.all([
      document.fonts.load(`500 96px 'Cormorant Garamond'`),
      document.fonts.load(`italic 500 96px 'Cormorant Garamond'`),
      document.fonts.load(`24px 'Jost'`),
      document.fonts.load(`500 24px 'Jost'`),
    ]);
    if (isTwo) return downloadPair();

    const W = 1200;
    const H = 1800;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    const rows = 6;
    colors.forEach((c, i) => {
      const [col, row, span] = MOSAIC[i];
      const x = (col - 1) * (W / 2);
      const y = ((row - 1) * H) / rows;
      const w = W / 2;
      const h = (span * H) / rows;
      ctx.fillStyle = c;
      ctx.fillRect(x, y, w, h);
      const fg = isLight(c) ? "#36211b" : "#fbf7f0";
      const [r, g, b] = hexToRgb(c);
      const pad = 64;
      const bottom = y + h - pad;
      ctx.fillStyle = fg;
      ctx.textBaseline = "alphabetic";
      ctx.font = `500 22px 'Jost', sans-serif`;
      ctx.letterSpacing = "3px";
      ctx.fillText("RGB", x + pad, bottom);
      ctx.fillText(`${r} ${g} ${b}`, x + pad + 90, bottom);
      ctx.fillText("HEX", x + pad, bottom - 40);
      ctx.fillText(c.toUpperCase(), x + pad + 90, bottom - 40);
      ctx.letterSpacing = "0px";
      ctx.font = `500 80px 'Cormorant Garamond', serif`;
      ctx.fillText(names[i], x + pad, bottom - 100, w - pad * 2);
    });
    downloadCanvas(canvas, "color-palette.png");
  }

  // Two colors stacked: dark on top, light below, names centered
  function downloadPair() {
    const W = 1080;
    const H = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    const [light, dark] = colors;
    const half = H / 2;

    [1, 0].forEach((i, n) => {
      const c = colors[i];
      const fg = i === 1 ? light : dark;
      const top = n * half;
      ctx.fillStyle = c;
      ctx.fillRect(0, top, W, half);
      ctx.fillStyle = fg;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";

      // Name
      ctx.letterSpacing = "-2px";
      ctx.font = `${i === 0 ? "italic " : ""}500 150px 'Cormorant Garamond', serif`;
      const mid = top + half / 2;
      ctx.fillText(names[i], W / 2, mid + 10, W - 140);

      // HEX and RGB, side by side under the name
      const [r, g, b] = hexToRgb(c);
      ctx.letterSpacing = "0px";
      ctx.font = `500 34px 'Jost', sans-serif`;
      ctx.textAlign = "right";
      ctx.fillText("HEX", W / 2 - 20, mid + 85);
      ctx.textAlign = "left";
      ctx.fillText("RGB", W / 2 + 20, mid + 85);
      ctx.font = `34px 'Jost', sans-serif`;
      ctx.textAlign = "right";
      ctx.fillText(c.toUpperCase(), W / 2 - 20, mid + 130);
      ctx.textAlign = "left";
      ctx.fillText(`${r} ${g} ${b}`, W / 2 + 20, mid + 130);
    });

    // Small labels
    ctx.font = `22px 'Jost', sans-serif`;
    ctx.letterSpacing = "4px";
    ctx.fillStyle = light;
    ctx.textAlign = "left";
    ctx.fillText("COLOR", 80, 90);
    const colorW = ctx.measureText("COLOR").width;
    ctx.fillRect(80 + colorW + 20, 82, 70, 2);
    ctx.fillText("COMBOS", 80 + colorW + 110, 90);
    ctx.fillStyle = dark;
    ctx.textAlign = "center";
    ctx.fillText("SOCIALS BESTIE", W / 2, H - 70);

    downloadCanvas(canvas, "color-pair.png");
  }

  async function download() {
    await Promise.all([
      document.fonts.load(`80px '${pair.heading}'`),
      document.fonts.load(`28px '${pair.body}'`),
    ]);
    const W = 1600;
    const H = 1000;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    const { bg, ink, feature } = roles;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Left: name, tagline, fonts
    const pad = 90;
    let y = pad;
    if (logo) {
      try {
        const img = await loadImage(logo);
        const h = 120;
        const w = Math.min(360, (img.width / img.height) * h);
        ctx.drawImage(img, pad, y, w, (w / img.width) * img.height);
        y += 150;
      } catch {}
    }
    ctx.fillStyle = ink;
    ctx.textBaseline = "top";
    ctx.font = `96px ${hFont}`;
    ctx.fillText(brand, pad, y, 700);
    y += 130;
    ctx.fillStyle = feature;
    ctx.font = `34px ${bFont}`;
    ctx.fillText(tagline, pad, y, 700);
    y += 110;

    ctx.fillStyle = ink;
    ctx.font = `22px ${bFont}`;
    ctx.fillText("TYPOGRAPHY", pad, y);
    y += 44;
    ctx.font = `60px ${hFont}`;
    ctx.fillText(pair.heading, pad, y, 700);
    y += 80;
    ctx.font = `34px ${bFont}`;
    ctx.fillText(pair.body, pad, y, 700);

    // Right: swatches
    const sx = 860;
    const sw = (W - sx - pad) / colors.length;
    const sh = H - pad * 2 - 90;
    colors.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect(sx + i * sw, pad, sw, sh);
      ctx.fillStyle = ink;
      ctx.font = `24px ${bFont}`;
      ctx.fillText(c.toUpperCase(), sx + i * sw + 8, pad + sh + 24);
    });
    ctx.strokeStyle = `${ink}33`;
    ctx.strokeRect(sx, pad, sw * colors.length, sh);

    downloadCanvas(canvas, "brand-board.png");
  }

  const { bg, soft, accent, feature, ink } = roles;

  return (
    <div className="space-y-12">
      {/* Palette strip */}
      <div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex w-fit border border-cocoa/30">
              {(
                [
                  ["five", "5 colors"],
                  ["two", "2 colors"],
                ] as [Mode, string][]
              ).map(([value, name]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  className={`px-4 py-2 text-[0.65rem] uppercase tracking-[0.2em] transition ${
                    mode === value ? "bg-cocoa text-periwinkle" : "text-cocoa hover:bg-rose/30"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
            <p className="mt-3 font-serif text-lg text-ink/75">
              Click a color to copy it. Lock the ones you love, then generate
              again.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btnDark} onClick={generate}>
              Generate
            </button>
            <button type="button" className={btn} onClick={() => photoRef.current?.click()}>
              From a photo
            </button>
            <button type="button" className={btn} onClick={() => copy(colors.map((c) => c.toUpperCase()).join(", "), "Palette copied")}>
              Copy palette
            </button>
            <button type="button" className={btn} onClick={downloadPalette}>
              Download
            </button>
          </div>
        </div>
        <input ref={photoRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onPhoto(f); e.target.value = ""; }} />

        {isTwo ? (
          <div className="mx-auto mt-6 flex aspect-[4/5] max-w-xl flex-col overflow-hidden border border-cocoa/20">
            {[1, 0].map((i) => {
              const c = colors[i];
              const fg = colors[i === 1 ? 0 : 1];
              const [r, g, b] = hexToRgb(c);
              return (
                <div
                  key={i}
                  className="relative flex flex-1 flex-col items-center justify-center px-6 text-center"
                  style={{ background: c, color: fg }}
                >
                  <button
                    type="button"
                    onClick={() => copy(c.toUpperCase(), `${c.toUpperCase()} copied`)}
                    className="absolute inset-0"
                    aria-label={`Copy ${c}`}
                  />
                  {i === 1 && (
                    <p className="pointer-events-none absolute left-5 top-5 flex items-center gap-3 text-[0.55rem] tracking-[0.2em] md:left-8 md:top-8 md:text-[0.65rem]">
                      COLOR <span className="inline-block h-px w-10 bg-current" /> COMBOS
                    </p>
                  )}
                  <div className="absolute right-4 top-4 flex items-center gap-3 md:right-6 md:top-6">
                    <label
                      className="relative cursor-pointer text-[0.6rem] uppercase tracking-[0.2em] opacity-70 hover:opacity-100"
                      title="Change this color"
                    >
                      Edit
                      <input
                        type="color"
                        value={c}
                        onChange={(e) => setColors((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setLocked((l) => l.map((v, j) => (j === i ? !v : v)))}
                      aria-label={locked[i] ? "Unlock color" : "Lock color"}
                      title={locked[i] ? "Locked" : "Lock this color"}
                      className={`relative text-base ${locked[i] ? "" : "opacity-60 hover:opacity-100"}`}
                    >
                      {locked[i] ? "🔒" : "🔓"}
                    </button>
                  </div>
                  <div className="pointer-events-none relative">
                    <p
                      className={`text-5xl leading-none tracking-tight md:text-7xl ${i === 0 ? "italic" : ""}`}
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}
                    >
                      {names[i]}
                    </p>
                    <div className="mt-4 flex justify-center gap-6 text-sm md:mt-6 md:text-lg" style={{ fontFamily: "'Jost', sans-serif" }}>
                      <div className="text-right">
                        <p className="font-medium">HEX</p>
                        <p>{c.toUpperCase()}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">RGB</p>
                        <p>
                          {r} {g} {b}
                        </p>
                      </div>
                    </div>
                  </div>
                  {i === 0 && (
                    <p className="pointer-events-none absolute bottom-5 text-[0.55rem] tracking-[0.25em] opacity-80 md:bottom-8 md:text-[0.65rem]">
                      SOCIALS BESTIE
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto mt-6 grid h-[560px] max-w-4xl grid-cols-2 grid-rows-6 overflow-hidden border border-cocoa/20 md:h-[680px]">
            {colors.map((c, i) => {
              const [col, row, span] = MOSAIC[i];
              const fg = isLight(c) ? "#36211b" : "#fbf7f0";
              const [r, g, b] = hexToRgb(c);
              return (
                <div
                  key={i}
                  className="group relative flex flex-col justify-end p-5 md:p-10"
                  style={{ background: c, color: fg, gridColumn: col, gridRow: `${row} / span ${span}` }}
                >
                  <button
                    type="button"
                    onClick={() => copy(c.toUpperCase(), `${c.toUpperCase()} copied`)}
                    className="absolute inset-0"
                    aria-label={`Copy ${c}`}
                  />
                  <div className="absolute right-3 top-3 flex items-center gap-3 md:right-5 md:top-5">
                    <label
                      className="relative cursor-pointer text-[0.6rem] uppercase tracking-[0.2em] opacity-70 hover:opacity-100"
                      title="Change this color"
                    >
                      Edit
                      <input
                        type="color"
                        value={c}
                        onChange={(e) => setColors((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setLocked((l) => l.map((v, j) => (j === i ? !v : v)))}
                      aria-label={locked[i] ? "Unlock color" : "Lock color"}
                      title={locked[i] ? "Locked" : "Lock this color"}
                      className={`relative text-base ${locked[i] ? "" : "opacity-60 hover:opacity-100"}`}
                    >
                      {locked[i] ? "🔒" : "🔓"}
                    </button>
                  </div>
                  <div className="pointer-events-none relative">
                    <p className="font-serif text-3xl leading-none md:text-5xl">{names[i]}</p>
                    <dl className="mt-3 grid w-fit grid-cols-[auto_auto] gap-x-5 gap-y-1 text-[0.6rem] tracking-[0.15em] md:mt-5 md:text-xs">
                      <dt>HEX</dt>
                      <dd>{c.toUpperCase()}</dd>
                      <dt>RGB</dt>
                      <dd>
                        {r} {g} {b}
                      </dd>
                    </dl>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <p className="font-serif text-base text-cocoa/60">
            Tip: press the space bar to generate a new {isTwo ? "pair" : "palette"}.
          </p>
          {photo && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={photo} alt="Your inspiration photo" className="h-12 w-12 object-cover" />
          )}
          {toast && <span className="font-serif text-lg text-denim">{toast}</span>}
        </div>
      </div>

      {/* Curated */}
      <div>
        <p className={label}>
          {isTwo ? "Or start from a popular pair" : "Or start from an aesthetic"}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {curated.map((p) => (
            <button key={p.name} type="button" onClick={() => { setColors(p.colors); setLocked(p.colors.map(() => false)); }} className="border border-cocoa/20 bg-paper p-3 text-left transition hover:border-denim">
              <div className="flex h-12 overflow-hidden">
                {p.colors.map((c) => (
                  <span key={c} className="flex-1" style={{ background: c }} />
                ))}
              </div>
              <p className="mt-2 font-serif text-lg text-ink">{p.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Brand board */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-start">
        <div className="space-y-4 border border-cocoa/25 bg-paper p-6">
          <p className={label}>Make it your brand board</p>
          <div className="space-y-2">
            <label htmlFor="cp-brand" className={label}>Brand name</label>
            <input id="cp-brand" value={brand} maxLength={30} onChange={(e) => setBrand(e.target.value)} className={input} />
          </div>
          <div className="space-y-2">
            <label htmlFor="cp-tag" className={label}>Tagline</label>
            <input id="cp-tag" value={tagline} maxLength={60} onChange={(e) => setTagline(e.target.value)} className={input} />
          </div>
          <div className="space-y-2">
            <label htmlFor="cp-font" className={label}>Fonts</label>
            <select id="cp-font" value={pairIndex} onChange={(e) => setPairIndex(Number(e.target.value))} className={input}>
              {FONT_PAIRS.map((p, i) => (
                <option key={p.name} value={i}>
                  {p.name} · {p.heading} + {p.body}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <button type="button" className={btn} onClick={() => logoRef.current?.click()}>
              {logo ? "Change logo" : "Add your logo"}
            </button>
            {logo && (
              <button type="button" className={btn} onClick={() => { URL.revokeObjectURL(logo); setLogo(null); }}>
                Remove logo
              </button>
            )}
          </div>
          <input ref={logoRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onLogo(f); e.target.value = ""; }} />
          <button type="button" className={`${btnDark} w-full py-3`} onClick={download}>
            Download brand board
          </button>
          <p className="font-serif text-base text-cocoa/60">
            Everything stays on your device. Nothing is uploaded.
          </p>
        </div>

        <div className="overflow-hidden border border-cocoa/20 shadow-[0_20px_50px_-25px_rgba(74,47,39,0.5)]" style={{ background: bg, color: ink }}>
          <div className="grid gap-8 p-6 md:grid-cols-2 md:p-10">
            <div>
              {logo && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={logo} alt="Your logo" className="mb-6 max-h-20 max-w-[220px] object-contain" />
              )}
              <h2 className="text-5xl leading-tight" style={{ fontFamily: hFont }}>{brand}</h2>
              <p className="mt-3 text-lg" style={{ fontFamily: bFont, color: feature }}>{tagline}</p>

              <p className="mt-8 text-[0.6rem] uppercase tracking-[0.3em] opacity-70" style={{ fontFamily: bFont }}>Typography</p>
              <p className="mt-2 text-3xl" style={{ fontFamily: hFont }}>{pair.heading}</p>
              <p className="text-base opacity-80" style={{ fontFamily: bFont }}>{pair.body} · for body text</p>

              <div className="mt-8 flex flex-wrap gap-3" style={{ fontFamily: bFont }}>
                <span className="px-5 py-2.5 text-xs uppercase tracking-[0.2em]" style={{ background: feature, color: isLight(feature) ? ink : bg }}>
                  Shop now
                </span>
                <span className="border px-5 py-2.5 text-xs uppercase tracking-[0.2em]" style={{ borderColor: ink }}>
                  Learn more
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-1 items-end p-5" style={{ background: soft, minHeight: 140 }}>
                <p className="text-2xl" style={{ fontFamily: hFont, color: isLight(soft) ? ink : bg }}>
                  New post ✦
                </p>
              </div>
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${colors.length}, minmax(0, 1fr))` }}
              >
                {colors.map((c, i) => (
                  <div key={i}>
                    <div className="aspect-square border" style={{ background: c, borderColor: `${ink}22` }} />
                    <p className="mt-1 truncate font-mono text-[0.6rem]">{c.toUpperCase()}</p>
                  </div>
                ))}
              </div>
              <div className="h-3" style={{ background: accent }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
