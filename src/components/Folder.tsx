import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";

// Where the three tabs sit on the folder images in /public/folders
// (% from the left, and the tabs' middle in % from the top)
const TAB_X = [19.6, 50.3, 80.2];
const TAB_Y = 7.5;

// A divider folder with three tabs on top, like an index-card file.
// `active` (0, 1 or 2) is the tab that holds this folder's label.
// ✏️ Pass `image` to use one of the recolored folder pictures in
//    /public/folders (the default look). Without it, `finish` draws the
//    folder in code: "paper" (card stock in `color`) or "chrome" (silver). Styles are in globals.css.
export default function Folder({
  color,
  active,
  tab,
  finish = "paper",
  image,
  children,
}: {
  color: string;
  image?: string;
  active: 0 | 1 | 2;
  tab: ReactNode;
  finish?: "chrome" | "paper";
  children: ReactNode;
}) {
  if (image) {
    return (
      <div className="folder relative aspect-[372/260] w-full drop-shadow-[0_6px_10px_rgba(74,47,39,0.12)]">
        <Image src={image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-contain" />
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2 text-[0.6rem] uppercase tracking-[0.25em] text-cream/85"
          style={{ left: `${TAB_X[active]}%`, top: `${TAB_Y}%` }}
        >
          {tab}
        </span>
        <div className="absolute inset-x-0 bottom-0 top-[10%] flex items-center justify-center text-cream">{children}</div>
      </div>
    );
  }

  const surface = finish === "chrome" ? "chrome" : "paper";
  const style: CSSProperties =
    finish === "chrome" ? ({ "--tint": color } as CSSProperties) : { backgroundColor: color };
  const text = finish === "chrome" ? "chrome-text" : "text-cream";

  return (
    <div className={`folder relative ${finish === "chrome" ? "folder-chrome" : "drop-shadow-[0_1px_1px_rgba(74,47,39,0.12)]"}`}>
      {/* Tabs */}
      <div className="relative flex h-8 pl-[9%]">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`folder-tab ${surface} relative -ml-[1.5%] flex flex-1 items-center justify-center first:ml-0 ${
              i === active ? "folder-tab-active z-[2]" : "z-[1]"
            }`}
            style={style}
          >
            {i === active && (
              <span className={`relative pt-1 text-[0.6rem] uppercase tracking-[0.25em] ${text}`}>{tab}</span>
            )}
          </div>
        ))}
      </div>
      {/* Folder body */}
      <div
        className={`${surface} ${text} relative -mt-px flex h-44 flex-col items-center justify-center rounded-b-[6px] rounded-tr-[4px]`}
        style={style}
      >
        {children}
      </div>
    </div>
  );
}
