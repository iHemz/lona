import { SymbolView, type SymbolViewProps } from "expo-symbols";
import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { FontSize, Radius, Spacing, TouchTarget, type ThemeColors } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type ButtonVariant = "primary" | "inverse" | "outline";
type ButtonSize = "large" | "compact";

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  /**
   * `primary` for the main call to action, `inverse` for high-contrast secondary actions,
   * `outline` for equal-weight alternatives (e.g. other sign-in options).
   */
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: SymbolViewProps["name"];
  /** A custom leading element (e.g. a brand logo) when a symbol won't do; replaces `icon`. */
  leading?: ReactNode;
  disabled?: boolean;
  /** Shows a spinner in place of the icon and blocks presses, e.g. while a request runs. */
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const BUTTON_HEIGHT: Record<ButtonSize, number> = { large: 56, compact: 48 };

function variantColors(variant: ButtonVariant, colors: ThemeColors) {
  switch (variant) {
    case "primary":
      return { background: colors.primary, foreground: colors.onPrimary, border: colors.primary };
    case "inverse":
      return { background: colors.inverse, foreground: colors.onInverse, border: colors.inverse };
    case "outline":
      return { background: "transparent", foreground: colors.text, border: colors.outlineBorder };
  }
}

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "large",
  icon,
  leading,
  disabled = false,
  isLoading = false,
  style,
}: ButtonProps) {
  const colors = useThemeColors();
  const { background, foreground, border } = variantColors(variant, colors);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || isLoading, busy: isLoading }}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={({ pressed }) => [
        styles.button,
        size === "large" ? styles.large : styles.compact,
        { backgroundColor: background, borderColor: border },
        pressed && styles.pressed,
        disabled && !isLoading && styles.disabled,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={foreground} />
      ) : (
        (leading ?? (icon && <SymbolView name={icon} size={18} tintColor={foreground} />))
      )}
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
    borderWidth: 1,
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
  disabled: {
    opacity: 0.4,
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
