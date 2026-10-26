import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconButton } from "@/components/ui/icon-button";
import { FontSize, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { SETUP_TASKS, setupStepNumber, type SetupTaskId } from "@/lib/setup";

type SetupStepLayoutProps = {
  task: SetupTaskId;
  title: string;
  subtitle: string;
  children: ReactNode;
  /** Pinned to the bottom and kept above the keyboard, e.g. the step's main button. */
  footer?: ReactNode;
};

/** Light setup step: back/more header, "Step N of 4 · Task", title, subtitle, body, action. */
export function SetupStepLayout({ task, title, subtitle, children, footer }: SetupStepLayoutProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const taskTitle = SETUP_TASKS.find((candidate) => candidate.id === task)?.title ?? "";
  const step = `Step ${setupStepNumber(task)} of ${SETUP_TASKS.length} · ${taskTitle}`;

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
      <View style={styles.header}>
        <IconButton
          icon={{ ios: "chevron.left", android: "chevron_left", web: "chevron_left" }}
          accessibilityLabel="Back"
          onPress={() => router.back()}
        />
        <IconButton
          icon={{ ios: "ellipsis", android: "more_horiz", web: "more_horiz" }}
          accessibilityLabel="More options"
        />
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <Text style={[styles.step, { color: colors.textSecondary }]}>{step}</Text>
          <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  heading: {
    gap: Spacing.sm,
  },
  step: {
    fontSize: FontSize.caption,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: FontSize.subhead,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
});
