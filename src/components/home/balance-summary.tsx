import { StyleSheet, Text, View } from "react-native";

import { FontSize, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { formatMoney, splitFormattedMoney, type Money } from "@/lib/money";

type BalanceSummaryProps = {
  owedToYou: Money;
  youOwe: Money;
};

export function BalanceSummary({ owedToYou, youOwe }: BalanceSummaryProps) {
  const colors = useThemeColors();
  const { whole, fraction } = splitFormattedMoney(owedToYou);
  const youOweLabel = formatMoney(youOwe);
  const hasDebt = youOwe.amountMinor > 0;

  return (
    <View
      accessible
      accessibilityLabel={`Owed to you ${formatMoney(owedToYou)}. You owe ${youOweLabel}.`}
      style={styles.container}
    >
      <Text style={[styles.label, { color: colors.textSecondary }]}>Owed to you</Text>
      <Text style={[styles.balance, { color: colors.text }]} maxFontSizeMultiplier={1.6}>
        {whole}
        <Text style={[styles.fraction, { color: colors.textTertiary }]}>{fraction}</Text>
      </Text>
      <View style={styles.youOweRow}>
        <Text style={[styles.youOweLabel, { color: colors.textSecondary }]}>You owe</Text>
        <Text
          style={[styles.youOweAmount, { color: hasDebt ? colors.danger : colors.textSecondary }]}
        >
          {youOweLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: FontSize.body,
  },
  balance: {
    fontSize: FontSize.balance,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    letterSpacing: -0.5,
  },
  fraction: {
    fontSize: FontSize.balanceFraction,
    fontWeight: "600",
  },
  youOweRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    gap: Spacing.sm,
  },
  youOweLabel: {
    fontSize: FontSize.subhead,
  },
  youOweAmount: {
    fontSize: FontSize.body,
    fontWeight: "600",
  },
});
