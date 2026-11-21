import type { Metadata } from "next";
import ToolPage from "@/components/tools/ToolPage";
import GridPlanner from "@/components/tools/GridPlanner";

export const metadata: Metadata = {
  title: "Instagram & TikTok Grid Planner",
  description: "Free Instagram grid planner and TikTok profile preview. Drag in your posts and see how your feed looks before you post.",
};

export default function GridPlannerPage() {
  return (
    <ToolPage
      eyebrow="Free creator tool"
      title="Grid planner"
      intro="Plan your Instagram feed or TikTok profile before you post. Add your photos, move them around and find the order that makes your profile feel just right."
      path="/tools/grid-planner"
    >
      <GridPlanner />
    </ToolPage>
  );
}
