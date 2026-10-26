import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { FRIEND_ROW_INSET, FriendRow } from "@/components/friends/friend-row";
import { FriendsIllustration } from "@/components/friends/friends-illustration";
import { BUTTON_HEIGHT } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { GroupedRow, GroupedSeparator } from "@/components/ui/grouped-list";
import { IconButton } from "@/components/ui/icon-button";
import { SearchBar } from "@/components/ui/search-bar";
import { FontSize, Spacing } from "@/constants/theme";
import { useLedger } from "@/hooks/use-ledger";
import { useScreenTopPadding } from "@/hooks/use-screen-top-padding";
import { useThemeColors } from "@/hooks/use-theme";
import { friendsWithLoans } from "@/lib/friends";
import { matchesName } from "@/lib/names";

const ADD_FRIEND_ICON = {
  ios: "person.badge.plus",
  android: "person_add",
  web: "person_add",
} as const;

export default function FriendsScreen() {
  const colors = useThemeColors();
  const topPadding = useScreenTopPadding();
  const router = useRouter();
  const { friends, loans, today } = useLedger();
  const [query, setQuery] = useState("");

  const allFriends = friendsWithLoans(friends, loans);
  const rows = allFriends.filter((friend) => matchesName(friend.name, query));

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      data={rows}
      keyExtractor={(friend) => friend.id}
      renderItem={({ item, index }) => (
        <GroupedRow index={index} count={rows.length}>
          <FriendRow
            friend={item}
            today={today}
            onPress={() => router.push({ pathname: "/friend/[id]", params: { id: item.id } })}
          />
        </GroupedRow>
      )}
      ItemSeparatorComponent={() => <GroupedSeparator inset={FRIEND_ROW_INSET} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
            Friends
          </Text>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search"
            accessibilityLabel="Search friends by name"
            height={BUTTON_HEIGHT.compact}
            trailing={
              <IconButton
                icon={ADD_FRIEND_ICON}
                accessibilityLabel="Add friend"
                size={BUTTON_HEIGHT.compact}
                tintColor={colors.link}
              />
            }
          />
        </View>
      }
      ListEmptyComponent={
        allFriends.length > 0 ? (
          <Text style={[styles.noMatches, { color: colors.textSecondary }]}>
            No friends match “{query.trim()}”.
          </Text>
        ) : (
          <View style={styles.empty}>
            <EmptyState
              illustration={<FriendsIllustration />}
              title="No friends added yet"
              body="Add people you lend to or borrow from. You’ll only see friends you share a loan with."
              action={{
                label: "Add friends",
                icon: ADD_FRIEND_ICON,
                variant: "primary",
                size: "compact",
              }}
            />
          </View>
        )
      }
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.content, { paddingTop: topPadding }]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    gap: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.largeTitle,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  noMatches: {
    fontSize: FontSize.subhead,
    textAlign: "center",
    paddingVertical: Spacing.xxl,
  },
  empty: {
    paddingVertical: Spacing.xxxl * 2,
  },
});
