import { SymbolView, type SymbolViewProps } from "expo-symbols";
import type { ComponentRef, Ref } from "react";
import { Pressable, StyleSheet, type ColorValue, type View } from "react-native";

import { TouchTarget } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type IconButtonProps = {
  icon: SymbolViewProps["name"];
  accessibilityLabel: string;
  onPress?: () => void;
  size?: number;
  /** Icon colour; defaults to the primary text colour (or white on `primary`). */
  tintColor?: ColorValue;
  /** `surface` is the outlined default; `primary` is a filled call to action. */
  variant?: "surface" | "primary";
  ref?: Ref<ComponentRef<typeof View>>;
};

export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  size = TouchTarget,
  tintColor,
  variant = "surface",
  ref,
}: IconButtonProps) {
  const colors = useThemeColors();
  const isPrimary = variant === "primary";

  return (
    <Pressable
      ref={ref}
      collapsable={false}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isPrimary ? colors.primary : colors.surface,
          borderColor: isPrimary ? colors.primary : colors.surfaceBorder,
        },
        pressed && styles.pressed,
      ]}
    >
      <SymbolView
        name={icon}
        size={size * 0.45}
        tintColor={tintColor ?? (isPrimary ? colors.onPrimary : colors.text)}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.6,
  },
});
