// ✏️ READY-MADE TO-DO LISTS
// These show up when someone clicks "New list" -> "Ready-made".
// They get their own copy, so they can add, edit or remove items after.

export type Resets = "never" | "daily" | "weekly";

export type ChecklistTemplate = {
  key: string;
  title: string;
  emoji: string;
  resets: Resets;
  description: string;
  items: string[];
};

export const CHECKLIST_TEMPLATES: ChecklistTemplate[] = [
  {
    key: "before-you-post",
    title: "Before you post",
    emoji: "📸",
    resets: "never",
    description: "A quick check so every post is ready to perform.",
    items: [
      "Hook in the first 3 seconds (or first line)",
      "On-screen text or captions added",
      "Caption written, with a clear call to action",
      "Keywords and hashtags added",
      "Cover image or thumbnail chosen",
      "Trending or original audio picked",
      "Collaborators, products and location tagged",
      "Alt text added",
      "Posted at your best time",
    ],
  },
  {
    key: "daily-engagement",
    title: "Daily engagement",
    emoji: "💬",
    resets: "daily",
    description: "15 minutes a day to grow your community. Unticks every morning.",
    items: [
      "Reply to new comments",
      "Answer your DMs",
      "Comment on 5 accounts in your niche",
      "Share a story (behind the scenes, a poll or a question)",
      "Reshare a post or tag you were mentioned in",
      "Save one idea for later",
    ],
  },
  {
    key: "weekly-routine",
    title: "Weekly content routine",
    emoji: "🗓️",
    resets: "weekly",
    description: "Your weekly reset to stay consistent. Unticks every Monday.",
    items: [
      "Check last week's analytics",
      "Plan next week in the content calendar",
      "Write captions for the week",
      "Batch film or pick videos from the library",
      "Edit and schedule your posts",
      "Save trending audios and ideas",
      "Tidy your grid in the grid planner",
    ],
  },
  {
    key: "batch-filming",
    title: "Batch filming day",
    emoji: "🎬",
    resets: "never",
    description: "Film a week (or a month) of content in one go.",
    items: [
      "Write your shot list",
      "Plan 2–3 outfits or looks",
      "Clean and style your space",
      "Charge your phone and clear storage",
      "Clean your camera lens",
      "Set up lighting (natural light by a window works great)",
      "Film hooks and b-roll for each idea",
      "Back up your clips",
    ],
  },
  {
    key: "product-launch",
    title: "Product or service launch",
    emoji: "🚀",
    resets: "never",
    description: "Everything to do before, during and after a launch.",
    items: [
      "Pick your launch date",
      "Tease it 1–2 weeks before",
      "Start a waitlist or 'link in bio' sign-up",
      "Plan your launch posts in the calendar",
      "Prepare stories for launch day",
      "Update your bio and link",
      "Email your list",
      "Go live or post a launch reel",
      "Share reviews and results after",
      "Send a last-chance reminder",
    ],
  },
  {
    key: "brand-deal",
    title: "Brand deal / UGC job",
    emoji: "🤝",
    resets: "never",
    description: "From the brief to getting paid.",
    items: [
      "Read the brief and deliverables",
      "Confirm rate, usage rights and deadline",
      "Sign the contract",
      "Receive the product",
      "Write a script or shot list",
      "Film and edit",
      "Send the draft for approval",
      "Make revisions",
      "Deliver final files",
      "Send your invoice",
      "Post (if included) and share the stats",
    ],
  },
  {
    key: "monthly-review",
    title: "Monthly review",
    emoji: "📊",
    resets: "never",
    description: "Look back, learn and plan next month.",
    items: [
      "Note your follower growth",
      "Find your top 3 posts and why they worked",
      "Check your reach, saves and shares",
      "See which posting times did best",
      "Write down what to do more of (and less of)",
      "Set one goal for next month",
      "Plan next month's key dates and holidays",
    ],
  },
  {
    key: "profile-glow-up",
    title: "Profile glow-up",
    emoji: "✨",
    resets: "never",
    description: "Make your profile clear and inviting for new followers.",
    items: [
      "Clear profile photo or logo",
      "Name field with a keyword (e.g. 'Ana | Wedding photographer')",
      "Bio says who you help and how",
      "Link in bio works and is up to date",
      "Story highlights with matching covers",
      "Pin your 3 best posts",
      "Contact button and category set",
    ],
  },
];

export function templateByKey(key: string | null) {
  return CHECKLIST_TEMPLATES.find((t) => t.key === key);
}
