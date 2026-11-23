"use client";

import { useEffect, useRef, useState } from "react";

// "Slide to unlock": the content is blurred until the visitor drags the
// arrow all the way to the right (or presses it with the keyboard). Once
// unlocked it stays unlocked for the rest of the visit.
const KEY = "sb_unlocked";

export default function SlideToUnlock({ children, label = "slide to unlock" }: { children: React.ReactNode; label?: string }) {
  const [unlocked, setUnlocked] = useState(false);
  const [x, setX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLButtonElement>(null);
  const start = useRef({ pointer: 0, x: 0 });

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) setUnlocked(true);
    } catch {}
  }, []);

  const max = () => (track.current && knob.current ? track.current.clientWidth - knob.current.offsetWidth - 8 : 0);

  function unlock() {
    setX(max());
    setDragging(false);
    window.setTimeout(() => setUnlocked(true), 220);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
  }

  function onDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { pointer: e.clientX, x };
    setDragging(true);
  }
  function onMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!dragging) return;
    setX(Math.min(max(), Math.max(0, start.current.x + e.clientX - start.current.pointer)));
  }
  function onUp() {
    if (!dragging) return;
    if (x >= max() * 0.88) unlock();
    else {
      setDragging(false);
      setX(0);
    }
  }

  const progress = max() ? x / max() : 0;

  return (
    <div className="relative">
      <div
        aria-hidden={!unlocked}
        className={`transition-[filter,opacity] duration-700 ${unlocked ? "" : "pointer-events-none select-none opacity-60 blur-[7px]"}`}
      >
        {children}
      </div>

      {!unlocked && (
        <div className="absolute inset-0 z-10 flex items-start justify-center px-4 pt-24 md:items-center md:pt-0">
          <div
            ref={track}
            className="keep-colors relative h-[64px] w-full max-w-[440px] rounded-[16px] p-1 shadow-[inset_0_2px_6px_rgba(0,0,0,0.55),0_14px_30px_-12px_rgba(54,33,27,0.6)]"
            style={{ background: "linear-gradient(180deg, #2a1a15 0%, #4a2f27 100%)" }}
          >
            {/* Shimmering label, fading as the arrow slides over it */}
            <span
              className="slide-shine pointer-events-none absolute inset-0 flex items-center justify-center pl-16 text-xl font-light tracking-wide sm:text-2xl"
              style={{ opacity: 1 - progress * 1.4 }}
            >
              {label}
            </span>
            <button
              ref={knob}
              type="button"
              aria-label="Slide to unlock everything you'll get"
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
                  e.preventDefault();
                  unlock();
                }
              }}
              className={`relative flex h-full w-[84px] touch-none cursor-grab items-center justify-center rounded-[12px] shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_2px_6px_rgba(0,0,0,0.4)] active:cursor-grabbing ${
                dragging ? "" : "transition-transform duration-300 ease-out"
              }`}
              style={{ transform: `translateX(${x}px)`, background: "linear-gradient(180deg, #fbf7f0 0%, #dcd0c2 55%, #c4b4a2 100%)" }}
            >
              <svg width="34" height="24" viewBox="0 0 34 24" aria-hidden="true">
                <path d="M2 8h17V1.5L32 12 19 22.5V16H2z" fill="#8a7466" stroke="#6b5649" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
