export type LegalSection = { heading: string; body: string[] };

type Props = {
  title: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
};

export default function LegalPage({ title, updated, intro, sections }: Props) {
  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h1 className="font-script text-6xl text-periwinkle md:text-8xl">
            {title}
          </h1>
          <p className="mt-4 text-[0.65rem] uppercase tracking-[0.3em] text-cream/60">
            Last updated {updated}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-14">
        {intro && (
          <p className="mb-10 font-serif text-xl leading-relaxed text-ink/80">
            {intro}
          </p>
        )}
        <div className="space-y-10">
          {sections.map((s) => (
            <div key={s.heading}>
              <h2 className="text-[0.75rem] uppercase tracking-[0.25em] text-denim">
                {s.heading}
              </h2>
              <div className="mt-3 space-y-3">
                {s.body.map((p, i) => (
                  <p
                    key={i}
                    className="font-serif text-lg leading-relaxed text-ink/80"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
