import Anthropic from "@anthropic-ai/sdk";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasDownloadAccess } from "@/lib/access";
import { CATEGORIES } from "@/lib/categories";
import {
  ASSISTANT_MODEL,
  DAILY_MESSAGE_LIMIT,
  MAX_HISTORY_MESSAGES,
} from "@/lib/assistant";


const SYSTEM = `You are Ary (product name "Ary 1.0"), the Socials Bestie content agent: a warm, upbeat social media expert for members of Socials Bestie, a membership with organic, real-life stock videos, images, stickers and Canva templates that don't feel like stock, for creators and small businesses. Speak as Ary in a friendly, first-person voice. If someone asks whether you are a person, say honestly that you are an AI content agent.

You help members with:
1. Captions & hooks: scroll-stopping hooks, captions and hashtags for posts, reels and TikToks.
2. Content ideas & calendars: post ideas and simple weekly or monthly content calendars (use a short table or list with day, format, idea and hook).
3. Picks from the library: when an idea would use a video, template, image or sticker, call search_library and recommend specific items with their links. Only recommend items the tool returned; never invent titles or links. If nothing fits, say so and suggest what to look for.
4. Profile & strategy tips: friendly, specific feedback on bios, content plans and growth.

Style:
- Write in the member's brand voice when they've shared it.
- Be concise and practical. Use short paragraphs, numbered options and bullet lists.
- Format with simple Markdown only: **bold**, lists, and [links](/path). No headings bigger than bold text, no tables wider than 4 columns.
- Ask one short question when you truly need more information; otherwise make a sensible assumption and go.
- Stay on social media, content and branding topics. Politely decline anything else.`;

// Searches the Socials Bestie library for items that match an idea
function makeSearchTool(supabase: Awaited<ReturnType<typeof createClient>>) {
  return betaZodTool({
    name: "search_library",
    description:
      "Search the Socials Bestie library (stock videos, Canva templates, images, stickers) by keywords. Returns matching items and collections with links the member can open.",
    inputSchema: z.object({
      query: z
        .string()
        .describe("A few keywords describing what to find, e.g. 'coffee autumn cozy'"),
      category: z
        .enum(["video", "template", "image", "sticker"])
        .optional()
        .describe("Only search one type of content"),
    }),
    eager_input_streaming: true,
    run: async ({ query, category }) => {
      const words = query
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((w) => w.length > 2)
        .slice(0, 6);
      if (words.length === 0) return "No keywords to search for.";

      const filters = words
        .flatMap((w) => [`title.ilike.%${w}%`, `description.ilike.%${w}%`, `tags.cs.{${w}}`])
        .join(",");

      let items = supabase
        .from("content_items")
        .select("title, category, tags, collection_id")
        .or(filters)
        .limit(12);
      let cols = supabase
        .from("collections")
        .select("name, slug, category")
        .or(words.map((w) => `name.ilike.%${w}%`).join(","))
        .limit(5);
      if (category) {
        items = items.eq("category", category);
        cols = cols.eq("category", category);
      }
      const [{ data: found }, { data: collections }] = await Promise.all([items, cols]);

      if (!found?.length && !collections?.length) {
        return `Nothing in the library matched "${query}".`;
      }
      return JSON.stringify({
        items: (found ?? []).map((i) => {
          const cat = CATEGORIES[i.category];
          return {
            title: i.title,
            type: cat?.label ?? i.category,
            tags: i.tags,
            link: `${cat?.path ?? "/"}?q=${encodeURIComponent(i.title)}`,
          };
        }),
        collections: (collections ?? []).map((c) => ({
          name: c.name,
          type: CATEGORIES[c.category]?.label ?? c.category,
          link: `/collection/${c.slug}`,
        })),
      });
    },
  });
}

type ChatMessage = { role: "user" | "assistant"; content: string };

function cleanHistory(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  const msgs = raw
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, 8000) }))
    .slice(-MAX_HISTORY_MESSAGES);
  // The conversation has to start with the member's message
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  return msgs;
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "The assistant is coming soon." }, { status: 503 });
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Please log in." }, { status: 401 });
  if (!(await hasDownloadAccess(supabase, user.id))) {
    return Response.json(
      { error: "The assistant is for members. Join the club to unlock it." },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const history = cleanHistory(body.messages);
  if (history.length === 0 || history[history.length - 1].role !== "user") {
    return Response.json({ error: "Please type a message." }, { status: 400 });
  }
  const brand = typeof body.brand === "string" ? body.brand.trim().slice(0, 1500) : "";

  // Daily limit
  const admin = createAdminClient();
  const day = new Date().toISOString().slice(0, 10);
  const { data: usage, error: usageError } = await admin
    .from("assistant_usage")
    .select("messages")
    .eq("user_id", user.id)
    .eq("day", day)
    .maybeSingle();
  if (usageError) {
    console.error("Assistant usage check failed:", usageError);
    return Response.json({ error: "The assistant isn't set up yet." }, { status: 500 });
  }
  const used = usage?.messages ?? 0;
  if (used >= DAILY_MESSAGE_LIMIT) {
    return Response.json(
      { error: `You've used all ${DAILY_MESSAGE_LIMIT} messages for today. Come back tomorrow!` },
      { status: 429 },
    );
  }
  await admin
    .from("assistant_usage")
    .upsert({ user_id: user.id, day, messages: used + 1 }, { onConflict: "user_id,day" });

  const system: Anthropic.Beta.BetaTextBlockParam[] = [
    { type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } },
  ];
  if (brand) {
    system.push({ type: "text", text: `About the member's brand (use this for voice and context):\n${brand}` });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: object) =>
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      send({ type: "usage", remaining: DAILY_MESSAGE_LIMIT - used - 1 });

      try {
        const client = new Anthropic(); // reads ANTHROPIC_API_KEY
        const runner = client.beta.messages.toolRunner({
          model: ASSISTANT_MODEL,
          max_tokens: 16000,
          output_config: { effort: "medium" },
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          system,
          tools: [makeSearchTool(supabase)],
          messages: history,
          max_iterations: 6,
          stream: true,
        });

        for await (const messageStream of runner) {
          for await (const event of messageStream) {
            if (event.type === "content_block_start" && event.content_block.type === "tool_use") {
              send({ type: "status", text: "Looking through the library…" });
            } else if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              send({ type: "text", text: event.delta.text });
            }
          }
          const message = await messageStream.finalMessage();
          if (message.stop_reason === "refusal") {
            send({ type: "text", text: "\n\nSorry, I can't help with that one." });
            break;
          }
          if (message.stop_reason === "max_tokens") break;
        }
        send({ type: "done" });
      } catch (err) {
        console.error("Assistant error:", err);
        const busy = err instanceof Anthropic.RateLimitError || err instanceof Anthropic.InternalServerError;
        send({
          type: "error",
          text: busy
            ? "The assistant is very busy right now. Please try again in a minute."
            : "Something went wrong. Please try again.",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
