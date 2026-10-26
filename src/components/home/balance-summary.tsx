import { StyleSheet, Text, View } from "react-native";

import { LargeMoney } from "@/components/ui/large-money";
import { FontSize, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { formatMoney, type Money } from "@/lib/money";

type BalanceSummaryProps = {
  owedToYou: Money;
  youOwe: Money;
};

export function BalanceSummary({ owedToYou, youOwe }: BalanceSummaryProps) {
  const colors = useThemeColors();
  const youOweLabel = formatMoney(youOwe);
  const hasDebt = youOwe.amountMinor > 0;

  return (
    <View
      accessible
      accessibilityLabel={`Owed to you ${formatMoney(owedToYou)}. You owe ${youOweLabel}.`}
      style={styles.container}
    >
      <Text style={[styles.label, { color: colors.textSecondary }]}>Owed to you</Text>
      <LargeMoney money={owedToYou} />
      <View style={styles.youOweRow}>
        <Text style={[styles.youOweLabel, { color: colors.textSecondary }]}>You owe</Text>
        <Text style={[styles.youOweAmount, { color: hasDebt ? colors.danger : colors.text }]}>
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
