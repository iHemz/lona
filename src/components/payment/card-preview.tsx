import { StyleSheet, Text, View } from "react-native";

import { CardBrandBadge } from "@/components/payment/card-brand-badge";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { cvcLength, detectCardBrand, formatCardNumber } from "@/lib/card";

type CardPreviewProps = {
  number: string;
  expiry: string;
  cvc: string;
};

/** Live preview of the card being entered. Decorative: the inputs below are the source of truth. */
export function CardPreview({ number, expiry, cvc }: CardPreviewProps) {
  const colors = useThemeColors();
  const brand = detectCardBrand(number);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.card,
        { backgroundColor: colors.featuredSurface, borderColor: colors.featuredBorder },
      ]}
    >
      <View style={styles.numberRow}>
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Card number</Text>
          <Text style={[styles.number, { color: colors.text }]}>
            {number ? formatCardNumber(number) : "•••• •••• •••• ••••"}
          </Text>
        </View>
        {brand !== "unknown" && <CardBrandBadge brand={brand} />}
      </View>
      <View style={[styles.divider, { backgroundColor: colors.featuredBorder }]} />
      <View style={styles.bottomRow}>
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Expires</Text>
          <Text style={[styles.value, { color: colors.text }]}>{expiry || "MM/YY"}</Text>
        </View>
        <View style={[styles.verticalDivider, { backgroundColor: colors.featuredBorder }]} />
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>CVC</Text>
          {/* Never shown in the preview, only how many digits are entered. */}
          <Text style={[styles.value, { color: colors.textTertiary }]}>
            {"•".repeat(cvc.length || cvcLength(brand))}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  numberRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  field: {
    flex: 1,
    gap: Spacing.xs,
  },
  label: {
    fontSize: FontSize.footnote,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  number: {
    fontSize: FontSize.heading,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  value: {
    fontSize: FontSize.body,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  divider: {
    height: 1,
  },
  bottomRow: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  verticalDivider: {
    width: 1,
  },
});
