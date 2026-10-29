import type { ComponentRef, ReactNode, Ref } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

// The blanks in the loan-terms sentence: filled pills are tinted, empty ones dashed.

type TermPillProps = {
  /** Null while the blank is empty; `placeholder` shows instead. */
  value: string | null;
  placeholder: string;
  leading?: ReactNode;
  /** Announced as "<label>, <value or 'not set'>". */
  accessibilityLabel: string;
  accessibilityHint?: string;
  onPress: () => void;
};

export function TermPill({
  value,
  placeholder,
  leading,
  accessibilityLabel,
  accessibilityHint,
  onPress,
}: TermPillProps) {
  const colors = useThemeColors();
  const isEmpty = value === null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${accessibilityLabel}, ${value ?? "not set"}`}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [
        styles.pill,
        isEmpty
          ? [styles.empty, { borderColor: colors.outlineBorder }]
          : { backgroundColor: colors.linkSurface, borderColor: colors.linkSurface },
        pressed && styles.pressed,
      ]}
    >
      {leading}
      <Text
        numberOfLines={1}
        style={[styles.text, { color: isEmpty ? colors.textTertiary : colors.link }]}
      >
        {value ?? placeholder}
      </Text>
    </Pressable>
  );
}

type AmountPillProps = {
  value: string;
  onChangeText: (text: string) => void;
  /** e.g. "£", shown before the number. */
  symbol: string;
  isInvalid: boolean;
  ref?: Ref<ComponentRef<typeof TextInput>>;
};

/** The amount blank is typed straight into the sentence. */
export function AmountPill({ value, onChangeText, symbol, isInvalid, ref }: AmountPillProps) {
  const colors = useThemeColors();
  const isEmpty = value.length === 0;
  const borderColor = isInvalid
    ? colors.danger
    : isEmpty
      ? colors.outlineBorder
      : colors.linkSurface;

  return (
    <View
      style={[
        styles.pill,
        isEmpty && styles.empty,
        { borderColor, backgroundColor: isEmpty ? "transparent" : colors.linkSurface },
      ]}
    >
      <Text style={[styles.text, { color: isEmpty ? colors.textTertiary : colors.link }]}>
        {symbol}
      </Text>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder="0"
        placeholderTextColor={colors.textTertiary}
        keyboardType="decimal-pad"
        returnKeyType="done"
        accessibilityLabel="Amount you’re lending"
        style={[styles.text, styles.input, { color: colors.link }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    minHeight: 44,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
  },
  empty: {
    borderStyle: "dashed",
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontSize: FontSize.heading,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  input: {
    minWidth: 48,
    paddingVertical: Spacing.xs,
  },
});
