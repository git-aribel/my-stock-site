import type { ReactNode } from "react";

// Sparkles placed around the text: [left %, top %, size px, delay s]
const SPARKLES: [number, number, number, number][] = [
  [-4, 10, 22, 0],
  [12, -18, 14, 0.9],
  [46, -22, 18, 1.6],
  [78, -14, 12, 0.4],
  [101, 18, 20, 1.2],
  [88, 92, 14, 2],
  [30, 96, 12, 0.7],
];

function Sparkle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 0c.8 6.2 5 10.6 12 12-7 1.4-11.2 5.8-12 12-.8-6.2-5-10.6-12-12C7 10.6 11.2 6.2 12 0z"
        fill="#fbf7f0"
      />
    </svg>
  );
}

// Text with a shimmering glitter fill and little twinkling sparkles around it
export default function GlitterText({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block">
      <span className="glitter-text">{children}</span>
      {SPARKLES.map(([x, y, size, delay], i) => (
        <span
          key={i}
          className="glitter-spark pointer-events-none absolute"
          style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s` }}
        >
          <Sparkle size={size} />
        </span>
      ))}
    </span>
  );
}
