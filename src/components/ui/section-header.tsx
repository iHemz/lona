import { Pressable, StyleSheet, Text, View } from "react-native";

import { FontSize } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type SectionHeaderProps = {
  title: string;
  /** A trailing link such as "See all"; omitted when there's nothing more to show. */
  action?: {
    label: string;
    accessibilityLabel: string;
    onPress?: () => void;
  };
};

/** Uppercase section title with an optional trailing link, above a grouped card. */
export function SectionHeader({ title, action }: SectionHeaderProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.header}>
      <Text accessibilityRole="header" style={[styles.title, { color: colors.textSecondary }]}>
        {title}
      </Text>
      {action && (
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={action.accessibilityLabel}
          onPress={action.onPress}
          hitSlop={12}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Text style={[styles.action, { color: colors.link }]}>{action.label}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: FontSize.footnote,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  action: {
    fontSize: FontSize.body,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.6,
  },
});
