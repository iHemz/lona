import { SymbolView } from "expo-symbols";
import { StyleSheet, Text, View } from "react-native";

import { LOAN_ICON_SIZE } from "@/components/friend/active-loan-row";
import { FontSize, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { formatShortDate } from "@/lib/dates";
import type { SettledLoanItem } from "@/lib/friend-profile";
import { formatMoney } from "@/lib/money";

export function SettledLoanRow({ item }: { item: SettledLoanItem }) {
  const colors = useThemeColors();
  const { loan, settledOn, detail } = item;
  const title = loan.direction === "lent" ? "You lent" : "You borrowed";
  const amount = formatMoney(
    { amountMinor: loan.principalMinor, currency: loan.currency },
    { trimWholeAmounts: true },
  );
  const settled = settledOn ? `Settled ${formatShortDate(settledOn)}` : "Settled";

  return (
    <View
      accessible
      accessibilityLabel={`${title} ${amount}, ${settled.toLowerCase()}, ${detail}`}
      style={styles.row}
    >
      <View style={[styles.icon, { backgroundColor: colors.successSurface }]}>
        <SymbolView
          name={{ ios: "checkmark.circle", android: "done_all", web: "done_all" }}
          size={18}
          tintColor={colors.success}
        />
      </View>
      <View style={styles.details}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {settled} • {detail}
        </Text>
      </View>
      <Text style={[styles.amount, { color: colors.textTertiary }]}>{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
  },
  icon: {
    width: LOAN_ICON_SIZE,
    height: LOAN_ICON_SIZE,
    borderRadius: LOAN_ICON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  details: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: FontSize.body,
    fontWeight: "600",
  },
  meta: {
    fontSize: FontSize.footnote,
  },
  amount: {
    fontSize: FontSize.body,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
    textDecorationLine: "line-through",
  },
});
