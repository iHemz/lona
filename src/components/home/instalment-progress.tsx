import { StyleSheet, Text, View } from "react-native";

import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { scheduleProgress, type Loan } from "@/lib/loans";
import { formatMoney } from "@/lib/money";

/** Beyond this many instalments, only the start and end amounts are labelled. */
const MAX_LABELLED_SEGMENTS = 4;

type InstalmentProgressProps = {
  loan: Loan;
};

export function InstalmentProgress({ loan }: InstalmentProgressProps) {
  const colors = useThemeColors();
  const segments = scheduleProgress(loan);
  const money = (amountMinor: number) =>
    formatMoney({ amountMinor, currency: loan.currency }, { trimWholeAmounts: true });

  const boundaries = [0, ...segments.map((segment) => segment.endMinor)];
  const tickAmounts =
    segments.length <= MAX_LABELLED_SEGMENTS
      ? boundaries
      : [boundaries[0], boundaries[boundaries.length - 1]];

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={`${money(Math.min(loan.repaidMinor, loan.principalMinor))} of ${money(loan.principalMinor)} repaid`}
      accessibilityValue={{
        min: 0,
        max: loan.principalMinor,
        now: Math.min(loan.repaidMinor, loan.principalMinor),
      }}
      style={styles.container}
    >
      <View
        style={[
          styles.track,
          { backgroundColor: colors.progressContainer, borderColor: colors.surfaceBorder },
        ]}
      >
        {segments.map((segment, index) => (
          <View key={index} style={[styles.segment, { backgroundColor: colors.progressTrack }]}>
            <View
              style={[
                styles.fill,
                { width: `${segment.fillRatio * 100}%`, backgroundColor: colors.successFill },
              ]}
            />
          </View>
        ))}
      </View>
      <View style={styles.ticks} importantForAccessibility="no-hide-descendants">
        {tickAmounts.map((amountMinor, index) => (
          <Text key={index} style={[styles.tick, { color: colors.textSecondary }]}>
            {money(amountMinor ?? 0)}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  track: {
    flexDirection: "row",
    gap: Spacing.xs,
    padding: Spacing.xs,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  segment: {
    flex: 1,
    height: 20,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: Radius.pill,
  },
  ticks: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tick: {
    fontSize: FontSize.footnote,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
});
