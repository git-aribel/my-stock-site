"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV, isGroup } from "@/lib/nav";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center text-cocoa"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          {open ? (
            <path d="M5 5l14 14M19 5L5 19" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full max-h-[calc(100vh-4.5rem)] overflow-y-auto border-b border-cocoa/20 bg-cream px-6 py-6">
          <nav className="flex flex-col gap-6">
            {NAV.map((item) =>
              isGroup(item) ? (
                <div key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={close}
                      className="text-[0.65rem] uppercase tracking-[0.3em] text-cocoa/60 hover:text-denim"
                    >
                      {item.label} →
                    </Link>
                  ) : (
                    <p className="text-[0.65rem] uppercase tracking-[0.3em] text-cocoa/60">
                      {item.label}
                    </p>
                  )}
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                    {item.links.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={close}
                        className="py-1 font-serif text-xl text-ink hover:text-denim"
                      >
                        {l.label}
                        {l.badge && (
                          <span className="ml-2 align-middle bg-periwinkle px-1.5 py-0.5 font-sans text-[0.5rem] uppercase tracking-[0.2em] text-cocoa">
                            {l.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className="text-[0.75rem] font-light uppercase tracking-[0.25em] text-cocoa hover:text-denim"
                >
                  {item.label}
                </Link>
              ),
            )}
            <Link
              href="/account"
              onClick={close}
              className="border-t border-cocoa/15 pt-5 text-[0.75rem] font-light uppercase tracking-[0.25em] text-cocoa hover:text-denim"
            >
              Account / Log in
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
