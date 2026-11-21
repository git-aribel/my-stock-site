"use client";

type Row = { email: string; source: string; consented_at: string; code: string };

// Download the active subscribers as a CSV, to import into an email service
export default function SubscribersExport({ rows }: { rows: Row[] }) {
  function download() {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = [
      ["Email", "Source", "Consented at", "Discount code"],
      ...rows.map((r) => [r.email, r.source, r.consented_at, r.code]),
    ]
      .map((r) => r.map(esc).join(","))
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={rows.length === 0}
      className="bg-cocoa px-5 py-3 text-[0.65rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep disabled:opacity-50"
    >
      Export CSV ({rows.length})
    </button>
  );
}
