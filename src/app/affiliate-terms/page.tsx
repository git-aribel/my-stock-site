import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import {
  COMMISSION_MONTHS,
  COMMISSION_PERCENT,
  COOKIE_DAYS,
  HOLD_DAYS,
  MIN_PAYOUT_CENTS,
  formatMoney,
} from "@/lib/affiliates";

export const metadata: Metadata = {
  title: "Affiliate Terms",
  description:
    "The terms of the Socials Bestie affiliate program: commission, cookies and payouts.",
};

export default function AffiliateTermsPage() {
  return (
    <LegalPage
      title="Affiliate Terms"
      updated="20 November 2026"
      intro="These terms apply if you join the Socials Bestie affiliate program. They add to our Terms of Service, which also apply to you."
      sections={[
        {
          heading: "1. Joining",
          body: [
            "You apply on our affiliates page with your own account. We review every application and may accept or decline it at our discretion. You must be at least 18 years old to join.",
          ],
        },
        {
          heading: "2. How referrals work",
          body: [
            `When someone visits through your link and accepts our referral cookie, we remember your code for ${COOKIE_DAYS} days. If they buy their first membership in that time, the membership is credited to you.`,
            "If a visitor declines the cookie, uses another partner's link later, or clears their cookies, we may not be able to credit you. Only new members count: people who have had a membership before, and your own account, do not earn commission.",
          ],
        },
        {
          heading: "3. Commission",
          body: [
            `You earn ${COMMISSION_PERCENT}% of each payment a referred member makes, before taxes, for the first ${COMMISSION_MONTHS} months of their membership.`,
            "If a payment is refunded or charged back, the commission on it is reduced or cancelled. If we have already paid it, we may deduct it from a future payout.",
          ],
        },
        {
          heading: "4. Payouts",
          body: [
            `Commissions are held for ${HOLD_DAYS} days in case of refunds. After that, we pay by PayPal to your payout email at the start of each month, once your balance ready to pay is at least ${formatMoney(MIN_PAYOUT_CENTS)}. Smaller balances roll over to the next month.`,
            "You are responsible for any taxes on your earnings, and for keeping your payout email up to date.",
          ],
        },
        {
          heading: "5. How you may promote us",
          body: [
            "Be honest. Clearly say that you earn a commission when you share your link, as the law and platform rules require.",
            "Do not send spam, make false claims or promises, pretend to be Socials Bestie, bid on our brand name in search ads, use coupon or cashback sites, or refer yourself or people you pay to sign up.",
            "Do not share our paid content itself. Your link is for sending people to our site, not for giving away files.",
          ],
        },
        {
          heading: "6. Ending your participation",
          body: [
            "You can leave the program at any time by contacting us. We may suspend or remove you if you break these terms, and in that case we may withhold commissions earned through the breach.",
            "If we close the program or remove you for any other reason, we will pay out the valid commissions you earned up to that point.",
          ],
        },
        {
          heading: "7. Changes",
          body: [
            "We may change these terms, including commission rates, by telling you by email at least 14 days before the change takes effect. Changes do not affect commissions already earned.",
          ],
        },
        {
          heading: "8. Your relationship with us",
          body: [
            "You are an independent partner, not an employee, agent or representative of Socials Bestie. You cannot make promises on our behalf.",
          ],
        },
      ]}
    />
  );
}
