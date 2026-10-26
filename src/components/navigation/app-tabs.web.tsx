import { Tabs } from "expo-router/tabs";
import { SymbolView } from "expo-symbols";

import { APP_TABS } from "@/constants/tabs";
import { FontSize } from "@/constants/theme";
import { useTabBadges } from "@/hooks/use-tab-badges";
import { useThemeColors } from "@/hooks/use-theme";

// React Navigation's default (49) clips the label under a 24pt icon.
const TAB_BAR_HEIGHT = 60;

export function AppTabs() {
  const colors = useThemeColors();
  const badges = useTabBadges();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: TAB_BAR_HEIGHT,
          backgroundColor: colors.surface,
          borderTopColor: colors.separator,
        },
        tabBarLabelStyle: { fontSize: FontSize.caption, lineHeight: 16, fontWeight: "500" },
      }}
    >
      {APP_TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarBadge: badges[tab.name] || undefined,
            tabBarIcon: ({ color, size }) => (
              <SymbolView name={{ web: tab.md }} size={size} tintColor={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
