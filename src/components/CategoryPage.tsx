import Link from "next/link";

type Props = {
  label: string;
  script: string;
  description: string;
  aspect: string;
  columns: string;
  panel: string;
  count?: number;
};

export default function CategoryPage({
  label,
  script,
  description,
  aspect,
  columns,
  panel,
  count = 8,
}: Props) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div>
      {/* Header band */}
      <section className="linen">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center md:py-24">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80">
            {label}
          </p>
          <h1 className="mt-4 font-script text-7xl text-periwinkle md:text-9xl">
            {script}
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-xl leading-relaxed text-cream/80">
            {description}
          </p>
        </div>
      </section>

      {/* Placeholder grid */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className={`grid gap-6 ${columns}`}>
          {items.map((i) => (
            <div key={i} className="border border-cocoa/25 bg-paper p-2">
              <div
                className={`${panel} ${aspect} flex items-center justify-center`}
              >
                <span className="emboss font-script text-3xl text-cream">
                  coming soon
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/pricing"
            className="bg-cocoa px-8 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep"
          >
            Join to download
          </Link>
        </div>
      </section>
    </div>
  );
}