"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

async function post(body: object) {
  const res = await fetch("/api/boards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return res.ok ? null : (data.error ?? "Something went wrong.");
}

const btn =
  "border border-cocoa px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-rose/40 disabled:opacity-50";

// "New board" form on the boards page
export function NewBoardForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        setBusy(true);
        const err = await post({ action: "create", name });
        setBusy(false);
        if (err) return setError(err);
        setName("");
        router.refresh();
      }}
      className="flex flex-wrap items-center gap-3"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={60}
        placeholder="New board, e.g. Spring launch"
        aria-label="New board name"
        className="min-w-0 flex-1 border border-cocoa/30 bg-cream px-3 py-2 font-serif text-lg text-cocoa outline-none focus:border-denim"
      />
      <button type="submit" disabled={busy || !name.trim()} className="bg-cocoa px-5 py-3 text-[0.65rem] uppercase tracking-[0.25em] text-periwinkle disabled:opacity-50">
        Create board
      </button>
      {error && <p className="w-full font-serif text-base text-red-800">{error}</p>}
    </form>
  );
}

// Rename / delete on a single board's page
export function BoardActions({ boardId, name }: { boardId: string; name: string }) {
  const router = useRouter();
  const [renaming, setRenaming] = useState(false);
  const [value, setValue] = useState(name);
  const [error, setError] = useState<string | null>(null);

  if (renaming) {
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const err = await post({ action: "rename", boardId, name: value });
          if (err) return setError(err);
          setRenaming(false);
          router.refresh();
        }}
        className="flex flex-wrap items-center justify-center gap-2"
      >
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={60}
          aria-label="Board name"
          className="border border-cream/40 bg-cream px-3 py-2 font-serif text-lg text-cocoa outline-none"
        />
        <button type="submit" className="bg-periwinkle px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.25em] text-cocoa">
          Save
        </button>
        <button type="button" onClick={() => setRenaming(false)} className="px-3 text-[0.65rem] uppercase tracking-[0.25em] text-cream/80">
          Cancel
        </button>
        {error && <p className="w-full font-serif text-base text-rose">{error}</p>}
      </form>
    );
  }

  return (
    <div className="flex justify-center gap-3">
      <button type="button" onClick={() => setRenaming(true)} className={`${btn} border-cream/60 text-cream hover:bg-cream/10`}>
        Rename
      </button>
      <button
        type="button"
        onClick={async () => {
          if (!confirm(`Delete the board "${name}"? The items stay in the library.`)) return;
          const err = await post({ action: "delete", boardId });
          if (err) return setError(err);
          router.push("/boards");
          router.refresh();
        }}
        className={`${btn} border-cream/60 text-cream hover:bg-cream/10`}
      >
        Delete board
      </button>
      {error && <p className="font-serif text-base text-rose">{error}</p>}
    </div>
  );
}
