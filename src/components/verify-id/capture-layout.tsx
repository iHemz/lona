import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ModalCloseButton } from "@/components/ui/modal-close-button";
import { FontSize, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { ColorSchemeOverride } from "@/hooks/use-theme-preference";

type CaptureLayoutProps = {
  /** e.g. "Step 2 of 4 · document" */
  stepLabel: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

/**
 * Wraps a capture route so the whole screen, including anything the route renders itself
 * (frames, buttons), resolves to the dark palette.
 */
export function DarkCaptureScreen({ children }: { children: ReactNode }) {
  return (
    <ColorSchemeOverride scheme="dark">
      <StatusBar style="light" />
      {children}
    </ColorSchemeOverride>
  );
}

/** Camera screen layout for the document photo and the selfie. Use inside `DarkCaptureScreen`. */
export function CaptureLayout({
  stepLabel,
  title,
  subtitle,
  children,
  footer,
}: CaptureLayoutProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + Spacing.sm,
          paddingBottom: insets.bottom + Spacing.lg,
        },
      ]}
    >
      <View style={styles.header}>
        <ModalCloseButton />
        <Text style={[styles.step, { color: colors.textSecondary }]}>{stepLabel}</Text>
        {/* Balances the close button so the step label stays centred. */}
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.heading}>
        <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
      <View style={styles.body}>{children}</View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerSpacer: {
    width: 44,
  },
  step: {
    fontSize: FontSize.subhead,
    fontWeight: "600",
  },
  heading: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    fontSize: FontSize.footnote,
    textAlign: "center",
  },
  body: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.xl,
  },
  footer: {
    alignItems: "center",
    gap: Spacing.sm,
  },
});
