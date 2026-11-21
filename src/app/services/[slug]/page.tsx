import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES, getService } from "@/lib/services";
import ServiceInquiryForm from "@/components/ServiceInquiryForm";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.seoTitle,
    description: service.short,
  };
}

// The URL is read inside <Suspense> so moving between pages stays instant
export default function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<section className="linen h-[480px]" />}>
      <ServiceView params={params} />
    </Suspense>
  );
}

async function ServiceView({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.seoTitle,
          serviceType: service.name,
          description: service.short,
          url: `${SITE_URL}/services/${service.slug}`,
          provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          audience: { "@type": "Audience", audienceType: "Small businesses and creators" },
        }}
      />
      {/* Intro */}
      <section className="linen">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center md:py-24">
          <Link
            href="/services"
            className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80 hover:text-periwinkle"
          >
            ← Our services
          </Link>
          <h1 className="mt-4 font-script text-7xl text-periwinkle md:text-9xl">
            {service.name}
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-xl leading-relaxed text-cream/80">
            {service.intro}
          </p>
          <a
            href="#inquire"
            className="mt-10 inline-block bg-periwinkle px-8 py-3.5 text-[0.7rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-cream"
          >
            Get a quote
          </a>
        </div>
      </section>

      {/* What's included */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <h2 className="text-center font-script text-6xl text-denim md:text-7xl">
          What&apos;s included
        </h2>
        <div className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2">
          {service.included.map((item, i) => (
            <div key={item.title} className="flex gap-5">
              <p className="font-serif text-4xl leading-none text-rose-deep">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div>
                <h3 className="text-[0.75rem] uppercase tracking-[0.25em] text-cocoa">
                  {item.title}
                </h3>
                <p className="mt-2 font-serif text-lg leading-relaxed text-ink/80">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-12 text-center font-serif text-lg text-cocoa/70">
          Every package is tailored to your business, so your price depends on
          what you need.
        </p>
      </section>

      {/* How it works */}
      <section className="panel-denim">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <h2 className="text-center font-script text-6xl text-cream md:text-7xl">
            How it works
          </h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-4">
            {service.steps.map((step, i) => (
              <li key={step.title} className="bg-cream p-6 text-center">
                <p className="font-serif text-3xl text-rose-deep">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-[0.7rem] uppercase tracking-[0.25em] text-cocoa">
                  {step.title}
                </h3>
                <p className="mt-3 font-serif text-lg leading-relaxed text-ink/80">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Form */}
      <section id="inquire" className="scroll-mt-20">
        <div className="mx-auto max-w-2xl px-6 py-16 md:py-20">
          <h2 className="text-center font-script text-6xl text-denim md:text-7xl">
            Let&apos;s work together
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center font-serif text-xl text-ink/75">
            Tell us a little about you and your project. We&apos;ll get back to
            you within 2 business days.
          </p>
          <div className="mt-10 border border-cocoa/25 bg-paper p-6 md:p-10">
            <ServiceInquiryForm
              service={service.slug}
              fields={service.fields}
            />
          </div>
        </div>
      </section>

      {/* Other services */}
      <section className="border-t border-cocoa/15">
        <div className="mx-auto max-w-5xl px-6 py-14 text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-cocoa/60">
            More services
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="border border-cocoa px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-rose/40"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
