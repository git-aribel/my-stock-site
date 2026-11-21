import type { Metadata } from "next";
import ToolPage from "@/components/tools/ToolPage";
import ContentCalendar from "@/components/tools/ContentCalendar";

export const metadata: Metadata = {
  title: "Content Calendar",
  description:
    "Free social media content calendar with social media holidays built in. Plan your Instagram, TikTok and other posts by month or week.",
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
