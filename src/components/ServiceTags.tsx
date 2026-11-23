import Link from "next/link";
import type { Service } from "@/lib/services";
import VintageTag, { TAG_STYLES } from "@/components/VintageTag";

// Each service gets a vintage paper label. `area` is where the writing sits
// inside the label (top right bottom left, in % of its size).
const TAGS = [
  { style: TAG_STYLES.scallop, area: "17% 15% 19% 15%", ink: "text-cocoa-deep", tilt: "-rotate-2" },
  { style: TAG_STYLES.blue, area: "13% 12% 13% 12%", ink: "text-cocoa", tilt: "rotate-[1.5deg]" },
  { style: TAG_STYLES.red, area: "11% 9% 11% 9%", ink: "text-denim", tilt: "rotate-1" },
  { style: TAG_STYLES.crest, area: "24% 12% 24% 12%", ink: "text-rose", body: "text-cream/90", tilt: "-rotate-[1.5deg]" },
];

export default function ServiceTags({ services }: { services: Service[] }) {
  return (
    <div className="grid items-center gap-x-10 gap-y-12 md:grid-cols-2">
      {services.map((s, i) => {
        const tag = TAGS[i % TAGS.length];
        return (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            className={`group relative mx-auto block w-full max-w-[460px] [container-type:inline-size] transition duration-300 hover:-translate-y-1 hover:rotate-0 ${tag.tilt}`}
            style={{ aspectRatio: `${tag.style.w} / ${tag.style.h}` }}
          >
            <VintageTag
              style={tag.style}
              id={`tag-${i}`}
              className="pointer-events-none absolute inset-0 h-full w-full drop-shadow-[0_8px_12px_rgba(54,33,27,0.18)]"
            />
            <div
              className="absolute flex flex-col items-center justify-center text-center"
              style={{ inset: tag.area }}
            >
              <h2 className={`font-script text-[9.5cqw] font-bold leading-[0.95] tracking-tight ${tag.ink}`}>{s.name}</h2>
              <p className={`mt-[2.2cqw] font-serif text-[4cqw] leading-snug ${tag.body ?? "text-ink/90"}`}>{s.short}</p>
              <span className={`mt-[2.6cqw] text-[2.5cqw] uppercase tracking-[0.25em] underline-offset-4 group-hover:underline ${tag.ink}`}>
                Find out more →
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
