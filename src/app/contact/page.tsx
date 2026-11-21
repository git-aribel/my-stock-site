import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Socials Bestie about the membership, services or partnerships.",
};

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact"
      updated="20 November 2026"
      intro="We're happy to help. Send us an email and we'll get back to you as soon as we can."
      sections={[
        {
          heading: "Email us",
          body: [
            "[CONTACT EMAIL]",
            "We usually reply within 1 to 2 business days.",
          ],
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
      ]}
    />
  );
}
