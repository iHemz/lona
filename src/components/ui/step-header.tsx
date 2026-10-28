import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { IconButton } from "@/components/ui/icon-button";
import { FontSize, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

// Shared by multi-step flows (setup, offer to lend): a back/more bar above the scroll area,
// and a "Step N of M · Task" heading at the top of it.

export function StepNavBar() {
  const router = useRouter();

  return (
    <View style={styles.navBar}>
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
  );
}

type StepHeadingProps = {
  step: number;
  stepCount: number;
  task: string;
  title: string;
  subtitle: string;
};

export function StepHeading({ step, stepCount, task, title, subtitle }: StepHeadingProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.heading}>
      <Text style={[styles.step, { color: colors.textSecondary }]}>
        Step {step} of {stepCount} · {task}
      </Text>
      <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
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
});
