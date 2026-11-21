// ✏️ EDIT YOUR SERVICES HERE
// Each service gets a card on /services and its own page at /services/<slug>.

export type ServiceField =
  | { name: string; label: string; type: "select"; options: string[]; required?: boolean }
  | { name: string; label: string; type: "checkboxes"; options: string[]; required?: boolean }
  | { name: string; label: string; type: "text"; placeholder?: string; required?: boolean };

export type Service = {
  slug: string;
  name: string;
  short: string; // one line for the card on /services
  intro: string; // under the title on the service page
  included: { title: string; text: string }[];
  steps: { title: string; text: string }[];
  fields: ServiceField[]; // questions only this service asks
};

export const BUDGETS = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500+",
  "Not sure yet",
];

export const TIMELINES = [
  "As soon as possible",
  "Within a month",
  "In 1 – 3 months",
  "I'm flexible",
];

const STEPS = {
  call: { title: "Tell us about you", text: "Fill in the form below. We'll reply within 2 business days to set up a short call." },
  plan: { title: "Get your proposal", text: "We send a clear plan with what's included, the timeline and your price. No surprises." },
};

export const SERVICES: Service[] = [
  {
    slug: "website-creation",
    name: "Website creation",
    short:
      "A beautiful, easy-to-use website that looks like your brand and turns visitors into clients.",
    intro:
      "Your website is your online home. We design and build websites that feel like you, work perfectly on phones and make it easy for people to book, buy or get in touch.",
    included: [
      { title: "Custom design", text: "A look made for your brand, using your colors, fonts and photos. No cookie-cutter themes." },
      { title: "Mobile-friendly", text: "Most people will visit on their phone, so every page is designed to look great on small screens first." },
      { title: "The pages you need", text: "Home, about, services, contact and anything else your business needs, like a blog or portfolio." },
      { title: "Bookings & shop", text: "Connect bookings, payments, a newsletter sign-up or an online shop so your site works for you." },
      { title: "Found on Google", text: "Clean setup, page titles and descriptions so search engines understand what you do." },
      { title: "Launch & handover", text: "We launch your site and show you how to update it yourself, with a simple guide to keep." },
    ],
    steps: [
      STEPS.call,
      STEPS.plan,
      { title: "Design & build", text: "We design your pages, share them for feedback and build the final site once you love it." },
      { title: "Launch", text: "Your site goes live, and you get a walkthrough so you feel confident editing it." },
    ],
    fields: [
      {
        name: "project",
        label: "What do you need?",
        type: "select",
        options: ["A new website", "A single landing page", "An online shop"],
        required: true,
      },
      { name: "currentSite", label: "Current website (if you have one)", type: "text", placeholder: "yourbrand.com" },
    ],
  },
  {
    slug: "social-media-management",
    name: "Social media management",
    short:
      "We plan, post and grow your accounts every month, so you can focus on running your business.",
    intro:
      "Showing up every day is hard when you're running a business. We take your social media off your plate, from planning and posting to replying and reporting, all in your voice.",
    included: [
      { title: "Strategy", text: "A clear plan for who you're talking to, what to post and how to stand out in your niche." },
      { title: "Content calendar", text: "A monthly calendar of posts, reels and stories you can review and approve before anything goes live." },
      { title: "Captions & hashtags", text: "Scroll-stopping captions written in your brand voice, with researched hashtags." },
      { title: "Posting & scheduling", text: "We schedule everything at the best times for your audience, so your feed stays consistent." },
      { title: "Community care", text: "We reply to comments and messages and engage with your audience to build real relationships." },
      { title: "Monthly report", text: "Easy-to-read results every month, with what's working and what we'll try next." },
    ],
    steps: [
      STEPS.call,
      STEPS.plan,
      { title: "Onboarding", text: "We learn your brand, set up access and create your first month's calendar for approval." },
      { title: "We post & grow", text: "We manage your accounts every month and check in with a report and next steps." },
    ],
    fields: [
      {
        name: "platforms",
        label: "Which platforms?",
        type: "checkboxes",
        options: ["Instagram", "TikTok", "Facebook", "Pinterest", "LinkedIn"],
        required: true,
      },
      { name: "frequency", label: "How often would you like to post?", type: "select", options: ["2 – 3 times a week", "4 – 5 times a week", "Every day", "Not sure"] },
      { name: "engagement", label: "Should we reply to comments and messages?", type: "select", options: ["Yes, please", "No, I'll do it", "Not sure"] },
      { name: "handle", label: "Your main account", type: "text", placeholder: "@yourbrand" },
    ],
  },
  {
    slug: "content-creation",
    name: "Content creation",
    short:
      "Photos, reels and templates made for your brand, ready to post and made to stop the scroll.",
    intro:
      "Great content gets attention and builds trust. We create photos, videos and templates made for your brand and your audience, ready to use on social media, your website and your ads.",
    included: [
      { title: "Photography", text: "High-quality brand photos of you, your products or your space, ready for social media and your website." },
      { title: "Reels & short videos", text: "Edited reels and TikToks with trending audio, captions and transitions that keep people watching." },
      { title: "Canva templates", text: "Custom, fully editable templates in your brand style, so posting yourself is quick and easy." },
      { title: "Carousels & graphics", text: "Educational carousels, quote posts and graphics that people save and share." },
      { title: "Behind the scenes", text: "Real, relatable footage of your process and your day to help people connect with you." },
      { title: "Editing", text: "Already have footage? We edit it into polished content with your brand style." },
    ],
    steps: [
      STEPS.call,
      STEPS.plan,
      { title: "Create", text: "We shoot, design and edit your content, and share drafts for your feedback." },
      { title: "Deliver", text: "You get your final files in a tidy folder, ready to post whenever you like." },
    ],
    fields: [
      {
        name: "contentTypes",
        label: "What content do you need?",
        type: "checkboxes",
        options: ["Photos", "Reels / short videos", "Canva templates", "Carousels & graphics", "Video editing"],
        required: true,
      },
      { name: "quantity", label: "How much content?", type: "select", options: ["A one-off project", "A few pieces a month", "A lot every month", "Not sure"] },
      { name: "location", label: "Where are you based? (for shoots)", type: "text", placeholder: "City, country" },
    ],
  },
  {
    slug: "ugc",
    name: "UGC",
    short:
      "Authentic videos of real people using your product, made for your ads, website and social media.",
    intro:
      "User-generated content (UGC) is content that looks and feels like a real customer's. It builds trust, performs well in ads and shows your product in everyday life.",
    included: [
      { title: "Product videos", text: "Natural, talking-to-camera videos that show your product and why people love it." },
      { title: "Unboxings & demos", text: "First impressions, unboxings and how-to videos that answer customers' questions." },
      { title: "Testimonial style", text: "Honest, relatable reviews that feel like a recommendation from a friend." },
      { title: "Hooks that convert", text: "Several opening hooks for each video, so you can test what works best in your ads." },
      { title: "Raw & edited files", text: "Edited videos ready to post, plus the raw clips if your team wants to edit them too." },
      { title: "Usage rights", text: "Clear usage rights for organic posting or paid ads, agreed before we start." },
    ],
    steps: [
      STEPS.call,
      STEPS.plan,
      { title: "Send your product", text: "You ship the product and a short brief, and we plan the scripts and hooks." },
      { title: "Film & deliver", text: "We film and edit your videos and deliver them ready for social media and ads." },
    ],
    fields: [
      { name: "videos", label: "How many videos?", type: "select", options: ["1 – 3", "4 – 6", "7 – 10", "More than 10", "Not sure"], required: true },
      {
        name: "usage",
        label: "Where will you use them?",
        type: "checkboxes",
        options: ["My social media", "Paid ads", "My website", "Not sure yet"],
      },
      { name: "product", label: "What's the product?", type: "text", placeholder: "e.g. skincare serum, coffee, app" },
    ],
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
