import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Imperial_Script } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";
import Link from "next/link";

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
        <footer className="linen py-14 text-center">
          <p className="font-script text-5xl text-periwinkle">Socials Bestie</p>
          <nav className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[0.65rem] uppercase tracking-[0.25em] text-cream/70">
            <Link href="/terms" className="hover:text-periwinkle">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-periwinkle">
              Privacy
            </Link>
            <Link href="/license" className="hover:text-periwinkle">
              License
            </Link>
          </nav>
          <p className="mt-6 text-[0.65rem] uppercase tracking-[0.3em] text-cream/50">
            © 2026 Socials Bestie. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
