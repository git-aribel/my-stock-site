import LegalPage from "@/components/LegalPage";

export default function FaqPage() {
  return (
    <LegalPage
      title="FAQ"
      updated="20 November 2026"
      intro="Quick answers to the questions we get most. If yours isn't here, email us and we'll help."
      sections={[
        {
          heading: "What is Socials Bestie?",
          body: [
            "A membership library of videos, images, stickers and Canva templates made for social media creators, so you can post consistently without starting from scratch.",
          ],
        },
        {
          heading: "What do I get with a membership?",
          body: [
            "Full access to the entire library, unlimited downloads, bulk downloads, and new content added regularly. You can use everything in your own and your clients' projects.",
          ],
        },
        {
          heading: "What plans are available?",
          body: [
            "Monthly, 3-month, and annual. See the pricing page for current prices. Taxes such as VAT are shown at checkout.",
          ],
        },
        {
          heading: "Can I use the content for clients?",
          body: [
            "Yes, as part of finished work such as posts and videos. You cannot hand over the original files for clients to reuse. See our License Terms for the details.",
          ],
        },
        {
          heading: "Can I edit the content?",
          body: [
            "Yes. Crop it, add text, music, and your branding, and combine it with your own work.",
          ],
        },
        {
          heading: "How do I download in bulk?",
          body: [
            "In the library, tick the items you want, then choose the bulk download option. You will get one ZIP file. You can select up to 50 items at a time.",
          ],
        },
        {
          heading: "How do I use the Canva templates?",
          body: [
            "Download a template, open it in Canva, and customise it with your own text, colours, and photos. You need a Canva account, and the free version works for most templates.",
          ],
        },
        {
          heading: "How do I cancel?",
          body: [
            "Go to your account page and open the billing portal. Cancelling stops future renewals, and you keep access until the end of the period you have paid for.",
          ],
        },
        {
          heading: "Do you offer refunds?",
          body: [
            "Because our content is digital and available instantly, all sales are final. Please cancel before your renewal date if you do not want to be charged again. Full details are in our Terms of Service.",
          ],
        },
        {
          heading: "What happens to my posts if I cancel?",
          body: [
            "Anything you published while you were a member can stay online. After your membership ends, you cannot use the downloaded files in new projects.",
          ],
        },
        {
          heading: "What payment methods do you accept?",
          body: [
            "Payments are processed securely by Stripe. The methods available depend on your country and are shown at checkout. We never see or store your full card details.",
          ],
        },
        {
          heading: "I forgot my password. What do I do?",
          body: [
            'Use the "Forgot password" link on the login page and we will email you a reset link.',
          ],
        },
        {
          heading: "I was charged but cannot access my membership.",
          body: [
            "Wait a minute and refresh your account page. If it still does not show an active membership, email us with the email address you used and we will fix it.",
          ],
        },
        {
          heading: "Do you have an affiliate program?",
          body: [
            "Yes. You can apply on our affiliates page and earn a commission when people join through your link.",
          ],
        },
        {
          heading: "Can I share my account?",
          body: [
            "No. A membership is for one person. Please do not share your login or downloads.",
          ],
        },
        {
          heading: "I have another question.",
          body: ["Email us at [CONTACT EMAIL], or visit our Contact page."],
        },
      ]}
    />
  );
}
