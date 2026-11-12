"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  planId: string;
  planName: string;
  featured: boolean;
};

export default function CheckoutButton({ planId, planName, featured }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });

      if (res.status === 401) {
        router.push(`/signup?plan=${planId}`);
        return;
      }

      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-10">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`block w-full px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] transition disabled:opacity-60 ${
          featured
            ? "bg-periwinkle text-cocoa hover:bg-cream"
            : "bg-cocoa text-periwinkle hover:bg-cocoa-deep"
        }`}
      >
        {loading ? "One moment..." : `Choose ${planName}`}
      </button>
      {error && <p className="mt-3 font-serif text-base text-red-800">{error}</p>}
    </div>
  );
}