import LegalPage from "@/components/LegalPage";

export default function LicensePage() {
  return (
    <LegalPage
      title="License Terms"
      updated="19 November 2026"
      intro="With an active membership, you can use Socials Bestie videos, images, stickers and Canva templates in your own projects and for your clients. Here is exactly what that means."
      sections={[
        {
          heading: "What you can do",
          body: [
            "Use the content in your social media posts, videos, websites, ads, and other marketing, for yourself or for your clients, including commercial projects.",
            "Edit, crop, recolour, and combine the content with your own work. Customise the Canva templates to match your brand.",
          ],
        },
        {
          heading: "What you cannot do",
          body: [
            "Resell, share, sublicense, or redistribute the original files, either on their own or in bundles, on marketplaces, or through file-sharing sites.",
            "Resell or give away the Canva templates, including slightly edited versions, as templates.",
            "Share your account or your downloads with people who do not have their own membership.",
            "Claim that you created the original content, or use it in a way that is unlawful, defamatory, or misleading.",
            "Use the content as part of a logo or trademark.",
          ],
        },
        {
          heading: "If your membership ends",
          body: [
            "Projects you published while you were a member can stay live. After your membership ends, you may not start new projects using content you downloaded, and you should delete your copies of the original files.",
          ],
        },
        {
          heading: "Ownership",
          body: [
            "We keep all rights to the content. This license lets you use it, but it does not transfer ownership.",
          ],
        },
        {
          heading: "Questions",
          body: [
            "If you are unsure whether a use is allowed, or you need a license for a larger project, email [CONTACT EMAIL].",
          ],
        },
      ]}
    />
  );
}
