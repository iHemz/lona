import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { OnboardingProvider, useOnboarding } from "@/hooks/use-onboarding";
import { SetupProvider, useSetup } from "@/hooks/use-setup";
import { ThemePreferenceProvider } from "@/hooks/use-theme-preference";

// Keep the splash up until we know whether to show onboarding, so there's no flash of the
// wrong screen. Safe to call before the app renders; it's a no-op on web.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  return (
    <ThemePreferenceProvider>
      <OnboardingProvider>
        <SetupProvider>
          <RootStack />
        </SetupProvider>
      </OnboardingProvider>
    </ThemePreferenceProvider>
  );
}

function RootStack() {
  const onboarding = useOnboarding();
  const setup = useSetup();
  const isLoaded = onboarding.isLoaded && setup.isLoaded;
  const { hasOnboarded } = onboarding;

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
        <Stack.Screen name="verify-id" />
      </Stack.Protected>
      <Stack.Protected guard={!hasOnboarded}>
        <Stack.Screen name="welcome" options={{ animation: "fade" }} />
      </Stack.Protected>
    </Stack>
  );
}
