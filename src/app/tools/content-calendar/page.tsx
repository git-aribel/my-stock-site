import type { Metadata } from "next";
import ToolPage from "@/components/tools/ToolPage";
import ContentCalendar from "@/components/tools/ContentCalendar";

export const metadata: Metadata = {
  title: "Content Calendar | Socials Bestie",
  description:
    "Plan your Instagram, TikTok and other social media posts on a simple monthly calendar. Free with a Socials Bestie account.",
};

export default function ContentCalendarPage() {
  return (
    <ToolPage
      eyebrow="Free creator tool"
      title="Content calendar"
      intro="Plan what to post and when. Add your ideas, captions and posting times, track what's ready, and see your whole month at a glance."
      path="/tools/content-calendar"
    >
      <ContentCalendar />
    </ToolPage>
  );
}
