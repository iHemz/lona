import { StyleSheet, Text, View } from "react-native";

import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { CARD_BRAND_LABELS } from "@/lib/card";
import type { LinkedCard } from "@/lib/mock-payments";

const CHIP_WIDTH = 28;

type PaymentCardProps = {
  card: LinkedCard;
  holderName: string;
};

/** The selected debit card, drawn like the physical card. Decorative: the list below names it. */
export function PaymentCard({ card, holderName }: PaymentCardProps) {
  const colors = useThemeColors();

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.card, { backgroundColor: colors.paymentCard }]}
    >
      <View style={styles.top}>
        <Text style={[styles.small, { color: colors.onPaymentCardSecondary }]}>
          Personal · {CARD_BRAND_LABELS[card.brand]}
        </Text>
        <View style={[styles.chip, { backgroundColor: colors.paymentCardChip }]} />
      </View>
      <Text style={[styles.number, { color: colors.onPaymentCard }]}>
        •••• •••• •••• {card.last4}
      </Text>
      <View style={styles.bottom}>
        <Text
          numberOfLines={1}
          style={[styles.small, styles.holder, { color: colors.onPaymentCard }]}
        >
          {holderName.toUpperCase()}
        </Text>
        <Text style={[styles.small, { color: colors.onPaymentCardSecondary }]}>{card.expiry}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chip: {
    width: CHIP_WIDTH,
    height: CHIP_WIDTH * 0.72,
    borderRadius: 4,
  },
  number: {
    fontSize: FontSize.heading,
    fontWeight: "700",
    letterSpacing: 1,
    fontVariant: ["tabular-nums"],
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  small: {
    fontSize: FontSize.caption,
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
  },
  holder: {
    flex: 1,
    letterSpacing: 0.6,
  },
});
