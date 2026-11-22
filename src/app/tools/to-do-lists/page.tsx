import type { Metadata } from "next";
import ToolPage from "@/components/tools/ToolPage";
import Checklists from "@/components/tools/Checklists";

export const metadata: Metadata = {
  title: "To-do Lists for Creators",
  description:
    "Free to-do lists made for content creators and small businesses. Start from ready-made checklists (before you post, daily engagement, brand deals, launches) or make your own.",
};

export default function ToDoListsPage() {
  return (
    <ToolPage
      eyebrow="Free creator tool"
      title="To-do lists"
      intro="Pick a ready-made checklist made for creators and brands, or start a blank list of your own. Daily and weekly lists untick themselves, so your routine is always ready."
      path="/tools/to-do-lists"
    >
      <Checklists />
    </ToolPage>
  );
}
