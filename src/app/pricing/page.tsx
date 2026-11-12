import CheckoutButton from "@/components/CheckoutButton";
// ✏️ CHANGE YOUR PRICES HERE
const plans = [
  {
    id: "monthly",
    name: "Monthly",
    price: 19,
    months: 1,
    billed: "Billed every month",
    badge: null,
    featured: false,
  },
  {
    id: "quarterly",
    name: "3 Months",
    price: 49,
    months: 3,
    billed: "Billed every 3 months",
    badge: null,
    featured: false,
  },
  {
    id: "annual",
    name: "Annual",
    price: 182,
    months: 12,
    billed: "Billed once a year",
    badge: "Best value",
    featured: true,
  },
];

const features = [
  "Unlimited video downloads",
  "Unlimited Canva templates",
  "Images and stickers included",
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

const monthlyPrice = plans[0].price;

function formatPrice(n: number) {
  return Number.isInteger(n) ? `${n}` : n.toFixed(2);
}

export default function PricingPage() {
  return (
    <div>
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
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => {
            const perMonth = plan.price / plan.months;
            const savings = Math.round((1 - perMonth / monthlyPrice) * 100);

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col p-8 text-center ${
                  plan.featured
                    ? "linen text-cream md:-translate-y-4"
                    : "border border-cocoa/25 bg-paper text-cocoa"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-periwinkle px-4 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-cocoa">
                    {plan.badge}
                  </span>
                )}

                <h2
                  className={`font-script text-5xl ${
                    plan.featured ? "text-periwinkle" : "text-denim"
                  }`}
                >
                  {plan.name}
                </h2>

                <p className="mt-6 font-serif text-6xl">
                  ${formatPrice(plan.price)}
                </p>
                <p
                  className={`mt-2 text-[0.65rem] uppercase tracking-[0.25em] ${
                    plan.featured ? "text-cream/60" : "text-cocoa/60"
                  }`}
                >
                  {plan.billed}
                </p>

                <p className="mt-4 font-serif text-lg">
                  ${formatPrice(perMonth)} / month
                  {savings > 0 && (
                    <span
                      className={
                        plan.featured ? " text-periwinkle" : " text-denim"
                      }
                    >
                      {" "}
                      · save {savings}%
                    </span>
                  )}
                </p>

                <ul className="mt-8 flex-1 space-y-3 text-left font-serif text-lg">
                  {features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <span
                        className={
                          plan.featured ? "text-periwinkle" : "text-denim"
                        }
                      >
                        ✦
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <CheckoutButton
                  planId={plan.id}
                  planName={plan.name}
                  featured={plan.featured}
                />
              </div>
            );
          })}
        </div>
      </section>

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