import { SymbolView } from "expo-symbols";
import { StyleSheet, Text, View } from "react-native";

import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

/** Reassurance card with a shield, e.g. who handles sensitive data in a setup step. */
export function PrivacyNote({ children }: { children: string }) {
  const colors = useThemeColors();

  return (
    <View
      style={[styles.note, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
    >
      <SymbolView
        name={{ ios: "checkmark.shield", android: "verified_user", web: "verified_user" }}
        size={18}
        tintColor={colors.success}
      />
      <Text style={[styles.text, { color: colors.text }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  note: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  text: {
    flex: 1,
    fontSize: FontSize.footnote,
    lineHeight: 18,
  },
});
