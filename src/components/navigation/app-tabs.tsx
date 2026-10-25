import { NativeTabs } from "expo-router/unstable-native-tabs";

import { APP_TABS } from "@/constants/tabs";
import { useThemeColors } from "@/hooks/use-theme";

// Web uses `app-tabs.web.tsx`: the web build of native tabs renders its bar at the top.
export function AppTabs() {
  const colors = useThemeColors();

  return (
    <NativeTabs tintColor={colors.primary}>
      {APP_TABS.map((tab) => (
        <NativeTabs.Trigger key={tab.name} name={tab.name}>
          <NativeTabs.Trigger.Icon sf={tab.sf} md={tab.md} />
          <NativeTabs.Trigger.Label>{tab.label}</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
