import { AppTabs } from "@/components/navigation/app-tabs";

// The native/web split lives in `app-tabs(.web).tsx`, not here: platform-specific route
// files break lazy-loaded web routes (`asyncRoutes`).
export default function TabsLayout() {
  return <AppTabs />;
}
