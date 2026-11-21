import LegalPage from "@/components/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="20 November 2026"
      intro="This policy explains what personal data Socials Bestie collects when you use our website and buy a membership, why we collect it, who sees it, and what rights you have."
      sections={[
        {
          heading: "1. Who is responsible",
          body: [
            "The data controller is [YOUR LEGAL NAME / BUSINESS NAME], [ADDRESS], Portugal ([TAX ID / NIF]). You can contact us at [CONTACT EMAIL].",
          ],
        },
        {
          heading: "2. What we collect",
          body: [
            "Account data: your email address and password (stored only in protected, encrypted form).",
            "Membership data: your plan, billing period, and subscription status. Payments are processed by Stripe, and we never see or store your full card details.",
            "Affiliate data: if you join our affiliate program, your chosen code, payout email, and earnings.",
            "Inquiry data: if you ask about one of our services, the details you put in the form, such as your name, email, business, budget and project description. We use them only to reply to you and prepare a proposal.",
            "Technical data: basic information needed to run and secure the site, such as your IP address and device type, in server logs.",
            "If you give us personal data voluntarily, such as when you email us, we keep what we need to help you. Not giving us the data we need to create your account may stop us from providing the service.",
          ],
        },
        {
          heading: "3. How we use it, and why",
          body: [
            "To create your account, provide your membership and downloads, and take payment. We do this to carry out our contract with you.",
            "To send service emails, such as confirmations and password resets. This is part of providing the service.",
            "To keep the service secure, prevent fraud and misuse, and improve the site. This is in our legitimate interest.",
            "To meet legal obligations, such as tax and accounting rules.",
            "To send marketing emails, only if you have agreed. You can withdraw at any time.",
          ],
        },
        {
          heading: "4. Who we share it with",
          body: [
            "We use trusted providers who process data on our behalf: Supabase (accounts and database), Stripe (payments), Cloudflare (file storage), Vercel (website hosting), and [YOUR EMAIL SERVICE] (sending emails). They may only use your data to provide their service to us.",
            "We may also share data when the law requires it, or to protect our rights or prevent fraud. We do not sell your personal data.",
          ],
        },
        {
          heading: "5. Transfers outside the EU",
          body: [
            "Some of our providers are based outside the European Economic Area, for example in the United States. When your data is transferred, we rely on safeguards the law recognises, such as the European Commission's standard contractual clauses or an adequacy decision.",
          ],
        },
        {
          heading: "6. Cookies",
          body: [
            "We use essential cookies that keep you logged in. These do not need your consent.",
            "If you arrive through a partner's referral link, we ask your permission before saving a referral cookie (called sb_ref) for 60 days. It records which partner referred you, so they can receive credit if you buy a membership. If you decline, we do not save it.",
            "We do not use advertising or tracking cookies.",
          ],
        },
        {
          heading: "7. How long we keep it",
          body: [
            "We keep your account data for as long as your account exists. If you ask us to delete your account, we remove your personal data within [30] days, except what we must keep by law, such as billing records for the period required by tax law.",
          ],
        },
        {
          heading: "8. Security",
          body: [
            "We protect your data with measures such as encrypted connections, restricted access, and secure providers. No system is perfectly secure, but we work to keep your data safe and will tell you and the authorities if a breach affects you, as the law requires.",
          ],
        },
        {
          heading: "9. Your rights",
          body: [
            "Under the GDPR, you can ask us to: access your data; correct it; delete it; limit how we use it; give you a copy in a portable format; and stop using it for purposes based on our legitimate interest.",
            "You can review and change your email and password from your account. For anything else, email [CONTACT EMAIL], and we will reply within one month. You can also complain to the Portuguese data protection authority, the CNPD (cnpd.pt), or the authority in your country.",
          ],
        },
        {
          heading: "10. Marketing emails",
          body: [
            "If you receive marketing emails from us, you can unsubscribe at any time using the link in the email. You will still receive service emails, such as receipts and password resets.",
          ],
        },
        {
          heading: "11. Children",
          body: [
            "Socials Bestie is not intended for people under 16, and we do not knowingly collect their data. If you think a child has given us personal data, contact us and we will delete it.",
          ],
        },
        {
          heading: "12. Changes to this policy",
          body: [
            "We may update this policy. If we make a significant change, we will tell you by email or on the website, and the date at the top will change.",
          ],
        },
      ]}
    />
  );
}
