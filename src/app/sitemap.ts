import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services";
import { SITE_URL } from "@/lib/site";

// The public pages Google should know about. Private pages (account, admin,
// boards...) are left out on purpose and blocked in robots.ts.
const PAGES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/videos", priority: 0.9, changeFrequency: "weekly" },
  { path: "/images", priority: 0.8, changeFrequency: "weekly" },
  { path: "/templates", priority: 0.8, changeFrequency: "weekly" },
  { path: "/stickers", priority: 0.7, changeFrequency: "weekly" },
  { path: "/tools", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/content-calendar", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/grid-planner", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/font-pairing", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/color-palette", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/ary", priority: 0.7, changeFrequency: "monthly" },
  { path: "/services", priority: 0.8, changeFrequency: "monthly" },
  ...SERVICES.map((s) => ({ path: `/services/${s.slug}`, priority: 0.7, changeFrequency: "monthly" as const })),
  { path: "/welcome-offer", priority: 0.6, changeFrequency: "monthly" },
  { path: "/reviews", priority: 0.6, changeFrequency: "weekly" },
  { path: "/affiliates", priority: 0.5, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" },
  { path: "/license", priority: 0.3, changeFrequency: "yearly" },
  { path: "/affiliate-terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
