import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms of service for the Socials Bestie website and membership.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="20 November 2026"
      intro="These terms apply when you use the Socials Bestie website and buy a membership. By creating an account, subscribing, or otherwise using the site, you agree to them."
      sections={[
        {
          heading: "1. Who we are",
          body: [
            "Socials Bestie is operated by [YOUR LEGAL NAME / BUSINESS NAME], [ADDRESS], Portugal ([TAX ID / NIF]). You can reach us at [CONTACT EMAIL].",
            'In these terms, "we" and "us" mean the operator above, "you" means the person using the site, "content" means the videos, templates, images and stickers in our library, and "membership" means a paid subscription to the library.',
          ],
        },
        {
          heading: "2. Accepting these terms",
          body: [
            "If you do not agree with these terms, please do not use the site. If you use Socials Bestie on behalf of a business, you confirm that you are allowed to accept these terms for that business.",
          ],
        },
        {
          heading: "3. Changes to these terms",
          body: [
            "We may update these terms from time to time. If we make a significant change, we will tell you by email or on the website before it takes effect. If you keep using the site after a change takes effect, you accept the updated terms. If you do not agree, you can cancel your membership.",
          ],
        },
        {
          heading: "4. Your account and age",
          body: [
            "You need an account to buy a membership. Please give accurate details and keep your login safe. You are responsible for what happens under your account.",
            "You must be at least 16 years old to use Socials Bestie, or older if the law where you live requires it.",
          ],
        },
        {
          heading: "5. One account, one person",
          body: [
            "A membership is for one person. Please do not share your login or your downloads with people who do not have their own membership. We may suspend accounts that are shared.",
          ],
        },
        {
          heading: "6. Acceptable use",
          body: [
            "You agree not to: use the site for anything unlawful; try to break, overload, or get around its security or download limits; use bots or other automated tools to copy the library; upload or send harmful or abusive material; or resell or redistribute our content (see our License Terms).",
            "If you break these rules, we may suspend or close your account. If we close it because of your misuse, we may not refund the current period.",
          ],
        },
        {
          heading: "7. Prices, payment and taxes",
          body: [
            "Prices are shown on the pricing page and at checkout, together with any VAT or other taxes that apply to your location. Payments are handled by Stripe, and by paying you also accept Stripe's terms. We never see or store your full card details.",
            "If you disagree with a charge, please contact us first at [CONTACT EMAIL] so we can sort it out quickly. Your legal rights to dispute a payment with your bank are not affected.",
            "A receipt is sent after each payment. If you need an invoice with your business details, email [CONTACT EMAIL] with your order details.",
          ],
        },
        {
          heading: "8. Digital delivery",
          body: [
            "Our content is digital. Once your payment is confirmed, you can download from the library straight away, from your account. If you have trouble accessing your membership, email [CONTACT EMAIL] and we will help.",
          ],
        },
        {
          heading: "9. Memberships and recurring billing",
          body: [
            "Memberships are available as monthly, 3-month, and annual plans. By subscribing, you authorise us (through Stripe) to charge your payment method at the start of each period. Your membership renews automatically for another period at the then-current price until you cancel.",
            "You can cancel at any time from your account page. Cancelling stops future renewals, and your access continues until the end of the period you have already paid for.",
            "If we change the price or the plans, we will tell you in advance, and the change will apply from your next renewal. You can cancel before then if you do not agree.",
          ],
        },
        {
          heading: "10. Cancellations and refunds",
          body: [
            "Our content is digital and you get instant access as soon as your payment is confirmed. Because of this, all sales are final, and we do not offer refunds, exchanges, or returns after purchase. This applies to monthly, 3-month, and annual memberships, and to renewal payments.",
            "By subscribing, you agree to start your membership immediately and acknowledge that you give up your right to withdraw from the purchase once access begins, to the extent the law allows.",
            "You can cancel at any time from your account page. Cancelling stops future renewals, and you keep access until the end of the period you already paid for. We do not refund the unused part of that period, or a renewal because you forgot to cancel. Please cancel before your renewal date if you do not want to be charged again.",
            "Orders are processed automatically and cannot be cancelled once payment is submitted, so please check your plan and price before you pay.",
            "If you were charged twice, cannot access your membership, or a file does not work, email [CONTACT EMAIL] and we will fix it. Duplicate charges and technical errors on our side will be corrected.",
            "Nothing in this section affects any rights you have under mandatory consumer law that cannot be waived.",
          ],
        },
        {
          heading: "11. Changes to the service",
          body: [
            "We add new content and sometimes remove content, and we may change features of the site. We may also change, pause, or end the membership program. If we make a significant change that affects what you paid for, we will give you reasonable notice.",
          ],
        },
        {
          heading: "12. If we stop operating",
          body: [
            "If we decide to close Socials Bestie, we will give you at least 30 days' notice by email. Memberships will then end, and we will refund any period you have paid for but cannot use.",
          ],
        },
        {
          heading: "13. Intellectual property",
          body: [
            "The content, the site, our name, and our branding belong to us or to our licensors, and are protected by copyright and other laws. Your right to use the content is set out in our License Terms. Nothing in these terms transfers ownership to you.",
          ],
        },
        {
          heading: "14. Affiliate program",
          body: [
            "If you join our affiliate program, our Affiliate Terms (at /affiliate-terms) also apply to you.",
          ],
        },
        {
          heading: "15. Disclaimer",
          body: [
            "We work hard to keep the site running and the content high quality, but we provide it as is. We cannot promise that the site will always be available, free of errors, or free of harmful code, and we do not promise any particular results from using our content.",
          ],
        },
        {
          heading: "16. Limits on our liability",
          body: [
            "To the extent the law allows, we are not responsible for indirect or consequential losses, such as lost profits or lost opportunities, and our total liability to you for any claim is limited to the amount you paid us in the 12 months before the claim.",
            "Nothing in these terms limits liability that cannot be limited by law, or your rights as a consumer.",
          ],
        },
        {
          heading: "17. If part of these terms is not valid",
          body: [
            "If any part of these terms is found invalid or unenforceable, the rest stays in effect.",
          ],
        },
        {
          heading: "18. Governing law",
          body: [
            "These terms are governed by Portuguese law. If you are a consumer, you also keep the protections of the mandatory consumer law of the country where you live, and you can bring a claim in the courts of that country as the law allows.",
          ],
        },
        {
          heading: "19. The whole agreement",
          body: [
            "These terms, together with our License Terms and Privacy Policy, are the full agreement between you and us about Socials Bestie.",
          ],
        },
        {
          heading: "20. Contact",
          body: [
            "[YOUR LEGAL NAME / BUSINESS NAME], [ADDRESS], Portugal. Email: [CONTACT EMAIL].",
          ],
        },
      ]}
    />
  );
}
