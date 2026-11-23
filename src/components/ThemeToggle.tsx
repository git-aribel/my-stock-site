"use client";

// Light / dark mode switch. The choice is saved on this device, and a tiny
// script in the page <head> (THEME_SCRIPT) applies it before anything shows,
// so the page never flashes the wrong colors.
export const THEME_KEY = "sb_theme";

export const THEME_SCRIPT = `try{if(localStorage.getItem("${THEME_KEY}")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

export default function ThemeToggle({ className = "" }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    if (next === "dark") root.dataset.theme = "dark";
    else delete root.dataset.theme;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark mode"
      title="Light / dark mode"
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-cocoa transition hover:bg-rose/30 hover:text-denim ${className}`}
    >
      {/* Moon in light mode, sun in dark mode */}
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="dark:hidden">
        <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="hidden dark:block">
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </button>
  );
}
