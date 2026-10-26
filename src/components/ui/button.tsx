import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";

import { FontSize, Radius, Spacing, TouchTarget } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type ButtonVariant = "primary" | "inverse";
type ButtonSize = "large" | "compact";

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  /** `primary` for the main call to action; `inverse` for high-contrast secondary actions. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: SymbolViewProps["name"];
  style?: StyleProp<ViewStyle>;
};

export const BUTTON_HEIGHT: Record<ButtonSize, number> = { large: 56, compact: 48 };

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "large",
  icon,
  style,
}: ButtonProps) {
  const colors = useThemeColors();
  const background = variant === "primary" ? colors.primary : colors.inverse;
  const foreground = variant === "primary" ? colors.onPrimary : colors.onInverse;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        size === "large" ? styles.large : styles.compact,
        { backgroundColor: background },
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon && <SymbolView name={icon} size={18} tintColor={foreground} />}
      <Text
        style={[styles.label, size === "compact" && styles.compactLabel, { color: foreground }]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  large: {
    minHeight: BUTTON_HEIGHT.large,
    paddingHorizontal: Spacing.xxl,
  },
  compact: {
    minHeight: Math.max(BUTTON_HEIGHT.compact, TouchTarget),
    paddingHorizontal: Spacing.xl,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: FontSize.body,
    fontWeight: "600",
    textAlign: "center",
  },
  compactLabel: {
    fontSize: FontSize.subhead,
  },
});
