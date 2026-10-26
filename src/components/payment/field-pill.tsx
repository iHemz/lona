import { SymbolView } from "expo-symbols";
import { useState, type Ref } from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

import { FontSize, Radius, Spacing, TouchTarget } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type FieldPillProps = Omit<TextInputProps, "style"> & {
  /** Shown before the value, e.g. "Card No:". */
  label: string;
  hasError?: boolean;
  ref?: Ref<TextInput>;
};

/** A pill that is itself the input: tap it to change the value ("Card No: 4242…"). */
export function FieldPill({
  label,
  hasError = false,
  ref,
  onFocus,
  onBlur,
  ...inputProps
}: FieldPillProps) {
  const colors = useThemeColors();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: colors.surface,
          borderColor: hasError ? colors.danger : isFocused ? colors.primary : colors.surface,
          boxShadow: `0 2px 8px ${colors.illustrationShadow}`,
        },
      ]}
    >
      <View style={[styles.icon, { backgroundColor: colors.linkSurface }]}>
        <SymbolView
          name={{ ios: "creditcard", android: "credit_card", web: "credit_card" }}
          size={14}
          tintColor={colors.link}
        />
      </View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        ref={ref}
        accessibilityLabel={label.replace(/:$/, "")}
        placeholderTextColor={colors.textTertiary}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        style={[styles.input, { color: colors.text }]}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    minHeight: TouchTarget + Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingLeft: Spacing.sm,
    paddingRight: Spacing.lg,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: FontSize.body,
  },
  input: {
    minWidth: 60,
    fontSize: FontSize.body,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    paddingVertical: Spacing.sm,
    // The pill's border is the focus indicator; drop the browser outline on web.
    outlineColor: "transparent",
  },
});
