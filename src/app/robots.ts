import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/account",
        "/api/",
        "/boards",
        "/success",
        "/reset-password",
        "/forgot-password",
        "/affiliates/join",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
