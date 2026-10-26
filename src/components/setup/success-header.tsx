import { SymbolView } from "expo-symbols";
import { StyleSheet, Text, View } from "react-native";

import { FontSize, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

const BADGE_SIZE = 56;

type SuccessHeaderProps = {
  title: string;
  subtitle: string;
};

/** Green check, headline and a short line, for the end of a setup step. */
export function SuccessHeader({ title, subtitle }: SuccessHeaderProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={[styles.halo, { backgroundColor: colors.successSurface }]}>
        <View style={[styles.badge, { backgroundColor: colors.successFill }]}>
          <SymbolView
            name={{ ios: "checkmark", android: "check", web: "check" }}
            size={26}
            weight="bold"
            tintColor={colors.onPrimary}
          />
        </View>
      </View>
      <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: Spacing.md,
  },
  halo: {
    padding: Spacing.sm,
    borderRadius: (BADGE_SIZE + Spacing.sm * 2) / 2,
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: FontSize.title + 4,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    fontSize: FontSize.subhead,
    textAlign: "center",
    maxWidth: 280,
  },
});
