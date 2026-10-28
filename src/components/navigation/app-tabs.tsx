import { NativeTabs } from "expo-router/native-tabs";

import { APP_TABS } from "@/constants/tabs";
import { useTabBadges } from "@/hooks/use-tab-badges";
import { useThemeColors } from "@/hooks/use-theme";

// Web uses `app-tabs.web.tsx`: the web build of native tabs renders its bar at the top.
export function AppTabs() {
  const colors = useThemeColors();
  const badges = useTabBadges();

  return (
    <NativeTabs tintColor={colors.primary}>
      {APP_TABS.map((tab) => {
        const badge = badges[tab.name];
        return (
          <NativeTabs.Trigger key={tab.name} name={tab.name}>
            <NativeTabs.Trigger.Icon sf={tab.sf} md={tab.md} />
            <NativeTabs.Trigger.Label>{tab.label}</NativeTabs.Trigger.Label>
            {badge ? <NativeTabs.Trigger.Badge>{String(badge)}</NativeTabs.Trigger.Badge> : null}
          </NativeTabs.Trigger>
        );
      })}
    </NativeTabs>
  );
}
