"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type State = "idle" | "pending" | "shown" | "done";

// Fades its content up as it scrolls into view. With `stagger`, the direct
// children appear one after another. Anything already on screen when the
// page opens just shows, and visitors who prefer less motion see no
// animation at all.
export default function Reveal({
  as = "div",
  stagger = false,
  className = "",
  children,
}: {
  as?: "div" | "section" | "p" | "h2" | "ul";
  stagger?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return; // already on screen

    setState("pending");
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setState("shown");
        // Afterwards, drop the slow transitions so hovers stay snappy
        timer = window.setTimeout(() => setState("done"), 1400);
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  const stateClass = state === "pending" ? "reveal-pending" : state === "shown" ? "reveal-shown" : "";
  const Tag = as;
  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal={stagger ? "stagger" : ""}
      className={`${className} ${stateClass}`.trim()}
    >
      {children}
    </Tag>
  );
}
