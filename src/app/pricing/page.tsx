import type { Metadata } from "next";
import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Join Socials Bestie from $19 a month. Organic stock videos, Canva templates, images, stickers, Ary your content agent and free planning tools in one membership. Cancel anytime.",
};

// ✏️ CHANGE YOUR PRICES HERE
// These must match the prices in Stripe
// (STRIPE_PRICE_MONTHLY / STRIPE_PRICE_QUARTERLY / STRIPE_PRICE_ANNUAL).
const MONTHLY_PRICE = 19;
const QUARTERLY_PRICE = 49;
const ANNUAL_PRICE = 180;

const quarterlyPerMonth = QUARTERLY_PRICE / 3;
const quarterlySavings = Math.round((1 - quarterlyPerMonth / MONTHLY_PRICE) * 100);

const annualPerMonth = ANNUAL_PRICE / 12;
const annualSavings = Math.round((1 - annualPerMonth / MONTHLY_PRICE) * 100);

const freeFeatures = [
  "Content calendar",
  "Instagram & TikTok grid planner",
  "Font pairing generator",
  "Color palette generator",
  "Brand board downloads",
  "No card needed",
];

const features = [
  "Unlimited video downloads",
  "Unlimited Canva templates",
  "Images and stickers included",
  "Ary 1.0, your content agent",
  "All free Creator Hub tools",
  "Bulk download in one click",
  "New content added regularly",
  "Cancel anytime",
];

const faqs = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel your membership whenever you like and keep access until the end of your billing period.",
  },
  {
    q: "Can I use the content commercially?",
    a: "Yes, you can use everything in your own content and for your clients. You just can't resell or redistribute the files themselves.",
  },
  {
    q: "How do the Canva templates work?",
    a: "Download a template, open the link inside, and it opens as an editable copy in your own Canva account.",
  },
];

function formatPrice(n: number) {
  return Number.isInteger(n) ? `${n}` : n.toFixed(2);
}

// Tells Google about the plans and the FAQs on this page
const pricingData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: `${SITE_NAME} membership`,
      description:
        "Organic stock videos, images, editable Canva templates, stickers, Ary 1.0 your content agent and free planning tools in one membership.",
      brand: { "@type": "Brand", name: SITE_NAME },
      offers: [
        { name: "Monthly", price: MONTHLY_PRICE },
        { name: "3 Months", price: QUARTERLY_PRICE },
        { name: "Annual", price: ANNUAL_PRICE },
      ].map((o) => ({
        "@type": "Offer",
        name: o.name,
        price: o.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/pricing`,
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function PricingPage() {
  return (
    <div>
      <JsonLd data={pricingData} />
      {/* Header band */}
      <section className="linen">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center md:py-24">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.3em] text-periwinkle/80">
            Membership
          </p>
          <h1 className="mt-4 font-script text-7xl text-periwinkle md:text-9xl">
            Join the club
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-xl leading-relaxed text-cream/80">
            One membership, unlimited access to everything. Pick the plan that
            suits you.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 md:items-start xl:grid-cols-4">
          {/* Free */}
          <div className="flex h-full flex-col border border-cocoa/25 bg-paper p-8 text-center text-cocoa">
            <h2 className="font-script text-5xl text-denim">Free</h2>
            <p className="mt-6 font-serif text-6xl">$0</p>
            <p className="mt-2 text-[0.65rem] uppercase tracking-[0.25em] text-cocoa/60">
              Free forever
            </p>
            <p className="mt-4 font-serif text-lg">Creator tools only</p>
            <FeatureList items={freeFeatures} />
            <Link
              href="/signup?next=/tools"
              className="mt-10 block w-full border border-cocoa px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-rose/40"
            >
              Sign up free
            </Link>
          </div>

          {/* Monthly */}
          <div className="flex h-full flex-col border border-cocoa/25 bg-paper p-8 text-center text-cocoa">
            <h2 className="font-script text-5xl text-denim">Monthly</h2>
            <p className="mt-6 font-serif text-6xl">
              ${formatPrice(MONTHLY_PRICE)}
              <span className="text-2xl text-cocoa/70"> / month</span>
            </p>
            <p className="mt-2 text-[0.65rem] uppercase tracking-[0.25em] text-cocoa/60">
              Billed every month
            </p>
            <p className="mt-4 font-serif text-lg">Everything, month to month</p>
            <FeatureList items={features} />
            <CheckoutButton planId="monthly" planName="Monthly" featured={false} />
          </div>

          {/* 3 months */}
          <div className="flex h-full flex-col border border-cocoa/25 bg-paper p-8 text-center text-cocoa">
            <h2 className="font-script text-5xl text-denim">3 Months</h2>
            <p className="mt-6 font-serif text-6xl">
              ${formatPrice(quarterlyPerMonth)}
              <span className="text-2xl text-cocoa/70"> / month</span>
            </p>
            <p className="mt-2 text-[0.65rem] uppercase tracking-[0.25em] text-denim">
              Save {quarterlySavings}%
            </p>
            <p className="mt-4 font-serif text-lg">
              ${formatPrice(QUARTERLY_PRICE)} billed every 3 months
            </p>
            <FeatureList items={features} />
            <CheckoutButton planId="quarterly" planName="3 Months" featured={false} />
          </div>

          {/* Annual */}
          <div className="linen relative flex h-full flex-col p-8 text-center text-cream md:-translate-y-4">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-periwinkle px-4 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-cocoa">
              Best value
            </span>
            <h2 className="font-script text-5xl text-periwinkle">Annual</h2>
            <p className="mt-6 font-serif text-6xl">
              ${formatPrice(annualPerMonth)}
              <span className="text-2xl text-cream/70"> / month</span>
            </p>
            <p className="mt-2 text-[0.65rem] uppercase tracking-[0.25em] text-periwinkle">
              Save {annualSavings}%
            </p>
            <p className="mt-4 font-serif text-lg text-cream/80">
              ${formatPrice(ANNUAL_PRICE)} billed once a year
            </p>
            <FeatureList items={features} featured />
            <CheckoutButton planId="annual" planName="Annual" featured />
          </div>
        </div>
      </section>

      <p className="-mt-6 mb-16 px-6 text-center font-serif text-lg text-cocoa/70">
        New here?{" "}
        <Link href="/welcome-offer" className="text-denim underline hover:text-cocoa">
          Join our email list for 15% off
        </Link>{" "}
        your first payment.
      </p>

      {/* FAQ */}
      <section className="bg-rose py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="emboss text-center font-script text-6xl text-cream">
            Questions
          </h2>
          <div className="mt-10 space-y-8">
            {faqs.map((f) => (
              <div key={f.q} className="border-b border-cocoa/20 pb-6">
                <h3 className="text-[0.75rem] uppercase tracking-[0.2em] text-cocoa">
                  {f.q}
                </h3>
                <p className="mt-3 font-serif text-xl leading-relaxed text-cocoa/80">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureList({
  items,
  featured = false,
}: {
  items: string[];
  featured?: boolean;
}) {
  return (
    <ul className="mt-8 flex-1 space-y-3 text-left font-serif text-lg">
      {items.map((f) => (
        <li key={f} className="flex gap-3">
          <span className={featured ? "text-periwinkle" : "text-denim"}>✦</span>
          <span>{f}</span>
        </li>
      ))}
    </ul>
  );
}
