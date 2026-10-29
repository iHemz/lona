import { StyleSheet, Text, View } from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { formatFullDate, type IsoDate } from "@/lib/dates";
import {
  formatPaymentPlan,
  isOnLona,
  recipientDetail,
  recipientColorKey,
  recipientName,
  type LoanOfferTerms,
  type Recipient,
} from "@/lib/lend";
import { formatMoney } from "@/lib/money";

type LoanOfferSummaryProps = {
  recipient: Recipient;
  today: IsoDate;
  /** Adds the amount, plan and due date under the recipient. */
  terms?: LoanOfferTerms;
};

/** Who the offer is for and, once agreed, its terms, in one card. */
export function LoanOfferSummary({ recipient, today, terms }: LoanOfferSummaryProps) {
  const colors = useThemeColors();
  const name = recipientName(recipient);
  const detail = recipientDetail(recipient, today);
  const onLona = isOnLona(recipient);

  const rows = terms
    ? [
        { label: "Amount", value: formatMoney(terms.amount) },
        { label: "Payment plan", value: formatPaymentPlan(terms) },
        { label: "Due date", value: formatFullDate(terms.dueDate) },
      ]
    : [];

  return (
    <View
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
    >
      <View
        accessible
        accessibilityLabel={[name, detail, !onLona && "not on Lona yet"].filter(Boolean).join(", ")}
        style={styles.recipient}
      >
        <Avatar name={name} colorKey={recipientColorKey(recipient)} />
        <View style={styles.recipientText}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={[styles.detail, { color: colors.textSecondary }]}>{detail}</Text>
        </View>
        {!onLona && (
          <View style={[styles.badge, { backgroundColor: colors.warningSurface }]}>
            <View style={[styles.dot, { backgroundColor: colors.warning }]} />
            <Text style={[styles.badgeLabel, { color: colors.warning }]}>Not on Lona</Text>
          </View>
        )}
      </View>
      {rows.map((row) => (
        <View
          key={row.label}
          accessible
          accessibilityLabel={`${row.label}, ${row.value}`}
          style={[styles.row, { borderTopColor: colors.separator }]}
        >
          <Text style={[styles.label, { color: colors.textSecondary }]}>{row.label}</Text>
          <Text style={[styles.value, { color: colors.text }]}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.lg,
  },
  recipient: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  recipientText: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: FontSize.body,
    fontWeight: "600",
  },
  detail: {
    fontSize: FontSize.footnote,
    fontVariant: ["tabular-nums"],
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs + 2,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeLabel: {
    fontSize: FontSize.caption,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: FontSize.subhead,
  },
  value: {
    flexShrink: 1,
    fontSize: FontSize.body,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
    textAlign: "right",
  },
});
