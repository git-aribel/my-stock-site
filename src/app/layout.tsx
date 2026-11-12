import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Imperial_Script } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

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
        <footer className="linen mt-0 py-14 text-center">
          <p className="font-script text-5xl text-periwinkle">Socials Bestie</p>
          <p className="mt-4 text-[0.65rem] uppercase tracking-[0.3em] text-cream/60">
            © 2026 Socials Bestie. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}