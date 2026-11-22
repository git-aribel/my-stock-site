// ✏️ THE LOGO
// The image in public/logo.png is used as a stencil, so the same file can be
// shown in any color (denim in the header, periwinkle in the footer...).
// To try another logo, switch LOGO below.
const LOGOS = {
  script: { src: "/logo-script.png", ratio: 1219 / 687 }, // "Socials Bestie" handwritten
  monogram: { src: "/logo-monogram.png", ratio: 1076 / 1350 }, // SB in a lace frame
  lace: { src: "/logo-lace.png", ratio: 1882 / 1498 }, // "Socials Bestie" in a lace frame
  plane: { src: "/logo-plane.png", ratio: 1199 / 471 }, // script with a paper plane
  orbit: { src: "/logo-orbit.png", ratio: 1866 / 1201 }, // script in an oval with two stars
  staggered: { src: "/logo-staggered.png", ratio: 1474 / 714 }, // bold script on two staggered lines
  badge: { src: "/logo-badge.png", ratio: 1660 / 745 }, // "socials [SB] bestie" with a framed monogram
  scriptBlue: { src: "/logo-script-blue.png", ratio: 1402 / 583 }, // two-line script, tighter, in blue
  badgeScript: { src: "/logo-badge-script.png", ratio: 1660 / 745 }, // "socials [SB] bestie", thin script SB
};
const LOGO = LOGOS.badgeScript;
const LOGO_SRC = LOGO.src;
const LOGO_RATIO = LOGO.ratio; // width / height of the image

export default function Logo({
  height,
  className = "",
}: {
  height: number;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label="Socials Bestie"
      className={`block bg-current ${className}`}
      style={{
        height,
        width: Math.round(height * LOGO_RATIO),
        WebkitMaskImage: `url(${LOGO_SRC})`,
        maskImage: `url(${LOGO_SRC})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
