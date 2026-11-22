import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";
import Link from "next/link";
import ReferralBanner from "@/components/ReferralBanner";
import { FOOTER } from "@/lib/nav";
import JsonLd from "@/components/JsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import Logo from "@/components/Logo";

// Body text. Served from this site (no outside requests).
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// Titles use Satoshi, loaded from Fontshare's servers as its license allows
const SATOSHI_CSS = "https://api.fontshare.com/v2/css?f[]=satoshi@500,700&display=swap";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    // Every other page: "Page name | Socials Bestie"
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "social media content for small businesses",
    "content membership",
    "organic stock videos",
    "stock videos for Instagram Reels and TikTok",
    "Canva templates for Instagram",
    "social media content calendar",
    "Instagram grid planner",
    "social media management",
    "UGC creator",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

// Tells Google who runs the site and what it's called
const organizationData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={SATOSHI_CSS} />
      </head>
      <body className={`${dmSans.variable} antialiased`}>
        <JsonLd data={organizationData} />
        <Header />
        <main>{children}</main>
        <footer className="linen py-14">
          <div className="mx-auto max-w-6xl px-6">
            <Logo height={96} className="mx-auto text-periwinkle" />
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
