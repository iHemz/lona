import { Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";

import { BankLogo } from "@/components/payment/bank-logo";
import { CardBrandBadge } from "@/components/payment/card-brand-badge";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { maskedNumber } from "@/lib/account";
import { findBank } from "@/lib/banks";
import type { LinkedBank, LinkedCard } from "@/lib/mock-payments";

type LinkedMethodsProps = {
  card: LinkedCard | null;
  bank: LinkedBank | null;
};

/** What's linked and what each is used for: card to send, bank for repayments. */
export function LinkedMethods({ card, bank }: LinkedMethodsProps) {
  const colors = useThemeColors();
  const bankInfo = findBank(bank?.bankId);

  const rows = [
    card && {
      key: "card",
      leading: <CardBrandBadge brand={card.brand} />,
      title: maskedNumber(card.last4),
      detail: "For sending money",
      isDefault: true,
    },
    bank && {
      key: "bank",
      leading: bankInfo ? <BankLogo bank={bankInfo} size={36} /> : null,
      title: `${bank.name} ${maskedNumber(bank.last4)}`,
      detail: "For automatic repayments",
      isDefault: false,
    },
  ].filter((row) => row !== null);

  if (rows.length === 0) return null;

  return (
    <View
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
    >
      {rows.map((row, index) => (
        <Fragment key={row.key}>
          {index > 0 && <View style={[styles.separator, { backgroundColor: colors.separator }]} />}
          <View
            accessible
            accessibilityLabel={`${row.title}, ${row.detail}${row.isDefault ? ", default" : ""}`}
            style={styles.row}
          >
            <View style={styles.leading}>{row.leading}</View>
            <View style={styles.text}>
              <Text style={[styles.title, { color: colors.text }]}>{row.title}</Text>
              <Text style={[styles.detail, { color: colors.textSecondary }]}>{row.detail}</Text>
            </View>
            {row.isDefault && (
              <View style={[styles.default, { backgroundColor: colors.successSurface }]}>
                <View style={[styles.dot, { backgroundColor: colors.success }]} />
                <Text style={[styles.defaultLabel, { color: colors.success }]}>Default</Text>
              </View>
            )}
          </View>
        </Fragment>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  leading: {
    width: 44,
    alignItems: "center",
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: FontSize.body,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  detail: {
    fontSize: FontSize.footnote,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  default: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  defaultLabel: {
    fontSize: FontSize.footnote,
    fontWeight: "600",
  },
});
