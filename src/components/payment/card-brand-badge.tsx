import { StyleSheet, Text, View } from "react-native";

import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { CARD_BRAND_LABELS, type CardBrand } from "@/lib/card";

/** Small dark tag with the card network, e.g. "VISA". */
export function CardBrandBadge({ brand }: { brand: CardBrand }) {
  const colors = useThemeColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.inverse }]}>
      <Text style={[styles.label, { color: colors.onInverse }]}>{CARD_BRAND_LABELS[brand]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 40,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm / 2,
    alignItems: "center",
  },
  label: {
    fontSize: FontSize.caption - 2,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
});
