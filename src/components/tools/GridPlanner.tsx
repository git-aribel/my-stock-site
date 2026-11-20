"use client";

import { useEffect, useRef, useState } from "react";
import { downloadCanvas } from "@/lib/useGoogleFonts";

const MAX = 12;

type Photo = { id: string; url: string };
type Platform = "instagram" | "tiktok";

const label = "text-[0.65rem] uppercase tracking-[0.25em] text-cocoa/70";
const input =
  "w-full border border-cocoa/30 bg-cream px-3 py-2 font-serif text-lg text-cocoa outline-none focus:border-denim";
const btn =
  "border border-cocoa px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-rose/40 disabled:opacity-40";
const btnDark =
  "bg-cocoa px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep disabled:opacity-40";

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export default function GridPlanner() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [username, setUsername] = useState("your.brand");
  const [bio, setBio] = useState("creating beautiful little things ♡");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const tiktok = platform === "tiktok";
  const [selected, setSelected] = useState<number | null>(null);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dropActive, setDropActive] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef(photos);

  // Free the photo memory when leaving the page
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(
    () => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)),
    [],
  );

  function addFiles(files: FileList | File[]) {
    const images = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setPhotos((prev) => {
      const room = MAX - prev.length;
      const added = images.slice(0, room).map((f) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(f),
      }));
      // Newest posts appear first on Instagram, so new photos go on top
      return [...added, ...prev];
    });
  }

  function remove(index: number) {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
    setSelected(null);
  }

  function swap(a: number, b: number) {
    setPhotos((prev) => {
      const next = [...prev];
      [next[a], next[b]] = [next[b], next[a]];
      return next;
    });
  }

  function move(from: number, to: number) {
    setPhotos((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  function tap(index: number) {
    if (selected === null) setSelected(index);
    else if (selected === index) setSelected(null);
    else {
      swap(selected, index);
      setSelected(null);
    }
  }

  function shuffle() {
    setPhotos((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
    setSelected(null);
  }

  function clearAll() {
    photos.forEach((p) => URL.revokeObjectURL(p.url));
    setPhotos([]);
    setSelected(null);
  }

  async function download() {
    const cols = 3;
    const rows = Math.max(1, Math.ceil(photos.length / cols));
    const w = 360;
    // Instagram profile grids are 3:4, TikTok covers are 9:16
    const h = tiktok ? 640 : 480;
    const gap = 4;
    const canvas = document.createElement("canvas");
    canvas.width = cols * w + (cols - 1) * gap;
    canvas.height = rows * h + (rows - 1) * gap;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const imgs = await Promise.all(photos.map((p) => loadImage(p.url)));
    imgs.forEach((img, i) => {
      const x = (i % cols) * (w + gap);
      const y = Math.floor(i / cols) * (h + gap);
      // Crop like object-fit: cover
      const scale = Math.max(w / img.width, h / img.height);
      const sw = w / scale;
      const sh = h / scale;
      ctx.drawImage(
        img,
        (img.width - sw) / 2,
        (img.height - sh) / 2,
        sw,
        sh,
        x,
        y,
        w,
        h,
      );
    });

    downloadCanvas(canvas, `${platform}-grid-preview.png`);
  }

  const slots = Math.max(9, Math.ceil((photos.length + 1) / 3) * 3);
  const cells = Array.from({ length: Math.min(slots, MAX) }, (_, i) => photos[i]);
  const aspect = tiktok ? "aspect-[9/16]" : "aspect-[3/4]";

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,380px)] lg:items-start">
      {/* Controls */}
      <div className="space-y-8">
        <div className="grid grid-cols-2 border border-cocoa/25 bg-paper p-1.5">
          {(
            [
              ["instagram", "Instagram"],
              ["tiktok", "TikTok"],
            ] as [Platform, string][]
          ).map(([value, name]) => (
            <button
              key={value}
              type="button"
              onClick={() => setPlatform(value)}
              className={`py-3 text-[0.7rem] uppercase tracking-[0.25em] transition ${
                platform === value
                  ? "bg-cocoa text-periwinkle"
                  : "text-cocoa hover:bg-rose/30"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="border border-cocoa/25 bg-paper p-6 md:p-8">
          <p className={label}>01 · Your {tiktok ? "video covers" : "photos"}</p>
          <h2 className="mt-2 font-script text-4xl text-denim">
            Add your next posts
          </h2>
          <p className="mt-2 font-serif text-lg text-ink/75">
            {tiktok
              ? `Add up to ${MAX} cover images and see how your videos look on your profile. The first one is your newest video.`
              : `Add up to ${MAX} photos and see how they look together. The first photo is your newest post.`}
          </p>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDropActive(true);
            }}
            onDragLeave={() => setDropActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDropActive(false);
              addFiles(e.dataTransfer.files);
            }}
            disabled={photos.length >= MAX}
            className={`stamp mt-6 flex w-full flex-col items-center justify-center gap-2 px-6 py-10 text-cocoa transition disabled:opacity-50 ${
              dropActive ? "bg-rose/40" : "hover:bg-rose/20"
            }`}
          >
            <span className="font-serif text-4xl">+</span>
            <span className="font-serif text-xl">Drop your photos here</span>
            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-cocoa/60">
              or tap to choose · {photos.length} of {MAX}
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        <div className="border border-cocoa/25 bg-paper p-6 md:p-8">
          <p className={label}>02 · Your profile</p>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="ig-user" className={label}>
                Username
              </label>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl text-cocoa/60">@</span>
                <input
                  id="ig-user"
                  value={username}
                  maxLength={30}
                  onChange={(e) =>
                    setUsername(e.target.value.replace(/[^a-zA-Z0-9._]/g, ""))
                  }
                  className={input}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="ig-bio" className={label}>
                Bio
              </label>
              <textarea
                id="ig-bio"
                value={bio}
                maxLength={tiktok ? 80 : 150}
                rows={3}
                onChange={(e) => setBio(e.target.value)}
                className={input}
              />
            </div>
          </div>
        </div>

        <div className="border border-cocoa/25 bg-paper p-6 md:p-8">
          <p className={label}>03 · Arrange</p>
          <p className="mt-2 font-serif text-lg text-ink/75">
            Drag a post onto another to move it, or tap two posts to swap
            them.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={shuffle}
              disabled={photos.length < 2}
              className={btn}
            >
              Shuffle
            </button>
            <button
              type="button"
              onClick={clearAll}
              disabled={photos.length === 0}
              className={btn}
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={download}
              disabled={photos.length === 0}
              className={btnDark}
            >
              Download grid
            </button>
          </div>
          <p className="mt-5 font-serif text-base text-cocoa/60">
            Your photos stay on your device. Nothing is uploaded or posted.
          </p>
        </div>
      </div>

      {/* Phone preview */}
      <div className="mx-auto w-full max-w-[380px] lg:sticky lg:top-24">
        <div className="rounded-[2.5rem] border-[10px] border-cocoa-deep bg-white shadow-[0_30px_60px_-25px_rgba(54,33,27,0.6)]">
          <div className="max-h-[680px] overflow-y-auto rounded-[1.8rem]">
            {tiktok ? (
              <TikTokHeader username={username} bio={bio} posts={photos.length} />
            ) : (
              <InstagramHeader username={username} bio={bio} posts={photos.length} />
            )}

            <div className="grid grid-cols-3 gap-0.5 bg-white">
              {cells.map((p, i) =>
                p ? (
                  <div
                    key={p.id}
                    draggable
                    onDragStart={() => setDragFrom(i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragFrom !== null && dragFrom !== i) move(dragFrom, i);
                      setDragFrom(null);
                      setSelected(null);
                    }}
                    onClick={() => tap(i)}
                    className={`group relative ${aspect} cursor-pointer overflow-hidden ${
                      selected === i ? "ring-4 ring-inset ring-denim" : ""
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.url}
                      alt={`Post ${i + 1}`}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                    {tiktok && (
                      <span className="pointer-events-none absolute bottom-1 left-1.5 text-xs font-semibold text-white drop-shadow">
                        ▷ 0
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label="Remove photo"
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(i);
                      }}
                      className={`absolute right-1 top-1 h-6 w-6 items-center justify-center rounded-full bg-black/60 text-sm text-white ${
                        selected === i ? "flex" : "hidden group-hover:flex"
                      }`}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <button
                    key={`empty-${i}`}
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={photos.length >= MAX}
                    className={`${aspect} flex items-center justify-center bg-neutral-100 text-2xl text-neutral-300 transition hover:bg-neutral-200`}
                  >
                    +
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
        <p className="mt-4 text-center font-serif text-base text-cocoa/60">
          {selected !== null
            ? "Now tap another post to swap them."
            : "Live preview · updates as you go"}
        </p>
      </div>
    </div>
  );
}

function Avatar({ username, size }: { username: string; size: string }) {
  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose to-periwinkle font-serif text-3xl text-cocoa`}
    >
      {(username || "y")[0].toUpperCase()}
    </div>
  );
}

type HeaderProps = { username: string; bio: string; posts: number };

function InstagramHeader({ username, bio, posts }: HeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between px-5 pb-2 pt-4 text-[0.8rem] font-semibold text-neutral-900">
        <span>9:41</span>
        <span className="truncate px-2">{username || "your.brand"}</span>
        <span>⋯</span>
      </div>

      <div className="px-4 pb-3 text-neutral-900">
        <div className="flex items-center gap-5">
          <Avatar username={username} size="h-20 w-20" />
          <div className="grid flex-1 grid-cols-3 text-center text-sm">
            <div>
              <p className="font-semibold">{posts}</p>
              <p className="text-neutral-500">posts</p>
            </div>
            <div>
              <p className="font-semibold">—</p>
              <p className="text-neutral-500">followers</p>
            </div>
            <div>
              <p className="font-semibold">—</p>
              <p className="text-neutral-500">following</p>
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm font-semibold">{username}</p>
        <p className="whitespace-pre-line text-sm">{bio}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs font-semibold">
          <span className="rounded-md bg-neutral-100 py-1.5">Edit profile</span>
          <span className="rounded-md bg-neutral-100 py-1.5">Share profile</span>
        </div>
      </div>

      <div className="flex border-t border-neutral-200 text-neutral-900">
        <span className="flex-1 border-b-2 border-neutral-900 py-2 text-center text-lg">▦</span>
        <span className="flex-1 py-2 text-center text-lg text-neutral-400">▷</span>
        <span className="flex-1 py-2 text-center text-lg text-neutral-400">☺</span>
      </div>
    </>
  );
}

function TikTokHeader({ username, bio }: HeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between px-5 pb-2 pt-4 text-[0.8rem] font-semibold text-neutral-900">
        <span>9:41</span>
        <span className="truncate px-2">{username || "your.brand"}</span>
        <span>≡</span>
      </div>

      <div className="flex flex-col items-center px-4 pb-3 text-center text-neutral-900">
        <Avatar username={username} size="h-24 w-24" />
        <p className="mt-2 text-sm font-semibold">@{username || "your.brand"}</p>
        <div className="mt-3 grid w-full grid-cols-3 text-sm">
          <div>
            <p className="font-semibold">—</p>
            <p className="text-xs text-neutral-500">Following</p>
          </div>
          <div>
            <p className="font-semibold">—</p>
            <p className="text-xs text-neutral-500">Followers</p>
          </div>
          <div>
            <p className="font-semibold">—</p>
            <p className="text-xs text-neutral-500">Likes</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2 text-xs font-semibold">
          <span className="rounded-md bg-neutral-100 px-5 py-2">Edit profile</span>
          <span className="rounded-md bg-neutral-100 px-5 py-2">Share profile</span>
        </div>
        <p className="mt-3 whitespace-pre-line text-sm">{bio}</p>
      </div>

      <div className="flex border-b border-neutral-200 text-neutral-900">
        <span className="flex-1 border-b-2 border-neutral-900 py-2 text-center text-lg">▦</span>
        <span className="flex-1 py-2 text-center text-lg text-neutral-400">🔒</span>
        <span className="flex-1 py-2 text-center text-lg text-neutral-400">♡</span>
      </div>
    </>
  );
}
