import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { BUTTON_HEIGHT } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type LoanSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onOpenFilters?: () => void;
};

const HEIGHT = BUTTON_HEIGHT.large;

export function LoanSearchBar({ value, onChangeText, onOpenFilters }: LoanSearchBarProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.field,
          { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
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
          placeholder="Search loan"
          placeholderTextColor={colors.textTertiary}
          accessibilityLabel="Search loans by friend's name"
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
      <IconButton
        icon={{
          ios: "line.3.horizontal.decrease",
          android: "filter_list",
          web: "filter_list",
        }}
        accessibilityLabel="Filter loans"
        onPress={onOpenFilters}
        size={HEIGHT}
      />
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
    minHeight: HEIGHT,
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
    paddingVertical: Spacing.md,
  },
});
