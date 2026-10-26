import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";

import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({ label, onPress, style }: PrimaryButtonProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.primary },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.label, { color: colors.onPrimary }]}>{label}</Text>
    </Pressable>
  );
}

export const PRIMARY_BUTTON_HEIGHT = 56;

const styles = StyleSheet.create({
  button: {
    minHeight: PRIMARY_BUTTON_HEIGHT,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: FontSize.body,
    fontWeight: "600",
    textAlign: "center",
  },
});
