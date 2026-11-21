// ✏️ ARY 1.0, THE CONTENT AGENT
// Shown on the Creator Hub, Ary's page (for non-members) and used by the agent.
// Her mascot is in src/components/AryAvatar.tsx.

// Claude model Ary runs on
export const ASSISTANT_MODEL = "claude-opus-5-5";
// Messages each member can send per day (keeps costs predictable)
export const DAILY_MESSAGE_LIMIT = 40;
// How much of a conversation is sent each turn (older messages are dropped)
export const MAX_HISTORY_MESSAGES = 30;

export const ASSISTANT_SKILLS = [
  {
    title: "Captions & hooks",
    text: "Scroll-stopping hooks, captions and hashtags for posts and reels, written in your brand voice.",
    prompt: "Write 3 caption options with hooks and hashtags for a post about ",
  },
  {
    title: "Content ideas & calendar",
    text: "A week or a month of post ideas, turned into a ready-to-follow content calendar.",
    prompt: "Plan a 2-week content calendar for my account. My niche is ",
  },
  {
    title: "Picks from the library",
    text: "The exact videos, templates and images from our library that fit each idea, with links.",
    prompt: "Which videos and templates from the library would fit a post about ",
  },
  {
    title: "Profile & strategy tips",
    text: "Feedback on your bio and content plan, with clear, friendly advice to help you grow.",
    prompt: "Review my Instagram bio and give me tips to improve it: ",
  },
];
