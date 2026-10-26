import { Pressable, StyleSheet, Text, View } from "react-native";

import { Avatar, DEFAULT_AVATAR_SIZE } from "@/components/ui/avatar";
import { FontSize, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { formatTimeAgo, type IsoDate } from "@/lib/dates";
import type { Friend } from "@/lib/loans";

export const FRIEND_ROW_INSET = Spacing.lg + DEFAULT_AVATAR_SIZE + Spacing.md;

type FriendRowProps = {
  friend: Friend;
  today: IsoDate;
  onPress?: () => void;
};

export function FriendRow({ friend, today, onPress }: FriendRowProps) {
  const colors = useThemeColors();
  const joined = `Joined ${formatTimeAgo(friend.joinedOn, today)}`;

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${friend.name}, ${joined}`}
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.background }]}
    >
      <Avatar name={friend.name} colorKey={friend.id} />
      <View style={styles.details}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {friend.name}
        </Text>
        <Text style={[styles.joined, { color: colors.textSecondary }]}>{joined}</Text>
      </View>
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
  joined: {
    fontSize: FontSize.footnote,
  },
});
