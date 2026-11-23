// Lace-edged paper (pieces of a real photo, see .lace in globals.css)
export default function LacePaper({ children }: { children: React.ReactNode }) {
  return (
    <div className="lace">
      {["fill", "tl", "tr", "bl", "br", "top", "bottom", "left", "right"].map((p) => (
        <span key={p} aria-hidden="true" className={`lace-piece lace-${p}`} />
      ))}
      {children}
    </div>
  );
}
