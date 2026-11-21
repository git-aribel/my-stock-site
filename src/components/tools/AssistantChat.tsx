"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ASSISTANT_SKILLS } from "@/lib/assistant";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_KEY = "sb_assistant_chat";
const BRAND_KEY = "sb_assistant_brand";

function load<T>(storage: () => Storage, key: string, fallback: T): T {
  try {
    const raw = storage().getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(storage: () => Storage, key: string, value: unknown) {
  try {
    storage().setItem(key, JSON.stringify(value));
  } catch {}
}

export default function AssistantChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [brand, setBrand] = useState("");
  const [showBrand, setShowBrand] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Bring back this tab's conversation and the saved brand info
  useEffect(() => {
    const saved = load<Msg[]>(() => sessionStorage, CHAT_KEY, []);
    const savedBrand = load<string>(() => localStorage, BRAND_KEY, "");
    /* eslint-disable react-hooks/set-state-in-effect */
    setMessages(saved);
    setBrand(savedBrand);
    setShowBrand(!savedBrand);
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (loaded) save(() => sessionStorage, CHAT_KEY, messages);
  }, [messages, loaded]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    setError(null);
    setInput("");
    const history: Msg[] = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setBusy(true);
    setStatus("Thinking…");

    const append = (t: string) =>
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        next[next.length - 1] = { ...last, content: last.content + t };
        return next;
      });

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, brand }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line);
          if (event.type === "text") {
            setStatus(null);
            append(event.text);
          } else if (event.type === "status") {
            setStatus(event.text);
            append("\n\n");
          } else if (event.type === "usage") {
            setRemaining(event.remaining);
          } else if (event.type === "error") {
            throw new Error(event.text);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      // Drop the empty reply so the member can try again
      setMessages((prev) =>
        prev[prev.length - 1]?.role === "assistant" && !prev[prev.length - 1].content.trim()
          ? prev.slice(0, -2)
          : prev,
      );
      setInput(content);
    } finally {
      setBusy(false);
      setStatus(null);
    }
  }

  function applyStarter(prompt: string) {
    setInput(prompt);
    inputRef.current?.focus();
  }

  function newChat() {
    setMessages([]);
    setError(null);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,300px)_1fr] lg:items-start">
      {/* Side: brand + starters */}
      <aside className="space-y-6">
        <div className="border border-cocoa/25 bg-paper p-5">
          <button
            type="button"
            onClick={() => setShowBrand(!showBrand)}
            className="flex w-full items-center justify-between text-[0.65rem] uppercase tracking-[0.25em] text-cocoa/70"
          >
            About your brand
            <span>{showBrand ? "−" : "+"}</span>
          </button>
          {showBrand ? (
            <>
              <textarea
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  save(() => localStorage, BRAND_KEY, e.target.value);
                }}
                rows={6}
                maxLength={1500}
                placeholder="e.g. I run a cozy coffee shop in Lisbon. Warm, playful voice. Audience: young professionals and students."
                className="mt-3 w-full border border-cocoa/30 bg-cream px-3 py-2 font-serif text-base text-cocoa outline-none focus:border-denim"
              />
              <p className="mt-2 font-serif text-sm text-cocoa/60">
                Saved on this device. The assistant uses it to write in your voice.
              </p>
            </>
          ) : (
            <p className="mt-2 line-clamp-2 font-serif text-base text-ink/70">
              {brand || "Tell the assistant about your brand."}
            </p>
          )}
        </div>

        <div className="border border-cocoa/25 bg-paper p-5">
          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-cocoa/70">Try asking</p>
          <div className="mt-3 space-y-2">
            {ASSISTANT_SKILLS.map((s) => (
              <button
                key={s.title}
                type="button"
                onClick={() => applyStarter(s.prompt)}
                className="block w-full border border-cocoa/20 px-3 py-2 text-left font-serif text-base text-ink transition hover:bg-rose/25"
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Chat */}
      <div className="flex min-h-[560px] flex-col border border-cocoa/25 bg-paper">
        <div className="flex items-center justify-between border-b border-cocoa/15 px-5 py-3">
          <p className="text-[0.65rem] uppercase tracking-[0.25em] text-cocoa/70">
            Your assistant
            {remaining !== null && (
              <span className="ml-3 normal-case tracking-normal text-cocoa/50">
                {remaining} message{remaining === 1 ? "" : "s"} left today
              </span>
            )}
          </p>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={newChat}
              disabled={busy}
              className="text-[0.6rem] uppercase tracking-[0.25em] text-cocoa hover:text-denim disabled:opacity-50"
            >
              New chat
            </button>
          )}
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6" aria-live="polite">
          {messages.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-script text-5xl text-denim">Hi, bestie!</p>
              <p className="mx-auto mt-3 max-w-md font-serif text-lg text-ink/75">
                What are you creating today? Ask me for captions, content ideas,
                picks from the library or feedback on your profile.
              </p>
            </div>
          ) : (
            messages.map((m, i) =>
              m.role === "user" ? (
                <p
                  key={i}
                  className="ml-auto max-w-[85%] whitespace-pre-wrap bg-periwinkle px-4 py-3 font-serif text-lg text-cocoa"
                >
                  {m.content}
                </p>
              ) : (
                <div key={i} className="max-w-[92%] bg-cream px-4 py-3 font-serif text-lg leading-relaxed text-ink">
                  {m.content ? <Markdown text={m.content} /> : <span className="text-cocoa/60">{status}</span>}
                  {status && m.content && i === messages.length - 1 && (
                    <p className="mt-2 text-base text-cocoa/60">{status}</p>
                  )}
                </div>
              ),
            )
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-cocoa/15 p-4"
        >
          {error && <p className="mb-3 font-serif text-base text-red-800">{error}</p>}
          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={2}
              maxLength={4000}
              placeholder="Ask anything about your content…"
              className="flex-1 resize-none border border-cocoa/30 bg-cream px-3 py-2 font-serif text-lg text-cocoa outline-none focus:border-denim"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="bg-cocoa px-5 py-3 text-[0.65rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep disabled:opacity-50"
            >
              {busy ? "…" : "Send"}
            </button>
          </div>
          <p className="mt-2 font-serif text-sm text-cocoa/50">
            The assistant can make mistakes, so check important details. Chats
            are kept in this browser tab only.
          </p>
        </form>
      </div>
    </div>
  );
}

