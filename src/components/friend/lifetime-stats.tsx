import { Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";

import { FontSize, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import type { LifetimeTotals } from "@/lib/friend-profile";
import { formatMoney } from "@/lib/money";

export function LifetimeStats({ totals }: { totals: LifetimeTotals }) {
  const colors = useThemeColors();
  const stats = [
    { label: "Lent", value: formatMoney(totals.lent, { trimWholeAmounts: true }) },
    { label: "Borrowed", value: formatMoney(totals.borrowed, { trimWholeAmounts: true }) },
    { label: "Settled", value: String(totals.settledCount) },
  ];

  return (
    <View style={styles.row}>
      {stats.map(({ label, value }, index) => (
        <Fragment key={label}>
          {index > 0 && <View style={[styles.divider, { backgroundColor: colors.separator }]} />}
          <View accessible accessibilityLabel={`${label} ${value}`} style={styles.stat}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
            <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
          </View>
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  stat: {
    flex: 1,
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: FontSize.footnote,
  },
  value: {
    fontSize: FontSize.body,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
});
