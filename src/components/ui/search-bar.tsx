import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { BUTTON_HEIGHT } from "@/components/ui/button";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  accessibilityLabel: string;
  height?: number;
  /** Rendered beside the field, e.g. a filter or add button sized to `height`. */
  trailing?: ReactNode;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder,
  accessibilityLabel,
  height = BUTTON_HEIGHT.large,
  trailing,
}: SearchBarProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.field,
          {
            minHeight: height,
            backgroundColor: colors.surface,
            borderColor: colors.surfaceBorder,
          },
        ]}
      >
        <SymbolView
          name={{ ios: "magnifyingglass", android: "search", web: "search" }}
          size={18}
          tintColor={colors.textSecondary}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          accessibilityLabel={accessibilityLabel}
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="search"
          clearButtonMode="never"
          style={[styles.input, { color: colors.text }]}
        />
        {value.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            onPress={() => onChangeText("")}
            hitSlop={12}
          >
            <SymbolView
              name={{ ios: "xmark.circle.fill", android: "cancel", web: "cancel" }}
              size={18}
              tintColor={colors.textTertiary}
            />
          </Pressable>
        )}
      </View>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  field: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    fontSize: FontSize.body,
    paddingVertical: Spacing.sm,
  },
});
