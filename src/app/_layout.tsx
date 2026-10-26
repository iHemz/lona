import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { OnboardingProvider, useOnboarding } from "@/hooks/use-onboarding";
import { ThemePreferenceProvider } from "@/hooks/use-theme-preference";

// Keep the splash up until we know whether to show onboarding, so there's no flash of the
// wrong screen. Safe to call before the app renders; it's a no-op on web.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  return (
    <ThemePreferenceProvider>
      <OnboardingProvider>
        <RootStack />
      </OnboardingProvider>
    </ThemePreferenceProvider>
  );
}

function RootStack() {
  const { isLoaded, hasOnboarded } = useOnboarding();

  useEffect(() => {
    if (isLoaded) SplashScreen.hide();
  }, [isLoaded]);

  if (!isLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={hasOnboarded}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="friend/[id]" options={{ presentation: "modal" }} />
        <Stack.Screen name="profile" options={{ presentation: "modal" }} />
        <Stack.Screen name="settings" options={{ presentation: "modal" }} />
      </Stack.Protected>
      <Stack.Protected guard={!hasOnboarded}>
        <Stack.Screen name="welcome" options={{ animation: "fade" }} />
      </Stack.Protected>
    </Stack>
  );
}
