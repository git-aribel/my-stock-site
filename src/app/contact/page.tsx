import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Socials Bestie about the membership, services or partnerships.",
};

// ✏️ CONTACT PAGE TEXT
const sections = [
  {
    heading: "Email us",
    body: ["[CONTACT EMAIL]", "We usually reply within 1 to 2 business days."],
  },
  {
    heading: "Account or payment problems",
    body: [
      "Please include the email address you signed up with, and a screenshot if something is not working. This helps us fix it faster.",
    ],
  },
  {
    heading: "Licensing questions",
    body: [
      "If you are not sure whether a use is allowed, or you need a license for a special project, write to us before you publish.",
    ],
  },
  {
    heading: "Business details",
    body: ["[YOUR LEGAL NAME / BUSINESS NAME], [ADDRESS], Portugal."],
  },
];

// A cream paper card with a wavy frame, on pale blue striped linen
export default function ContactPage() {
  return (
    <div className="ticking px-4 py-14 sm:px-6 md:py-24">
      <div className="postcard mx-auto max-w-2xl px-8 py-14 sm:px-14 md:px-20 md:py-20">
        <p className="text-center text-[0.65rem] uppercase tracking-[0.3em] text-rose-deep">
          Socials Bestie
        </p>
        <h1 className="mt-3 text-center font-script text-6xl text-denim md:text-8xl">Contact</h1>
        <p className="mx-auto mt-6 max-w-md text-center font-serif text-xl leading-relaxed text-ink/80">
          We&apos;re happy to help. Send us an email and we&apos;ll get back to you as
          soon as we can.
        </p>

        <div className="mx-auto my-10 flex items-center justify-center gap-3 text-rose-deep" aria-hidden="true">
          <span className="h-px w-12 bg-rose-deep/50" />✦<span className="h-px w-12 bg-rose-deep/50" />
        </div>

        <div className="space-y-9">
          {sections.map((s) => (
            <div key={s.heading} className="text-center">
              <h2 className="text-[0.8rem] font-bold uppercase tracking-[0.22em] text-cocoa-deep">{s.heading}</h2>
              <div className="mt-2.5 space-y-2">
                {s.body.map((p, i) => (
                  <p key={i} className="font-serif text-lg leading-relaxed text-ink/80">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
