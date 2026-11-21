"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Board = { id: string; name: string; count: number; hasItem: boolean };
type State =
  | { kind: "loading" }
  | { kind: "login" }
  | { kind: "subscribe" }
  | { kind: "error"; message: string }
  | { kind: "ready"; boards: Board[] };

// The bookmark on each library item: save it to one or more boards
export default function SaveToBoard({ itemId, title }: { itemId: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>({ kind: "loading" });
  const [newName, setNewName] = useState("");
  const [saved, setSaved] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking anywhere else
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function load() {
    setState({ kind: "loading" });
    const res = await fetch(`/api/boards?item=${itemId}`);
    const data = await res.json().catch(() => ({}));
    if (data.code === "login") return setState({ kind: "login" });
    if (data.code === "subscribe") return setState({ kind: "subscribe" });
    if (!res.ok) return setState({ kind: "error", message: data.error ?? "Something went wrong." });
    setState({ kind: "ready", boards: data.boards });
    setSaved(data.boards.some((b: Board) => b.hasItem));
  }

  function toggleOpen() {
    if (!open) load();
    setOpen(!open);
  }

  async function post(body: object) {
    const res = await fetch("/api/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setState({ kind: "error", message: data.error ?? "Something went wrong." });
      return false;
    }
    return true;
  }

  async function toggle(board: Board) {
    if (state.kind !== "ready") return;
    const on = !board.hasItem;
    const boards = state.boards.map((b) =>
      b.id === board.id ? { ...b, hasItem: on, count: b.count + (on ? 1 : -1) } : b,
    );
    setState({ kind: "ready", boards });
    setSaved(boards.some((b) => b.hasItem));
    await post({ action: "toggle", boardId: board.id, itemId, on });
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    if (await post({ action: "create", name, itemId })) {
      setNewName("");
      load();
    }
  }

  return (
    <div ref={ref} className="absolute right-4 top-4 z-20">
      <button
        type="button"
        onClick={toggleOpen}
        aria-label={`Save ${title} to a board`}
        aria-expanded={open}
        title="Save to a board"
        className={`flex h-8 w-8 items-center justify-center border border-cocoa/40 transition ${
          saved ? "bg-cocoa text-periwinkle" : "bg-cream/90 text-cocoa hover:bg-cream"
        }`}
      >
        <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
          <path
            d="M1.5 1.5h11v13L7 10.8 1.5 14.5z"
            fill={saved ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-64 border border-cocoa/25 bg-paper p-3 text-left shadow-[0_16px_40px_-20px_rgba(74,47,39,0.6)]">
          <p className="text-[0.6rem] uppercase tracking-[0.25em] text-cocoa/70">Save to a board</p>

          {state.kind === "loading" && <p className="mt-3 font-serif text-base text-cocoa/60">Loading…</p>}

          {state.kind === "login" && (
            <p className="mt-3 font-serif text-base text-ink">
              <Link href="/login" className="text-denim underline">Log in</Link> to save items to boards.
            </p>
          )}

          {state.kind === "subscribe" && (
            <div className="mt-3 font-serif text-base text-ink">
              <p>Boards are for members. Save your favourites into collections like “Spring launch”.</p>
              <Link
                href="/pricing"
                className="mt-3 inline-block bg-cocoa px-4 py-2 font-sans text-[0.6rem] uppercase tracking-[0.25em] text-periwinkle"
              >
                Join the club
              </Link>
            </div>
          )}

          {state.kind === "error" && <p className="mt-3 font-serif text-base text-red-800">{state.message}</p>}

          {state.kind === "ready" && (
            <>
              <div className="mt-2 max-h-52 space-y-1 overflow-y-auto">
                {state.boards.length === 0 && (
                  <p className="font-serif text-base text-cocoa/60">No boards yet. Create your first one below.</p>
                )}
                {state.boards.map((b) => (
                  <label key={b.id} className="flex cursor-pointer items-center gap-2 px-1 py-1 font-serif text-base text-ink hover:bg-rose/20">
                    <input type="checkbox" checked={b.hasItem} onChange={() => toggle(b)} className="accent-cocoa" />
                    <span className="flex-1 truncate">{b.name}</span>
                    <span className="text-sm text-cocoa/50">{b.count}</span>
                  </label>
                ))}
              </div>
              <form onSubmit={create} className="mt-3 flex gap-2 border-t border-cocoa/15 pt-3">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  maxLength={60}
                  placeholder="New board name"
                  aria-label="New board name"
                  className="min-w-0 flex-1 border border-cocoa/30 bg-cream px-2 py-1 font-serif text-base text-cocoa outline-none focus:border-denim"
                />
                <button type="submit" disabled={!newName.trim()} className="bg-cocoa px-3 text-[0.6rem] uppercase tracking-[0.2em] text-periwinkle disabled:opacity-50">
                  Add
                </button>
              </form>
              <Link href="/boards" className="mt-3 block text-[0.6rem] uppercase tracking-[0.25em] text-cocoa/70 hover:text-denim">
                See my boards →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
