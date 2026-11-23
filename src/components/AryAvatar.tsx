// ✏️ ARY'S MASCOT
// A black cat peeking over a laptop (drawn below). To use your own mascot, add the image to the
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
      {/* Tail curling up behind the laptop */}
      <path d="M44 44c6-1 9-5 8-11-.6-3 1-5 3.2-4.6" fill="none" stroke="#1d1719" strokeWidth="3.4" strokeLinecap="round" />
      {/* Body */}
      <ellipse cx="32" cy="42" rx="14" ry="9" fill="#1d1719" />
      {/* Ears */}
      <path d="M20.5 27 21.5 13.5 30 21z" fill="#1d1719" />
      <path d="M43.5 27 42.5 13.5 34 21z" fill="#1d1719" />
      <path d="M22.6 23.5 23 17 27 20.6z" fill="#c79f9b" />
      <path d="M41.4 23.5 41 17 37 20.6z" fill="#c79f9b" />
      {/* Head */}
      <ellipse cx="32" cy="28.5" rx="12.5" ry="10.5" fill="#1d1719" />
      {/* Eyes */}
      <ellipse cx="27" cy="28" rx="2.7" ry="3.1" fill="#e9c85b" />
      <ellipse cx="37" cy="28" rx="2.7" ry="3.1" fill="#e9c85b" />
      <ellipse cx="27" cy="28.2" rx="0.9" ry="2.4" fill="#1d1719" />
      <ellipse cx="37" cy="28.2" rx="0.9" ry="2.4" fill="#1d1719" />
      <circle cx="27.9" cy="26.9" r="0.7" fill="#fbf7f0" />
      <circle cx="37.9" cy="26.9" r="0.7" fill="#fbf7f0" />
      {/* Nose and mouth */}
      <path d="M30.8 32.2h2.4L32 33.6z" fill="#dcbdb8" />
      <path d="M32 33.6q-.6 1.4-2 1.2M32 33.6q.6 1.4 2 1.2" fill="none" stroke="#8a7a7c" strokeWidth="0.7" strokeLinecap="round" />
      {/* Whiskers */}
      <path d="M24 32.5l-6-1M24 34l-6 1M40 32.5l6-1M40 34l6 1" stroke="#fbf7f0" strokeWidth="0.6" strokeLinecap="round" opacity="0.75" />
      {/* Laptop: the back of the open lid, then the base */}
      <rect x="14" y="38" width="36" height="17" rx="2" fill="#fbf7f0" />
      <path d="M32 49.8c-2.6-1.7-4-3-4-4.5 0-1.2 1-2 2-2 .9 0 1.6.5 2 1.1.4-.6 1.1-1.1 2-1.1 1 0 2 .8 2 2 0 1.5-1.4 2.8-4 4.5z" fill="#c79f9b" />
      <path d="M11 55h42l-2.5 3.2h-37z" fill="#e3d6c6" />
      {/* Paws over the top of the screen */}
      <ellipse cx="25" cy="38.3" rx="3.6" ry="2.6" fill="#1d1719" />
      <ellipse cx="39" cy="38.3" rx="3.6" ry="2.6" fill="#1d1719" />
      {/* Sparkle */}
      <path d="M52 10l1.2 3.3L56.5 14.5l-3.3 1.2L52 19l-1.2-3.3L47.5 14.5l3.3-1.2z" fill="#fbf7f0" />
    </svg>
  );
}
