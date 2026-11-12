import Link from "next/link";

const links = [
  { href: "/videos", label: "Videos" },
  { href: "/templates", label: "Templates" },
  { href: "/images", label: "Images" },
  { href: "/stickers", label: "Stickers" },
  { href: "/pricing", label: "Pricing" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-cocoa/20 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="font-script text-4xl text-denim">
          Socials Bestie
        </Link>

        <nav className="hidden items-center gap-8 text-[0.7rem] font-light uppercase tracking-[0.25em] text-cocoa lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-denim">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6 text-[0.7rem] uppercase tracking-[0.25em]">
          <Link href="/login" className="font-light text-cocoa hover:text-denim">
            Log in
          </Link>
          <Link
            href="/pricing"
            className="bg-cocoa px-5 py-2.5 text-periwinkle transition hover:bg-cocoa-deep"
          >
            Join now
          </Link>
        </div>
      </div>
    </header>
  );
}