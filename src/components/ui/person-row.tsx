import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Avatar, DEFAULT_AVATAR_SIZE } from "@/components/ui/avatar";
import { FontSize, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

export const PERSON_ROW_INSET = Spacing.lg + DEFAULT_AVATAR_SIZE + Spacing.md;

type PersonRowProps = {
  name: string;
  /** Second line, e.g. "Joined 3 months ago" or a phone number. */
  detail: string;
  /** Keeps the avatar colour stable for this person. */
  colorKey?: string;
  onPress?: () => void;
  /** Shows a chevron, for rows that move on to another screen. */
  showChevron?: boolean;
};

/** Avatar, name and one line of detail; sits inside a `GroupedRow`. */
export function PersonRow({
  name,
  detail,
  colorKey,
  onPress,
  showChevron = false,
}: PersonRowProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${name}, ${detail}`}
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.background }]}
    >
      <Avatar name={name} colorKey={colorKey} />
      <View style={styles.details}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[styles.detail, { color: colors.textSecondary }]}>{detail}</Text>
      </View>
      {showChevron && (
        <SymbolView
          name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
          size={14}
          tintColor={colors.textTertiary}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
  },
  details: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: FontSize.body,
    fontWeight: "600",
  },
  detail: {
    fontSize: FontSize.footnote,
  },
});
