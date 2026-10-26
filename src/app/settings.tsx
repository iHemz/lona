import Constants from "expo-constants";
import { useState } from "react";
import { Platform, ScrollView, StyleSheet, Switch, Text } from "react-native";

import { AccountProtectedBanner } from "@/components/settings/account-protected-banner";
import { LinkList } from "@/components/ui/link-list";
import { ModalCloseButton } from "@/components/ui/modal-close-button";
import { FontSize, Spacing } from "@/constants/theme";
import { useAppearancePicker } from "@/hooks/use-appearance-picker";
import { useAccount } from "@/hooks/use-ledger";
import { useOnboarding } from "@/hooks/use-onboarding";
import { usePaymentMethods } from "@/hooks/use-payment-methods";
import { useScreenTopPadding } from "@/hooks/use-screen-top-padding";
import { useSetup } from "@/hooks/use-setup";
import { useThemeColors } from "@/hooks/use-theme";
import { THEME_PREFERENCE_LABELS, useThemePreference } from "@/hooks/use-theme-preference";
import { maskedNumber } from "@/lib/account";

const BIOMETRIC_LABEL = Platform.OS === "ios" ? "Face ID to open" : "Unlock with biometrics";
const APP_VERSION = Constants.expoConfig?.version ?? "—";

export default function SettingsScreen() {
  const colors = useThemeColors();
  const topPadding = useScreenTopPadding();
  const { card } = useAccount();
  const { preference } = useThemePreference();
  const openAppearancePicker = useAppearancePicker();
  const { resetOnboarding } = useOnboarding();
  const setup = useSetup();
  const paymentMethods = usePaymentMethods();
  // TODO: wire to biometric auth and persist once those exist; local state for now.
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.content, { paddingTop: topPadding }]}
    >
      <ModalCloseButton />
      <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
        Settings
      </Text>

      <AccountProtectedBanner />

      <LinkList
        items={[
          {
            label: "Linked cards",
            icon: { ios: "creditcard", android: "credit_card", web: "credit_card" },
            value: card ? maskedNumber(card.last4) : "None",
          },
          {
            label: "Reminders & alerts",
            icon: { ios: "bell", android: "notifications", web: "notifications" },
          },
          {
            label: BIOMETRIC_LABEL,
            icon: { ios: "faceid", android: "fingerprint", web: "fingerprint" },
            accessory: (
              <Switch
                accessibilityLabel={BIOMETRIC_LABEL}
                value={biometricsEnabled}
                onValueChange={setBiometricsEnabled}
                trackColor={{ true: colors.successFill }}
                thumbColor={colors.switchThumb}
              />
            ),
          },
        ]}
      />

      <LinkList
        items={[
          {
            label: "Language",
            icon: { ios: "globe", android: "language", web: "language" },
            value: "English",
          },
          {
            label: "Appearance",
            icon: {
              ios: "circle.lefthalf.filled",
              android: "contrast",
              web: "contrast",
            },
            value: THEME_PREFERENCE_LABELS[preference],
            trailing: "menu",
            onPress: openAppearancePicker,
          },
        ]}
      />

      <LinkList
        items={[
          {
            label: "Privacy policy",
            icon: { ios: "lock", android: "lock", web: "lock" },
            trailing: "external",
          },
          {
            label: "Version",
            icon: { ios: "info.circle", android: "info", web: "info" },
            value: APP_VERSION,
            trailing: "none",
          },
        ]}
      />

      {__DEV__ && (
        <LinkList
          title="Developer"
          items={[
            {
              label: "Replay onboarding",
              icon: { ios: "arrow.counterclockwise", android: "replay", web: "replay" },
              trailing: "none",
              onPress: () => {
                setup.reset();
                paymentMethods.reset();
                resetOnboarding();
              },
            },
            {
              label: "Complete setup",
              icon: { ios: "checklist.checked", android: "checklist", web: "checklist" },
              trailing: "none",
              onPress: setup.completeAll,
            },
          ]}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },
  title: {
    fontSize: FontSize.largeTitle,
    fontWeight: "700",
    letterSpacing: -0.4,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
});
