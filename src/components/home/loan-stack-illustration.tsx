import { StyleSheet, View } from "react-native";

import { DashedIconBadge } from "@/components/ui/dashed-icon-badge";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type Side = "left" | "right";

function LoanCardSketch({ side }: { side: Side }) {
  const colors = useThemeColors();
  const dotColor = side === "left" ? colors.illustrationDotWarm : colors.illustrationDotCool;

  return (
    <View
      style={[
        styles.card,
        side === "left" ? styles.cardLeft : styles.cardRight,
        { backgroundColor: colors.illustrationPaper, borderColor: colors.illustrationLine },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <View style={styles.lines}>
        <View style={[styles.line, { backgroundColor: colors.illustrationLine }]} />
        <View
          style={[styles.line, styles.shortLine, { backgroundColor: colors.illustrationLine }]}
        />
      </View>
    </View>
  );
}

// Decorative: the empty state's title and body carry the meaning.
export function LoanStackIllustration() {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.container}
    >
      <LoanCardSketch side="left" />
      <LoanCardSketch side="right" />
      <DashedIconBadge icon={{ ios: "square.stack.3d.up", android: "stacks", web: "stacks" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 84,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    position: "absolute",
    top: 14,
    width: 92,
    height: 56,
    borderRadius: Radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    padding: Spacing.sm,
    opacity: 0.8,
  },
  cardLeft: {
    left: 0,
    transform: [{ rotate: "-6deg" }],
  },
  cardRight: {
    right: 0,
    flexDirection: "row-reverse",
    transform: [{ rotate: "6deg" }],
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  lines: {
    flex: 1,
    gap: Spacing.sm,
    paddingTop: 2,
  },
  line: {
    height: 4,
    borderRadius: 2,
  },
  shortLine: {
    width: "60%",
  },
});
