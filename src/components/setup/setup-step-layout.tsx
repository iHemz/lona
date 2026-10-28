import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StepHeading, StepNavBar } from "@/components/ui/step-header";
import { Spacing } from "@/constants/theme";
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
  const taskTitle = SETUP_TASKS.find((candidate) => candidate.id === task)?.title ?? "";

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
      <StepNavBar />

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <StepHeading
          step={setupStepNumber(task)}
          stepCount={SETUP_TASKS.length}
          task={taskTitle}
          title={title}
          subtitle={subtitle}
        />
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
