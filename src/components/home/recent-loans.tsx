import { Fragment } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FRIEND_ROW_SEPARATOR_INSET, FriendLoanRow } from "@/components/home/friend-loan-row";
import { LoanStackIllustration } from "@/components/home/loan-stack-illustration";
import { EmptyState } from "@/components/ui/empty-state";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import type { FriendLoanSummary } from "@/lib/loans";

type RecentLoansProps = {
  // Bounded preview (see RECENT_LOANS_LIMIT), so a plain map is fine here; the full,
  // unbounded list belongs on the Loans tab in a virtualised list.
  summaries: FriendLoanSummary[];
  onSeeAll?: () => void;
  onOpenFriend?: (friendId: string) => void;
};

export function RecentLoans({ summaries, onSeeAll, onOpenFriend }: RecentLoansProps) {
  const colors = useThemeColors();
  const isEmpty = summaries.length === 0;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={[styles.title, { color: colors.textSecondary }]}>
          Recent loans
        </Text>
        {!isEmpty && (
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="See all loans"
            onPress={onSeeAll}
            hitSlop={12}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text style={[styles.seeAll, { color: colors.link }]}>See all</Text>
          </Pressable>
        )}
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
        ]}
      >
        {isEmpty ? (
          <View style={styles.empty}>
            <EmptyState
              illustration={<LoanStackIllustration />}
              title="No recent loan"
              body="Loans you make or receive will show up here, newest first."
              action={{
                label: "View loans",
                icon: { ios: "square.stack.3d.up", android: "stacks", web: "stacks" },
                onPress: onSeeAll,
              }}
            />
          </View>
        ) : (
          summaries.map((summary, index) => (
            <Fragment key={summary.key}>
              {index > 0 && (
                <View style={[styles.separator, { backgroundColor: colors.separator }]} />
              )}
              <FriendLoanRow
                summary={summary}
                onPress={onOpenFriend && (() => onOpenFriend(summary.friend.id))}
              />
            </Fragment>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: FontSize.footnote,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  seeAll: {
    fontSize: FontSize.body,
    fontWeight: "600",
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: FRIEND_ROW_SEPARATOR_INSET,
  },
  empty: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxxl,
  },
  pressed: {
    opacity: 0.6,
  },
});
