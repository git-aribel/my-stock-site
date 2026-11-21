import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Imperial_Script } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";
import Link from "next/link";
import ReferralBanner from "@/components/ReferralBanner";
import { FOOTER } from "@/lib/nav";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const imperial = Imperial_Script({
  variable: "--font-imperial",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Socials Bestie | Stock Videos & Canva Templates",
  description:
    "Vintage-inspired stock videos and Canva templates to make your content effortless.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${jost.variable} ${cormorant.variable} ${imperial.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <footer className="linen py-14">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-center font-script text-5xl text-periwinkle">Socials Bestie</p>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
              {FOOTER.map((group) => (
                <div key={group.label}>
                  <p className="text-[0.6rem] uppercase tracking-[0.3em] text-periwinkle">
                    {group.href ? (
                      <Link href={group.href} className="hover:text-cream">
                        {group.label}
                      </Link>
                    ) : (
                      group.label
                    )}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {group.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="font-serif text-lg text-cream/75 hover:text-periwinkle">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-12 text-center text-[0.65rem] uppercase tracking-[0.3em] text-cream/50">
              © 2026 Socials Bestie. All rights reserved.
            </p>
          </div>
        </footer>
        <ReferralBanner />
      </body>
    </html>
  );
}
