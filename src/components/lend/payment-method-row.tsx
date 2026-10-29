import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type PaymentMethodRowProps = {
  leading: ReactNode;
  title: string;
  detail: string;
  /** Outlined with a check when it's the method the loan is sent from. */
  isSelected?: boolean;
  onPress?: () => void;
};

/** A linked card or bank in its own card. */
export function PaymentMethodRow({
  leading,
  title,
  detail,
  isSelected = false,
  onPress,
}: PaymentMethodRowProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole={onPress ? "radio" : undefined}
      accessibilityState={onPress ? { checked: isSelected } : undefined}
      accessibilityLabel={`${title}, ${detail}`}
      disabled={!onPress}
      onPress={onPress}
      style={[
        styles.row,
        {
          backgroundColor: colors.surface,
          borderColor: isSelected ? colors.primary : colors.surfaceBorder,
          borderWidth: isSelected ? 1.5 : StyleSheet.hairlineWidth,
        },
      ]}
    >
      <View style={styles.leading}>{leading}</View>
      <View style={styles.text}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.detail, { color: colors.textSecondary }]}>{detail}</Text>
      </View>
      {isSelected && (
        <SymbolView
          name={{ ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }}
          size={22}
          tintColor={colors.primary}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
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
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  detail: {
    fontSize: FontSize.footnote,
  },
});
