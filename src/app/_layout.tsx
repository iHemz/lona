import { Stack } from "expo-router";

import { ThemePreferenceProvider } from "@/hooks/use-theme-preference";

export default function RootLayout() {
  return (
    <ThemePreferenceProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="friend/[id]" options={{ presentation: "modal" }} />
        <Stack.Screen name="profile" options={{ presentation: "modal" }} />
        <Stack.Screen name="settings" options={{ presentation: "modal" }} />
      </Stack>
    </ThemePreferenceProvider>
  );
}
