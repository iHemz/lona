import { StyleSheet, Text, View } from "react-native";

import { FontSize, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type PlaceholderScreenProps = {
  title: string;
};

/** Stand-in for tabs that haven't been designed yet. */
export function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>
      <Text style={[styles.body, { color: colors.textSecondary }]}>Coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    padding: Spacing.xxl,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: "700",
  },
  body: {
    fontSize: FontSize.body,
  },
});
