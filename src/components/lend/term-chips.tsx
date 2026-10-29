import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

export type TermChip<Key extends string = string> = {
  key: Key;
  leading: ReactNode;
  label: string;
  /** Extra context after the label, e.g. that an invite will be sent. */
  note?: string;
};

type TermChipsProps<Key extends string> = {
  chips: TermChip<Key>[];
  /** Reopens the blank behind the chip. */
  onPress: (key: Key) => void;
};

/** The filled-in terms as tappable chips, each reopening its blank. */
export function TermChips<Key extends string>({ chips, onPress }: TermChipsProps<Key>) {
  const colors = useThemeColors();

  if (chips.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.hint}>
        <SymbolView
          name={{ ios: "hand.tap", android: "touch_app", web: "touch_app" }}
          size={14}
          tintColor={colors.textSecondary}
        />
        <Text style={[styles.hintLabel, { color: colors.textSecondary }]}>
          Tap a pill to change it
        </Text>
      </View>
      {chips.map((chip) => (
        <Pressable
          key={chip.key}
          accessibilityRole="button"
          accessibilityLabel={[chip.label, chip.note].filter(Boolean).join(". ")}
          accessibilityHint="Change it"
          onPress={() => onPress(chip.key)}
          style={({ pressed }) => [
            styles.chip,
            { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
            pressed && styles.pressed,
          ]}
        >
          {chip.leading}
          <Text style={[styles.label, { color: colors.text }]}>{chip.label}</Text>
          {chip.note && (
            <Text style={[styles.note, { color: colors.warning }]} numberOfLines={2}>
              {chip.note}
            </Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs + 2,
  },
  hintLabel: {
    fontSize: FontSize.caption,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    gap: Spacing.sm,
    minHeight: 44,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: FontSize.body,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  note: {
    flexShrink: 1,
    fontSize: FontSize.caption,
    fontWeight: "600",
  },
});
