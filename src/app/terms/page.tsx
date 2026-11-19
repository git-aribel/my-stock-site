import LegalPage from "@/components/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="19 November 2026"
      intro="These terms apply when you use the Socials Bestie website and buy a membership. By creating an account or subscribing, you agree to them."
      sections={[
        {
          heading: "Who we are",
          body: [
            "Socials Bestie is operated by [YOUR LEGAL NAME / BUSINESS NAME], based in [COUNTRY]. You can reach us at [CONTACT EMAIL].",
          ],
        },
        {
          heading: "Memberships and billing",
          body: [
            "Socials Bestie offers paid memberships billed monthly, every 3 months, or annually. Prices are shown on the pricing page and include or exclude VAT as stated at checkout.",
            "Memberships renew automatically at the end of each billing period until you cancel. Payments are handled securely by Stripe.",
          ],
        },
        {
          heading: "Cancelling",
          body: [
            "You can cancel at any time from your account page. Your membership stays active until the end of the period you have already paid for, and then it will not renew.",
            "Refunds are covered in our Refund Policy.",
          ],
        },
        {
          heading: "Your account",
          body: [
            "You are responsible for keeping your login details safe. Your membership is for one person. Please do not share your account or your downloads with others.",
          ],
        },
        {
          heading: "Using the content",
          body: [
            "Everything you download is covered by our License Terms. Please read them, because they explain what you can and cannot do with the files.",
          ],
        },
        {
          heading: "Fair use",
          body: [
            "Downloads are unlimited for normal use. To protect the service, we apply a daily download limit, and we may suspend accounts that use automated tools to copy the library, share downloads publicly, or otherwise abuse the service.",
          ],
        },
        {
          heading: "Availability and changes",
          body: [
            "We add and sometimes remove content over time, and we may update the website or these terms. If we make a significant change to the terms, we will let you know by email or on the website.",
          ],
        },
        {
          heading: "Liability",
          body: [
            "We do our best to keep the service running and the content high quality, but we provide it as is. To the extent allowed by law, we are not liable for indirect or consequential losses. Nothing in these terms limits your legal rights as a consumer.",
          ],
        },
        {
          heading: "Governing law",
          body: [
            "These terms are governed by the laws of [COUNTRY]. If you are a consumer in the EU, you also keep the protections of the consumer law of the country where you live.",
          ],
        },
      ]}
    />
  );
}
