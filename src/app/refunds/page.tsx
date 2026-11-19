import LegalPage from "@/components/LegalPage";

export default function RefundsPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="19 November 2026"
      intro="We want you to be happy with your membership. Here is how cancellations and refunds work."
      sections={[
        {
          heading: "Cancelling",
          body: [
            "You can cancel at any time from your account page. You keep access until the end of the period you have already paid for, and your membership will not renew.",
          ],
        },
        {
          heading: "Refunds",
          body: [
            "If you have not downloaded any content, you can request a full refund within 14 days of your purchase.",
            "Once you have downloaded content, the digital content has been delivered and we cannot offer a refund for that billing period. If something is wrong with a file or your account, contact us and we will help.",
          ],
        },
        {
          heading: "Renewals",
          body: [
            "If a renewal charges you by mistake, for example after you cancelled, contact us within 7 days and we will refund it.",
          ],
        },
        {
          heading: "How to ask",
          body: [
            "Email [CONTACT EMAIL] from the address on your account, and include the date of the charge.",
          ],
        },
      ]}
    />
  );
}
