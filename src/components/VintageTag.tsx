// Vintage paper labels, drawn as vector shapes so they stay sharp at any size.
// Colors are palette variables, so the labels invert in dark mode.
// Each one copies a label from a photo: the shape, the border lines and the
// little leaf ornaments, with a soft paper grain on top.

type Edge = "flat" | "arch" | "peak" | "point";

type Shape = {
  r: number; // size of the notches cut into the corners
  top: Edge; // how the top and bottom edges curve
  amp: number; // how far the top and bottom edges rise
  side: Edge;
  sideAmp: number;
};

function frame(x: number, y: number, w: number, h: number, s: Shape) {
  const { r } = s;
  const Y0 = y + (s.top === "flat" ? 0 : s.amp);
  const Y1 = y + h - (s.top === "flat" ? 0 : s.amp);
  const X0 = x + (s.side === "flat" ? 0 : s.sideAmp);
  const X1 = x + w - (s.side === "flat" ? 0 : s.sideAmp);
  const cx = x + w / 2;
  const cy = y + h / 2;

  // One edge between two corners, with its middle pushed out to `apex`
  const edge = (
    kind: Edge,
    to: [number, number],
    apex: [number, number],
    horizontal: boolean,
    from: [number, number],
  ) => {
    const [tx, ty] = to;
    const [ax, ay] = apex;
    if (kind === "flat") return `L${tx} ${ty}`;
    if (kind === "point") return `L${ax} ${ay}L${tx} ${ty}`;
    if (kind === "arch") {
      const qx = horizontal ? ax : 2 * ax - (from[0] + tx) / 2;
      const qy = horizontal ? 2 * ay - (from[1] + ty) / 2 : ay;
      return `Q${qx} ${qy} ${tx} ${ty}`;
    }
    // "peak": flat most of the way, then a small curl up to a point
    const [fx, fy] = from;
    if (horizontal) {
      const dir = tx > fx ? 1 : -1;
      return `C${ax - dir * 70} ${fy} ${ax - dir * 16} ${fy} ${ax} ${ay}C${ax + dir * 16} ${ty} ${ax + dir * 70} ${ty} ${tx} ${ty}`;
    }
    const dir = ty > fy ? 1 : -1;
    return `C${fx} ${ay - dir * 50} ${fx} ${ay - dir * 12} ${ax} ${ay}C${tx} ${ay + dir * 12} ${tx} ${ay + dir * 50} ${tx} ${ty}`;
  };

  const notch = (tx: number, ty: number) => `A${r} ${r} 0 0 0 ${tx} ${ty}`;

  return [
    `M${X0 + r} ${Y0}`,
    edge(s.top, [X1 - r, Y0], [cx, y], true, [X0 + r, Y0]),
    notch(X1, Y0 + r),
    edge(s.side, [X1, Y1 - r], [x + w, cy], false, [X1, Y0 + r]),
    notch(X1 - r, Y1),
    edge(s.top, [X0 + r, Y1], [cx, y + h], true, [X1 - r, Y1]),
    notch(X0, Y1 - r),
    edge(s.side, [X0, Y0 + r], [x, cy], false, [X0, Y1 - r]),
    notch(X0 + r, Y0),
    "Z",
  ].join("");
}

type Line = { inset: number; width: number };

export type TagStyle = {
  w: number;
  h: number;
  shape: Shape;
  rim?: string; // a lighter paper edge around the label
  paper: string;
  stroke: string;
  lines: Line[];
  ornaments?: ("top" | "bottom")[];
};

