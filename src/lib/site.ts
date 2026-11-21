// ✏️ HOW THE SITE DESCRIBES ITSELF (search results, link previews, Google)
// Once you connect your own domain, set NEXT_PUBLIC_SITE_URL in Vercel
// (e.g. https://socialsbestie.com) so links point to it.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-stock-site-indol.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "Socials Bestie";

// Category: what kind of site this is, in a few words
export const SITE_CATEGORY = "The content studio for small businesses & creators";

// Default title for the homepage and search results
export const SITE_TITLE = "Socials Bestie | Content Studio for Small Businesses & Creators";

export const SITE_DESCRIPTION =
  "Organic stock videos and images that don't feel like stock, editable Canva templates, free content planning tools and done-for-you social media services. Everything you need to show up on social media.";
