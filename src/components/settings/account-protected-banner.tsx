import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text } from "react-native";

import { FontSize, Radius, Spacing, TouchTarget } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

export function AccountProtectedBanner({ onPress }: { onPress?: () => void }) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Your account is protected"
      onPress={onPress}
      style={({ pressed }) => [
        styles.banner,
        { backgroundColor: colors.inverse },
        pressed && styles.pressed,
      ]}
    >
      <SymbolView
        name={{ ios: "checkmark.shield.fill", android: "verified_user", web: "verified_user" }}
        size={18}
        tintColor={colors.successFill}
      />
      <Text style={[styles.label, { color: colors.onInverse }]}>Your account is protected</Text>
      <SymbolView
        name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
        size={14}
        tintColor={colors.onInverse}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    minHeight: TouchTarget + Spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.pill,
  },
  label: {
    flex: 1,
    fontSize: FontSize.subhead,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.85,
  },
});
