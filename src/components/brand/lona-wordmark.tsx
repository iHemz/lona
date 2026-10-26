import { StyleSheet, Text, type StyleProp, type TextStyle } from "react-native";

import { useThemeColors } from "@/hooks/use-theme";

type LonaWordmarkProps = {
  style?: StyleProp<TextStyle>;
};

/** "Lona." with the brand-blue full stop. */
export function LonaWordmark({ style }: LonaWordmarkProps) {
  const colors = useThemeColors();

  return (
    <Text accessibilityLabel="Lona" style={[styles.wordmark, { color: colors.text }, style]}>
      Lona<Text style={{ color: colors.primary }}>.</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  wordmark: {
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -1,
  },
});
