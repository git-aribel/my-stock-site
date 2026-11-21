// ✏️ ARY'S MASCOT
// This is a drawn placeholder. To use your own mascot, add the image to the
// /public folder (e.g. public/ary.png) and set MASCOT_SRC to "/ary.png".
const MASCOT_SRC: string | null = null;

export default function AryAvatar({
  size = 48,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  if (MASCOT_SRC) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={MASCOT_SRC}
        alt="Ary"
        width={size}
        height={size}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Ary"
      className={`shrink-0 ${className}`}
    >
      {/* Background */}
      <circle cx="32" cy="32" r="32" fill="#b9c8f2" />
      {/* Hair bun */}
      <circle cx="32" cy="12" r="7" fill="#4a2f27" />
      {/* Neck and top */}
      <path d="M26 46h12v6H26z" fill="#e8c9b4" />
      <path d="M12 64c2-9 10-14 20-14s18 5 20 14z" fill="#46608a" />
      <path d="M28 50l4 5 4-5" fill="none" stroke="#fbf7f0" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Hair behind face */}
      <path d="M17 33c0-11 7-18 15-18s15 7 15 18v8c-3 2-6 2-8 1V30H25v12c-2 1-5 1-8-1z" fill="#4a2f27" />
      {/* Face */}
      <ellipse cx="32" cy="34" rx="11" ry="12.5" fill="#f3dccd" />
      {/* Fringe */}
      <path d="M21 31c1-8 6-12 11-12s10 4 11 12c-4-1-8-4-10-8-2 4-7 7-12 8z" fill="#4a2f27" />
      {/* Eyes */}
      <path d="M26.5 35q1.5-1.6 3 0" fill="none" stroke="#36211b" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M34.5 35q1.5-1.6 3 0" fill="none" stroke="#36211b" strokeWidth="1.4" strokeLinecap="round" />
      {/* Cheeks */}
      <circle cx="25.5" cy="38.5" r="2" fill="#dcbdb8" />
      <circle cx="38.5" cy="38.5" r="2" fill="#dcbdb8" />
      {/* Smile */}
      <path d="M29.5 40.5q2.5 2.4 5 0" fill="none" stroke="#36211b" strokeWidth="1.3" strokeLinecap="round" />
      {/* Sparkle */}
      <path d="M51 14l1.2 3.3L55.5 18.5l-3.3 1.2L51 23l-1.2-3.3L46.5 18.5l3.3-1.2z" fill="#fbf7f0" />
    </svg>
  );
}
