import Link from "next/link";
import AuthButtons from "@/components/AuthButtons";
import MobileMenu from "@/components/MobileMenu";
import { NAV, isGroup } from "@/lib/nav";

const topLink =
  "flex items-center gap-1.5 py-2 text-[0.7rem] font-light uppercase tracking-[0.25em] text-cocoa hover:text-denim";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-cocoa/20 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-6 sm:px-6">
        <Link href="/" className="shrink-0 font-script text-4xl text-denim">
          Socials Bestie
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) =>
            isGroup(item) ? (
              <div key={item.label} className="group relative">
                {item.href ? (
                  <Link href={item.href} className={topLink} aria-haspopup="true">
                    {item.label}
                    <Caret />
                  </Link>
                ) : (
                  <button type="button" className={topLink} aria-haspopup="true">
                    {item.label}
                    <Caret />
                  </button>
                )}
                {/* Dropdown: opens on hover, or when tabbing into it */}
                <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="border border-cocoa/20 bg-paper py-2 shadow-[0_16px_40px_-20px_rgba(74,47,39,0.5)]">
                    {item.links.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className="flex items-center justify-between gap-3 px-5 py-2.5 font-serif text-lg text-ink hover:bg-rose/25 hover:text-denim"
                      >
                        {l.label}
                        {l.badge && (
                          <span className="bg-periwinkle px-2 py-0.5 font-sans text-[0.55rem] uppercase tracking-[0.2em] text-cocoa">
                            {l.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                    {item.href && (
                      <Link
                        href={item.href}
                        className="mt-1 block border-t border-cocoa/15 px-5 pb-1 pt-3 text-[0.6rem] uppercase tracking-[0.25em] text-cocoa/70 hover:text-denim"
                      >
                        See all →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className={topLink}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <AuthButtons />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

function Caret() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true" className="transition group-hover:rotate-180">
      <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