export const TAG_STYLES: Record<"scallop" | "blue" | "red" | "crest", TagStyle> = {
  // Dusty blue label with a wavy top and a fine double cocoa line
  scallop: {
    w: 460,
    h: 330,
    shape: { r: 30, top: "arch", amp: 22, side: "arch", sideAmp: 14 },
    rim: "var(--paper)",
    paper: "var(--dusty-blue)",
    stroke: "var(--cocoa-deep)",
    lines: [
      { inset: 22, width: 1.4 },
      { inset: 27, width: 0.8 },
    ],
    ornaments: ["bottom"],
  },
  // Paper label with a rose double border and a little point top and bottom
  blue: {
    w: 460,
    h: 320,
    shape: { r: 34, top: "peak", amp: 14, side: "arch", sideAmp: 20 },
    paper: "var(--paper)",
    stroke: "var(--rose-deep)",
    lines: [
      { inset: 3, width: 3.2 },
      { inset: 10, width: 1.3 },
    ],
  },
  // Paper label with clipped corners and a denim double border
  red: {
    w: 460,
    h: 272,
    shape: { r: 22, top: "flat", amp: 0, side: "flat", sideAmp: 0 },
    paper: "var(--paper)",
    stroke: "var(--denim)",
    lines: [
      { inset: 3, width: 2.4 },
      { inset: 10, width: 1.2 },
    ],
  },
  // Cocoa crest with rose lines that comes to a point top and bottom
  crest: {
    w: 460,
    h: 350,
    shape: { r: 26, top: "point", amp: 54, side: "flat", sideAmp: 0 },
    rim: "var(--paper)",
    paper: "var(--cocoa)",
    stroke: "var(--rose)",
    lines: [
      { inset: 22, width: 1.4 },
      { inset: 27, width: 0.8 },
    ],
    ornaments: ["top", "bottom"],
  },
};

// Three little leaves, pointing up or down
function Leaves({ x, y, flip, color }: { x: number; y: number; flip?: boolean; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(1 ${flip ? -1 : 1})`} style={{ fill: color }}>
      <path d="M0 0C-1.6-3-1.6-6 0-9 1.6-6 1.6-3 0 0Z" />
      <path d="M-1 0C-4-.6-7.5-2.6-9-6-5.5-5.6-2.6-3.6-1 0Z" />
      <path d="M1 0C4-.6 7.5-2.6 9-6 5.5-5.6 2.6-3.6 1 0Z" />
    </g>
  );
}

export default function VintageTag({ style, id, className = "" }: { style: TagStyle; id: string; className?: string }) {
  const { w, h, shape, lines } = style;
  const pad = 4; // room for the outer edge
  const outer = frame(pad, pad, w - pad * 2, h - pad * 2, shape);
  const paperInset = style.rim ? 7 : 0;
  const paper = frame(pad + paperInset, pad + paperInset, w - (pad + paperInset) * 2, h - (pad + paperInset) * 2, shape);
  const at = (k: number) => frame(pad + k, pad + k, w - (pad + k) * 2, h - (pad + k) * 2, shape);
  const deepest = lines[lines.length - 1]?.inset ?? 20;
  const pointAmp = shape.top === "point" ? shape.amp * 0.55 : 0;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden="true">
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={outer} />
        </clipPath>
        {/* Fine paper grain */}
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7" />
          <feColorMatrix values="0 0 0 0 0.36  0 0 0 0 0.27  0 0 0 0 0.2  0 0 0 0.16 -0.02" />
        </filter>
        {/* Soft, uneven ageing */}
        <filter id={`${id}-age`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="3" />
          <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.42  0 0 0 0 0.28  0 0 0 0.22 -0.06" />
        </filter>
      </defs>

      {style.rim && <path d={outer} style={{ fill: style.rim }} />}
      <path d={paper} style={{ fill: style.paper }} />
      <g clipPath={`url(#${id}-clip)`}>
        <rect width={w} height={h} filter={`url(#${id}-age)`} />
        <rect width={w} height={h} filter={`url(#${id}-grain)`} />
      </g>

      {lines.map((l) => (
        <path key={l.inset} d={at(l.inset)} fill="none" style={{ stroke: style.stroke }} strokeWidth={l.width} strokeLinejoin="round" />
      ))}

      {style.ornaments?.includes("bottom") && (
        <Leaves x={w / 2} y={h - pad - deepest - 4 - pointAmp} color={style.stroke} />
      )}
      {style.ornaments?.includes("top") && (
        <Leaves x={w / 2} y={pad + deepest + 4 + pointAmp} flip color={style.stroke} />
      )}
    </svg>
  );
}
