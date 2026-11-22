// ✏️ THE SITE MENU
// Used by the header dropdowns, the mobile menu and the footer.

export type NavLink = { href: string; label: string; badge?: string };
export type NavGroup = { label: string; href?: string; links: NavLink[] };
export type NavItem = NavGroup | NavLink;

export const LIBRARY: NavGroup = {
  label: "Library",
  links: [
    { href: "/videos", label: "Videos" },
    { href: "/templates", label: "Templates" },
    { href: "/images", label: "Images" },
    { href: "/stickers", label: "Stickers" },
    { href: "/boards", label: "My boards", badge: "Members" },
  ],
};

export const HUB: NavGroup = {
  label: "Creator Hub",
  href: "/tools",
  links: [
    { href: "/tools/ary", label: "Ary 1.0", badge: "Members" },
    { href: "/tools/content-calendar", label: "Content calendar" },
    { href: "/tools/to-do-lists", label: "To-do lists" },
    { href: "/tools/grid-planner", label: "Grid planner" },
    { href: "/tools/font-pairing", label: "Font pairings" },
    { href: "/tools/color-palette", label: "Color palettes" },
  ],
};

export const SERVICES_NAV: NavGroup = {
  label: "Services",
  href: "/services",
  links: [
    { href: "/services/website-creation", label: "Website creation" },
    { href: "/services/social-media-management", label: "Social media management" },
    { href: "/services/content-creation", label: "Content creation" },
    { href: "/services/ugc", label: "UGC" },
  ],
};

export const NAV: NavItem[] = [
  LIBRARY,
  HUB,
  SERVICES_NAV,
  { href: "/pricing", label: "Pricing" },
  { href: "/affiliates", label: "Affiliates" },
];

export const FOOTER: NavGroup[] = [
  {
    ...LIBRARY,
    links: [
      ...LIBRARY.links,
      { href: "/welcome-offer", label: "15% welcome offer" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  HUB,
  { ...SERVICES_NAV, links: SERVICES_NAV.links.map((l) => ({ ...l, label: l.label.replace(" management", "") })) },
  {
    label: "Company",
    links: [
      { href: "/affiliates", label: "Affiliates" },
      { href: "/reviews", label: "Reviews" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    label: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/license", label: "License" },
    ],
  },
];

export function isGroup(item: NavItem): item is NavGroup {
  return "links" in item;
}
