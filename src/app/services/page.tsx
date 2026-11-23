import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import Reveal from "@/components/Reveal";
import ServiceTags from "@/components/ServiceTags";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Done-for-you social media management, content creation, UGC and website design for small businesses and creators.",
};

export default function ServicesPage() {
  return (
    <div>
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center md:py-24">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80">
            Work with us
          </p>
          <h1 className="mt-4 font-script text-7xl text-periwinkle md:text-9xl">
            Our services
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-xl leading-relaxed text-cream/80">
            Want it done for you? From your website to your feed, we help small
            businesses and creators show up online beautifully.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <Reveal as="div">
          <ServiceTags services={SERVICES} />
        </Reveal>
      </section>

      <section className="panel-denim">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h2 className="font-script text-6xl text-cream">Need something else?</h2>
          <p className="mx-auto mt-4 max-w-xl font-serif text-xl text-cream/85">
            Every business is different. Tell us what you need and we&apos;ll
            put together a custom package for you.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block bg-cream px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-periwinkle"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
