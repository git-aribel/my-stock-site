import Link from "next/link";

const cards = [
  {
    title: "Stock Videos",
    text: "Soft, vintage-feeling clips made for Reels, TikToks and Shorts.",
    panel: "panel-denim",
    href: "/videos",
  },
  {
    title: "Canva Templates",
    text: "Editable templates that make your brand look cohesive in minutes.",
    panel: "panel-rose",
    href: "/templates",
  },
  {
    title: "Images",
    text: "Aesthetic photos, textures and backgrounds for your content.",
    panel: "panel-mist",
    href: "/images",
  },
  {
    title: "Stickers",
    text: "Little illustrations and details to scatter across your designs.",
    panel: "linen",
    href: "/stickers",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero: brown linen with big script */}
      <section className="linen">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80">
            Videos, templates, images & stickers
          </p>

          <h1 className="mt-6 font-script text-7xl leading-[0.85] text-periwinkle sm:text-8xl md:text-[10rem]">
            <span className="block">Socials</span>
            <span className="block pl-[16%] md:pl-[28%]">Bestie</span>
          </h1>

          <div className="mt-14 grid gap-8 font-serif text-lg leading-relaxed text-cream/80 md:grid-cols-2">
            <p>
              Your own look, your own series. The colours you gravitate towards,
              the clips you repeat, the way you show up online. Strong brands
              are built through familiarity, not perfection.
            </p>
            <p>
              Socials Bestie is a library of soft, vintage-inspired stock
              videos, images, stickers and editable Canva templates, made so
              your content feels like you every time you post.
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/pricing"
              className="bg-periwinkle px-8 py-3 text-center text-[0.7rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-cream"
            >
              Join the club
            </Link>
            <Link
              href="/videos"
              className="border border-periwinkle/70 px-8 py-3 text-center text-[0.7rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-periwinkle/10"
            >
              Browse the library
            </Link>
          </div>
        </div>
      </section>

      {/* Postcard collection */}
      <section className="mx-auto mt-20 max-w-6xl px-6">
        <p className="text-center font-script text-6xl text-denim">
          the collection
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group border border-cocoa/25 bg-paper transition hover:-translate-y-1"
            >
              <div className={`${c.panel} flex h-44 items-center justify-center`}>
                <h2 className="emboss px-4 text-center font-script text-4xl text-cream">
                  {c.title}
                </h2>
              </div>
              <div className="p-5">
                <p className="font-serif text-lg leading-relaxed text-ink/80">
                  {c.text}
                </p>
                <p className="mt-4 text-[0.65rem] uppercase tracking-[0.25em] text-denim group-hover:text-cocoa">
                  Browse →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Dusty rose band with stamp-style button */}
      <section className="mt-24 bg-rose py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="emboss font-script text-6xl text-cream md:text-7xl">
            Unlimited, always
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-serif text-xl leading-relaxed text-cocoa/80">
            Download as many videos, templates, images and stickers as you
            like, one at a time or all at once, with a single membership.
          </p>
          <Link
            href="/pricing"
            className="stamp mx-auto mt-10 flex h-28 w-28 items-center justify-center px-3 text-center text-[0.6rem] uppercase leading-relaxed tracking-[0.2em] text-cocoa transition hover:bg-cream/40"
          >
            Join the club
          </Link>
        </div>
      </section>
    </div>
  );
}