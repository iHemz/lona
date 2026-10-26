import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Fragment } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FontSize, Radius, Spacing, TouchTarget } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

export type LinkListItem = {
  label: string;
  icon: SymbolViewProps["name"];
  onPress?: () => void;
};

/** A short, fixed list of navigation rows (icon, label, chevron) in a rounded card. */
export function LinkList({ items }: { items: LinkListItem[] }) {
  const colors = useThemeColors();

  return (
    <View
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
    >
      {items.map(({ label, icon, onPress }, index) => (
        <Fragment key={label}>
          {index > 0 && <View style={[styles.separator, { backgroundColor: colors.separator }]} />}
          <Pressable
            accessibilityRole="button"
            onPress={onPress}
            style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.background }]}
          >
            <SymbolView name={icon} size={18} tintColor={colors.textSecondary} />
            <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
            <SymbolView
              name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
              size={14}
              tintColor={colors.textTertiary}
            />
          </Pressable>
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  row: {
    minHeight: TouchTarget + Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  label: {
    flex: 1,
    fontSize: FontSize.body,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.lg + 18 + Spacing.md,
  },
});
