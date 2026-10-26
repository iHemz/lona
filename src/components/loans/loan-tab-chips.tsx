import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { FontSize, Radius, Spacing, TouchTarget } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import type { LoanTab } from "@/lib/loans-list";

type LoanTabChipsProps = {
  tabs: { tab: LoanTab; label: string; count: number }[];
  selected: LoanTab;
  onSelect: (tab: LoanTab) => void;
};

export function LoanTabChips({ tabs, selected, onSelect }: LoanTabChipsProps) {
  const colors = useThemeColors();

  return (
    // Scrolls rather than wraps when larger text sizes make the chips too wide.
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityRole="tablist"
      contentContainerStyle={styles.row}
    >
      {tabs.map(({ tab, label, count }) => {
        const isSelected = tab === selected;
        return (
          <Pressable
            key={tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${label}, ${count}`}
            onPress={() => onSelect(tab)}
            style={({ pressed }) => [
              styles.chip,
              isSelected
                ? { backgroundColor: colors.inverse, borderColor: colors.inverse }
                : { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.label, { color: isSelected ? colors.onInverse : colors.text }]}>
              {label}
            </Text>
            <View
              style={[
                styles.count,
                { backgroundColor: isSelected ? colors.onInverse : colors.chipCountSurface },
              ]}
            >
              <Text
                style={[
                  styles.countLabel,
                  { color: isSelected ? colors.inverse : colors.textSecondary },
                ]}
              >
                {count}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.sm,
  },
  chip: {
    minHeight: TouchTarget,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.md,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: FontSize.subhead,
    fontWeight: "600",
  },
  count: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  countLabel: {
    fontSize: FontSize.caption,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  pressed: {
    opacity: 0.7,
  },
});
