"use client";

import Link from "next/link";
import { useState } from "react";
import { BUDGETS, TIMELINES, type ServiceField } from "@/lib/services";

const label = "block text-[0.65rem] uppercase tracking-[0.25em] text-cocoa/70";
const input =
  "mt-2 w-full border border-cocoa/30 bg-cream px-3 py-2 font-serif text-lg text-cocoa outline-none focus:border-denim";

export default function ServiceInquiryForm({
  service,
  fields,
}: {
  service: string;
  fields: ServiceField[];
}) {
  const [details, setDetails] = useState<Record<string, string | string[]>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  function toggle(name: string, option: string) {
    setDetails((d) => {
      const current = (d[name] as string[] | undefined) ?? [];
      return {
        ...d,
        [name]: current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option],
      };
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    for (const f of fields) {
      const v = details[f.name];
      if (f.required && (!v || (Array.isArray(v) && v.length === 0))) {
        setError(`Please answer: ${f.label}`);
        return;
      }
    }

    const form = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          name: form.get("name"),
          email: form.get("email"),
          business: form.get("business"),
          budget: form.get("budget"),
          timeline: form.get("timeline"),
          message: form.get("message"),
          consent: form.get("consent") === "on",
          website: form.get("website"), // hidden spam trap
          details,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div className="py-6 text-center">
        <h3 className="font-script text-5xl text-denim">Thank you!</h3>
        <p className="mt-4 font-serif text-xl text-ink/80">
          We&apos;ve got your details and will reply by email within 2 business
          days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className={label}>
          Your name *
          <input name="name" required maxLength={100} className={input} />
        </label>
        <label className={label}>
          Email *
          <input name="email" type="email" required maxLength={200} className={input} />
        </label>
      </div>

      <label className={label}>
        Business or brand name
        <input name="business" maxLength={150} className={input} />
      </label>

      {fields.map((f) =>
        f.type === "checkboxes" ? (
          <fieldset key={f.name}>
            <legend className={label}>
              {f.label}
              {f.required && " *"}
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {f.options.map((o) => {
                const on = ((details[f.name] as string[] | undefined) ?? []).includes(o);
                return (
                  <button
                    key={o}
                    type="button"
                    onClick={() => toggle(f.name, o)}
                    aria-pressed={on}
                    className={`px-4 py-2 font-serif text-lg transition ${
                      on
                        ? "bg-denim text-cream"
                        : "border border-cocoa/30 text-cocoa hover:bg-rose/30"
                    }`}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ) : f.type === "select" ? (
          <label key={f.name} className={label}>
            {f.label}
            {f.required && " *"}
            <select
              value={(details[f.name] as string) ?? ""}
              onChange={(e) => setDetails((d) => ({ ...d, [f.name]: e.target.value }))}
              className={input}
            >
              <option value="">Choose one</option>
              {f.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        ) : (
          <label key={f.name} className={label}>
            {f.label}
            {f.required && " *"}
            <input
              value={(details[f.name] as string) ?? ""}
              placeholder={f.placeholder}
              maxLength={200}
              onChange={(e) => setDetails((d) => ({ ...d, [f.name]: e.target.value }))}
              className={input}
            />
          </label>
        ),
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <label className={label}>
          Budget
          <select name="budget" defaultValue="" className={input}>
            <option value="">Choose one</option>
            {BUDGETS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label className={label}>
          When do you want to start?
          <select name="timeline" defaultValue="" className={input}>
            <option value="">Choose one</option>
            {TIMELINES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>

      <label className={label}>
        Tell us about your project *
        <textarea
          name="message"
          required
          rows={5}
          maxLength={3000}
          placeholder="What do you do, what are your goals, and anything else we should know?"
          className={input}
        />
      </label>

      {/* Hidden from people; bots that fill it in are ignored */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <label className="flex items-start gap-3 font-serif text-lg text-ink/80">
        <input type="checkbox" name="consent" required className="mt-1.5 accent-cocoa" />
        <span>
          I agree that Socials Bestie can use these details to reply to my
          inquiry, as described in the{" "}
          <Link href="/privacy" className="underline hover:text-denim">
            Privacy Policy
          </Link>
          . *
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-cocoa px-6 py-3.5 text-[0.7rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send inquiry"}
      </button>
      {error && <p className="font-serif text-lg text-red-800">{error}</p>}
    </form>
  );
}
