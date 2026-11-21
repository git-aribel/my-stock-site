import Link from "next/link";
import AuthButtons from "@/components/AuthButtons";
import MobileMenu from "@/components/MobileMenu";

const links = [
  { href: "/videos", label: "Videos" },
  { href: "/templates", label: "Templates" },
  { href: "/images", label: "Images" },
  { href: "/stickers", label: "Stickers" },
  { href: "/tools", label: "Tools" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/affiliates", label: "Affiliates" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-cocoa/20 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-6 sm:px-6">
        <Link href="/" className="shrink-0 font-script text-4xl text-denim">
          Socials Bestie
        </Link>

        <nav className="hidden items-center gap-5 text-[0.7rem] font-light uppercase tracking-[0.2em] text-cocoa xl:flex 2xl:gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-denim">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <AuthButtons />
          <MobileMenu links={links} />
        </div>
      </div>
    </header>
  );
}
