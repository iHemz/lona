import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FontSize, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type OnboardingStepProps = {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
  /** Pinned to the bottom and kept above the keyboard, e.g. the step's main button. */
  footer: ReactNode;
};

/** Layout for a form step in onboarding: big title, subtitle, content, bottom action. */
export function OnboardingStep({ title, subtitle, children, footer }: OnboardingStepProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* The previous step (sign-up) is dark; restore the status bar for this light screen. */}
      <StatusBar style="auto" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.xxxl * 2 }]}
      >
        <View style={styles.heading}>
          <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        </View>
        {children}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>{footer}</View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xxl,
  },
  heading: {
    gap: Spacing.md,
  },
  title: {
    fontSize: FontSize.display,
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: 46,
  },
  subtitle: {
    fontSize: FontSize.body,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
});
