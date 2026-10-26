import { SymbolView } from "expo-symbols";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type StatusPillProps = {
  label: string;
  /** `success` adds a green check; `busy` a spinner; `neutral` is plain. */
  tone: "neutral" | "success" | "busy";
};

/** Live capture feedback, announced to screen readers as it changes. */
export function StatusPill({ label, tone }: StatusPillProps) {
  const colors = useThemeColors();
  const color = tone === "success" ? colors.success : colors.textSecondary;

  return (
    <View
      accessibilityLiveRegion="polite"
      style={[
        styles.pill,
        { backgroundColor: tone === "success" ? colors.successSurface : colors.surface },
      ]}
    >
      {tone === "success" && (
        <SymbolView
          name={{ ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }}
          size={14}
          tintColor={color}
        />
      )}
      {tone === "busy" && <ActivityIndicator size="small" color={color} />}
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.pill,
  },
  label: {
    fontSize: FontSize.footnote,
    fontWeight: "600",
  },
});
