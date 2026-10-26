import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet } from "react-native";

import { TouchTarget } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type IconButtonProps = {
  icon: SymbolViewProps["name"];
  accessibilityLabel: string;
  onPress?: () => void;
  size?: number;
};

export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  size = TouchTarget,
}: IconButtonProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.surface,
          borderColor: colors.surfaceBorder,
        },
        pressed && styles.pressed,
      ]}
    >
      <SymbolView name={icon} size={size * 0.45} tintColor={colors.text} />
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
