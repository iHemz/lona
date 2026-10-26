import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FeaturedCardSurface } from "@/components/home/featured-card-surface";
import { InstalmentProgress } from "@/components/home/instalment-progress";
import { FontSize, Radius, Spacing, TouchTarget } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { formatWeekdayDate } from "@/lib/dates";
import { isInstalmentPlan, nextPayment, type Friend, type Loan } from "@/lib/loans";
import { formatMoney } from "@/lib/money";
import { shortName } from "@/lib/names";

type FeaturedLoanCardProps = {
  loan: Loan;
  friend: Friend;
  isOverdue: boolean;
  onOpenPaymentPlan?: () => void;
};

function repaymentSummary(loan: Loan): string {
  const money = (amountMinor: number) =>
    formatMoney({ amountMinor, currency: loan.currency }, { trimWholeAmounts: true });
  const repaid = loan.repaidMinor > 0 ? `${money(loan.repaidMinor)} repaid` : "Nothing repaid yet";
  const next = nextPayment(loan);
  if (!next) return repaid;
  return `${repaid} · next ${money(next.amount.amountMinor)} due ${formatWeekdayDate(next.dueDate)}`;
}

export function FeaturedLoanCard({
  loan,
  friend,
  isOverdue,
  onOpenPaymentPlan,
}: FeaturedLoanCardProps) {
  const colors = useThemeColors();
  const principal = formatMoney(
    { amountMinor: loan.principalMinor, currency: loan.currency },
    { trimWholeAmounts: true },
  );
  const planLabel = isInstalmentPlan(loan) ? "Instalments" : "Single payment";
  const status = isOverdue
    ? { label: "Late", color: colors.danger, background: colors.dangerSurface }
    : { label: "Active", color: colors.success, background: colors.successSurface };

  return (
    <FeaturedCardSurface>
      <View style={styles.headerRow}>
        <Text style={[styles.eyebrow, { color: colors.textSecondary }]}>Featured loan</Text>
        <View
          accessible
          accessibilityLabel={`Status: ${status.label}`}
          style={[styles.statusPill, { backgroundColor: status.background }]}
        >
          <View style={[styles.statusDot, { backgroundColor: status.color }]} />
          <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.summary}>
        <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
          {principal}
          <Text style={{ color: colors.textTertiary }}> loan to </Text>
          {shortName(friend.name)}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {repaymentSummary(loan)}
        </Text>
      </View>

      <InstalmentProgress loan={loan} />

      <View style={[styles.divider, { backgroundColor: colors.featuredBorder }]} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Payment plan: ${planLabel}`}
        onPress={onOpenPaymentPlan}
        style={({ pressed }) => [styles.planRow, pressed && styles.pressed]}
      >
        <View style={styles.planText}>
          <Text style={[styles.eyebrow, { color: colors.textSecondary }]}>Payment plan</Text>
          <Text style={[styles.planValue, { color: colors.text }]}>{planLabel}</Text>
        </View>
        <SymbolView
          name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
          size={18}
          tintColor={colors.textSecondary}
        />
      </Pressable>
    </FeaturedCardSurface>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  eyebrow: {
    fontSize: FontSize.footnote,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabel: {
    fontSize: FontSize.footnote,
    fontWeight: "600",
  },
  summary: {
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: FontSize.subhead,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  planRow: {
    minHeight: TouchTarget,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  planText: {
    flex: 1,
    gap: Spacing.xs,
  },
  planValue: {
    fontSize: FontSize.body,
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.6,
  },
});
