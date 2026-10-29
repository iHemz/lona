import type { ComponentProps, ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StepHeading, StepNavBar } from "@/components/ui/step-header";
import { Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type StepLayoutProps = {
  heading: ComponentProps<typeof StepHeading>;
  navBar?: ComponentProps<typeof StepNavBar>;
  children: ReactNode;
  /** Pinned to the bottom and kept above the keyboard, e.g. the step's main button. */
  footer?: ReactNode;
};

/** A step in a flow: back bar, "Step N of M · Task" heading, scrolling body, pinned action. */
export function StepLayout({ heading, navBar, children, footer }: StepLayoutProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + Spacing.sm,
          paddingBottom: insets.bottom + Spacing.md,
        },
      ]}
    >
      <StepNavBar {...navBar} />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={styles.content}
      >
        <StepHeading {...heading} />
        {children}
      </ScrollView>

      {footer && <View style={styles.footer}>{footer}</View>}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
});
