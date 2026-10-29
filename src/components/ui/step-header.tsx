import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { IconButton } from "@/components/ui/icon-button";
import { FontSize, Spacing, TouchTarget } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

// Shared by multi-step flows (setup, offer to lend): a back bar above the scroll area, and a
// "Step N of M · Task" heading at the top of it.

type StepNavBarProps = {
  /** Centred screen title, e.g. "Offer loan". */
  title?: string;
  /** Shows the "•••" button on the right. */
  showMore?: boolean;
};

export function StepNavBar({ title, showMore = true }: StepNavBarProps) {
  const colors = useThemeColors();
  const router = useRouter();

  return (
    <View style={styles.navBar}>
      <IconButton
        icon={{ ios: "chevron.left", android: "chevron_left", web: "chevron_left" }}
        accessibilityLabel="Back"
        onPress={() => router.back()}
      />
      {title && (
        <Text
          accessibilityRole="header"
          numberOfLines={1}
          style={[styles.title, { color: colors.text }]}
        >
          {title}
        </Text>
      )}
      {showMore ? (
        <IconButton
          icon={{ ios: "ellipsis", android: "more_horiz", web: "more_horiz" }}
          accessibilityLabel="More options"
        />
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

type StepHeadingProps = {
  step: number;
  stepCount: number;
  task: string;
  title: string;
  subtitle?: string;
};

export function StepHeading({ step, stepCount, task, title, subtitle }: StepHeadingProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.heading}>
      <Text style={[styles.step, { color: colors.textSecondary }]}>
        Step {step} of {stepCount} · {task}
      </Text>
      <Text accessibilityRole="header" style={[styles.headingTitle, { color: colors.text }]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  title: {
    flex: 1,
    fontSize: FontSize.body,
    fontWeight: "600",
    textAlign: "center",
  },
  placeholder: {
    width: TouchTarget,
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
  headingTitle: {
    fontSize: FontSize.title,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: FontSize.subhead,
  },
});
