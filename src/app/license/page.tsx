import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "License",
  description:
    "What you can and can't do with Socials Bestie stock videos, images, templates and stickers.",
};

export default function LicensePage() {
  return (
    <LegalPage
      title="License Terms"
      updated="20 November 2026"
      intro="With an active membership, you receive a license to use Socials Bestie videos, images, stickers and Canva templates in your own projects and your clients' projects. This page explains exactly what that means."
      sections={[
        {
          heading: "1. Your license",
          body: [
            "While your membership is active, we give you a limited, non-exclusive, non-transferable, revocable license to download and use the content for personal and commercial purposes, worldwide.",
            "This includes social media posts, Reels, TikToks and Stories, websites, ads, newsletters, presentations, and other marketing, for your own brand or for your clients.",
          ],
        },
        {
          heading: "2. Working with clients",
          body: [
            "You may use the content in work you create for clients, such as managing their social media. The content must be part of a finished piece of work (a post, a video, a design), not handed over as a stand-alone file for the client to reuse or pass on.",
            "If a client wants to use our content themselves for new projects, they need their own membership.",
          ],
        },
        {
          heading: "3. Editing",
          body: [
            "You are welcome to edit the content: crop it, recolour it, add text, music, logos, and combine it with your own work. We encourage it, so your content feels like your brand.",
          ],
        },
        {
          heading: "4. Videos and images",
          body: [
            "You may use videos and images in your published work, in any format. You may not sell, share, or give away the original files, on their own or in bundles, even if you have edited them slightly.",
          ],
        },
        {
          heading: "5. Canva templates",
          body: [
            "You may customise the templates in Canva and use the results in your own or your clients' posts. You may not sell, share, or give away the templates themselves, in original or slightly edited form, or publish a template link for others to copy.",
          ],
        },
        {
          heading: "6. Stickers",
          body: [
            "You may use stickers as part of your designs, stories, and carousels. You may not sell or redistribute the sticker files, or sell sticker packs or products made mainly of our stickers.",
          ],
        },
        {
          heading: "7. What you may not do",
          body: [
            "Resell, sublicense, share, or redistribute the original content, by any method, including marketplaces, file-sharing sites, communities, or AI training datasets.",
            "Share your account or downloads with people who do not have their own membership.",
            "Use the content in a logo, trademark, or brand identity.",
            "Claim that you created the original content.",
            "Use the content in a way that is unlawful, defamatory, or misleading, or that shows a person in a bad light.",
          ],
        },
        {
          heading: "8. When your membership ends",
          body: [
            "Work you published while you were a member can stay online, and you do not need to take it down.",
            "After your membership ends, you may not use the content you downloaded in new projects. Please delete the original files from your devices.",
          ],
        },
        {
          heading: "9. Ownership",
          body: [
            "We and our licensors keep all rights to the content. This license lets you use it, but does not transfer ownership or any intellectual property rights.",
          ],
        },
        {
          heading: "10. Breaking these terms",
          body: [
            "If you break this license, we may revoke it, suspend your account, and take legal action to protect our content.",
          ],
        },
        {
          heading: "11. Questions",
          body: [
            "If you are unsure whether a use is allowed, or you need a bigger license for a special project, email [CONTACT EMAIL] before you publish.",
          ],
        },
      ]}
    />
  );
}
