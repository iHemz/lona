import { Fragment } from "react";
import { StyleSheet, View } from "react-native";

import { FRIEND_ROW_SEPARATOR_INSET, FriendLoanRow } from "@/components/home/friend-loan-row";
import { CardStackIllustration } from "@/components/ui/card-stack-illustration";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { LOAN_STACK_ICON } from "@/constants/icons";
import { Radius, Spacing } from "@/constants/theme";
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
      <SectionHeader
        title="Recent loans"
        action={
          isEmpty
            ? undefined
            : { label: "See all", accessibilityLabel: "See all loans", onPress: onSeeAll }
        }
      />

      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
        ]}
      >
        {isEmpty ? (
          <View style={styles.empty}>
            <EmptyState
              illustration={<CardStackIllustration icon={LOAN_STACK_ICON} />}
              title="No recent loan"
              body="Loans you make or receive will show up here, newest first."
              action={{
                label: "View loans",
                icon: LOAN_STACK_ICON,
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
});