// A tiny, safe Markdown renderer: paragraphs, lists, **bold** and [links](/path)
function Markdown({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-3">
      {blocks.map((block, bi) => {
        const lines = block.split("\n").filter((l) => l.trim());
        const isList = lines.length > 0 && lines.every((l) => /^\s*([-*•]|\d+[.)])\s+/.test(l));
        if (isList) {
          const ordered = /^\s*\d/.test(lines[0]);
          const Tag = ordered ? "ol" : "ul";
          return (
            <Tag key={bi} className={`space-y-1 pl-6 ${ordered ? "list-decimal" : "list-disc"}`}>
              {lines.map((l, li) => (
                <li key={li}>
                  <Inline text={l.replace(/^\s*([-*•]|\d+[.)])\s+/, "")} />
                </li>
              ))}
            </Tag>
          );
        }
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <span key={li}>
                {li > 0 && <br />}
                <Inline text={l.replace(/^#+\s*/, "")} />
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((p, i) => {
        const bold = p.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <strong key={i} className="font-semibold">{bold[1]}</strong>;
        const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const href = link[2];
          // Only links inside this site
          if (href.startsWith("/") && !href.startsWith("//")) {
            return (
              <Link key={i} href={href} className="text-denim underline hover:text-cocoa">
                {link[1]}
              </Link>
            );
          }
          return <span key={i}>{link[1]}</span>;
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}
