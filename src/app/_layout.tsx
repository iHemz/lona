import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { HomeTourProvider } from "@/hooks/use-home-tour";
import { OnboardingProvider, useOnboarding } from "@/hooks/use-onboarding";
import { PaymentMethodsProvider, usePaymentMethods } from "@/hooks/use-payment-methods";
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
          <PaymentMethodsProvider>
            <HomeTourProvider>
              <RootStack />
            </HomeTourProvider>
          </PaymentMethodsProvider>
        </SetupProvider>
      </OnboardingProvider>
    </ThemePreferenceProvider>
  );
}

function RootStack() {
  const onboarding = useOnboarding();
  const setup = useSetup();
  const paymentMethods = usePaymentMethods();
  const isLoaded = onboarding.isLoaded && setup.isLoaded && paymentMethods.isLoaded;
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
        <Stack.Screen name="link-payment" />
        <Stack.Screen
          name="reminders"
          options={{ presentation: "transparentModal", animation: "fade" }}
        />
        <Stack.Screen
          name="setup-complete"
          options={{ animation: "fade", gestureEnabled: false }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!hasOnboarded}>
        <Stack.Screen name="welcome" options={{ animation: "fade" }} />
      </Stack.Protected>
    </Stack>
  );
}
