import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

const ICON_SIZE = 40;

type OptionRowProps = {
  title: string;
  description: string;
  icon: SymbolViewProps["name"];
  onPress?: () => void;
  disabled?: boolean;
};

/** A tappable card with a round icon, title, one line of description and a chevron. */
export function OptionRow({ title, description, icon, onPress, disabled = false }: OptionRowProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${description}`}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        { backgroundColor: colors.surface },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={[styles.icon, { backgroundColor: colors.linkSurface }]}>
        <SymbolView name={icon} size={18} tintColor={colors.link} />
      </View>
      <View style={styles.text}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>
      </View>
      <SymbolView
        name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
        size={14}
        tintColor={colors.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: FontSize.body,
    fontWeight: "700",
  },
  description: {
    fontSize: FontSize.subhead,
  },
});
