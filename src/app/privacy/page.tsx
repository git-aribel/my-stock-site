import LegalPage from "@/components/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="19 November 2026"
      intro="This policy explains what personal data Socials Bestie collects, why, and what your rights are."
      sections={[
        {
          heading: "Who is responsible",
          body: [
            "[YOUR LEGAL NAME / BUSINESS NAME], [ADDRESS], [COUNTRY]. Contact: [CONTACT EMAIL].",
          ],
        },
        {
          heading: "What we collect",
          body: [
            "Your email address and password (stored in protected, encrypted form), and your membership status and billing period.",
            "We never see or store your full card details. Payments are processed by Stripe.",
          ],
        },
        {
          heading: "Why we use it",
          body: [
            "To create and manage your account, provide your membership and downloads, process payments, send account emails such as confirmations and password resets, and keep the service secure. These uses are necessary to provide the service you asked for or are in our legitimate interest of preventing abuse.",
          ],
        },
        {
          heading: "Who we share it with",
          body: [
            "We use trusted service providers to run the site: Supabase (accounts and database), Stripe (payments), Cloudflare (file storage), and Vercel (hosting). They process data only on our behalf. We do not sell your data.",
          ],
        },
        {
          heading: "Cookies",
          body: [
            "We use only essential cookies, which keep you logged in. We do not use advertising or tracking cookies.",
          ],
        },
        {
          heading: "How long we keep it",
          body: [
            "We keep your account data while your account exists. Billing records are kept as long as the law requires. If you ask us to delete your account, we will remove your personal data except what we must keep by law.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "Under the GDPR, you can ask to access, correct, delete, or export your data, and object to certain uses. Email [CONTACT EMAIL] and we will respond within one month. You can also complain to your national data protection authority.",
          ],
        },
      ]}
    />
  );
}
