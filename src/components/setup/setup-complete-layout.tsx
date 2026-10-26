import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SuccessHeader } from "@/components/setup/success-header";
import { Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type SetupCompleteLayoutProps = {
  title: string;
  subtitle: string;
  /** Scrollable content under the header, e.g. what was linked and the checklist. */
  children: ReactNode;
  /** Pinned at the bottom, e.g. the next step and "Later". */
  actions: ReactNode;
};

/** The screen at the end of a setup step: success header, summary, next actions. */
export function SetupCompleteLayout({
  title,
  subtitle,
  children,
  actions,
}: SetupCompleteLayoutProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + Spacing.xxxl,
          paddingBottom: insets.bottom + Spacing.md,
        },
      ]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <SuccessHeader title={title} subtitle={subtitle} />
        {children}
      </ScrollView>
      <View style={styles.actions}>{actions}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xxl,
  },
  actions: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
});
