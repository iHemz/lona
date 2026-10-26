import { StyleSheet, Text, View } from "react-native";

import { LargeMoney } from "@/components/ui/large-money";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { formatMoney, type Money } from "@/lib/money";

type LoansSummaryCardProps = {
  label: string;
  total: Money;
};

export function LoansSummaryCard({ label, total }: LoansSummaryCardProps) {
  const colors = useThemeColors();

  return (
    <View
      accessible
      accessibilityLabel={`${label} ${formatMoney(total)}`}
      style={[
        styles.card,
        { backgroundColor: colors.summarySurface, borderColor: colors.summaryBorder },
      ]}
    >
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <LargeMoney money={total} style={styles.amount} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  label: {
    fontSize: FontSize.footnote,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    textAlign: "center",
  },
  amount: {
    textAlign: "center",
  },
});
