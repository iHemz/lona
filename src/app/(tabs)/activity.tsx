import { useState } from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";

import { ACTIVITY_ICON_SIZE, ActivityRow } from "@/components/activity/activity-row";
import { CardStackIllustration } from "@/components/ui/card-stack-illustration";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterChips } from "@/components/ui/filter-chips";
import { GroupedRow, GroupedSeparator } from "@/components/ui/grouped-list";
import { FontSize, Spacing } from "@/constants/theme";
import { useLedger } from "@/hooks/use-ledger";
import { useScreenTopPadding } from "@/hooks/use-screen-top-padding";
import { useThemeColors } from "@/hooks/use-theme";
import {
  ACTIVITY_FILTERS,
  groupByDay,
  matchesFilter,
  type ActivityDay,
  type ActivityEvent,
  type ActivityFilter,
} from "@/lib/activity";

const EMPTY_COPY: Record<ActivityFilter, { title: string; body: string }> = {
  all: {
    title: "Nothing’s happened yet",
    body: "Payments, reminders and updates show up here as they happen, newest first.",
  },
  payments: {
    title: "No payments yet",
    body: "Repayments between you and your friends show up here.",
  },
  updates: {
    title: "No updates yet",
    body: "Loan offers, reminders and missed payments show up here.",
  },
};

export default function ActivityScreen() {
  const colors = useThemeColors();
  const topPadding = useScreenTopPadding();
  const { friends, activity, today } = useLedger();
  const [filter, setFilter] = useState<ActivityFilter>("all");

  const friendById = new Map(friends.map((friend) => [friend.id, friend]));
  // Events for friends we can't resolve have nothing meaningful to show.
  const known = activity.filter((event) => friendById.has(event.friendId));
  const days = groupByDay(
    known.filter((event) => matchesFilter(event, filter)),
    today,
  );
  const empty = EMPTY_COPY[filter];

  return (
    <SectionList<ActivityEvent, ActivityDay>
      style={{ backgroundColor: colors.background }}
      sections={days}
      keyExtractor={(event) => event.id}
      stickySectionHeadersEnabled={false}
      renderItem={({ item, index, section }) => {
        const friend = friendById.get(item.friendId);
        return friend ? (
          <GroupedRow index={index} count={section.data.length}>
            <ActivityRow event={item} friend={friend} />
          </GroupedRow>
        ) : null;
      }}
      ItemSeparatorComponent={() => (
        <GroupedSeparator inset={Spacing.lg + ACTIVITY_ICON_SIZE + Spacing.md} />
      )}
      renderSectionHeader={({ section }) => (
        <Text accessibilityRole="header" style={[styles.dayTitle, { color: colors.textSecondary }]}>
          {section.title}
        </Text>
      )}
      renderSectionFooter={() => <View style={styles.dayGap} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
            Activity
          </Text>
          <FilterChips
            options={ACTIVITY_FILTERS.map(({ value, label }) => ({
              value,
              label,
              count: known.filter((event) => matchesFilter(event, value)).length,
            }))}
            selected={filter}
            onSelect={setFilter}
          />
        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <EmptyState
            illustration={
              <CardStackIllustration
                icon={{ ios: "clock", android: "schedule", web: "schedule" }}
              />
            }
            title={empty.title}
            body={empty.body}
            action={
              filter === "all"
                ? {
                    label: "Set up your first loan",
                    icon: { ios: "plus", android: "add", web: "add" },
                    variant: "primary",
                    size: "large",
                  }
                : undefined
            }
          />
        </View>
      }
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.content, { paddingTop: topPadding }]}
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
  dayTitle: {
    fontSize: FontSize.footnote,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    paddingBottom: Spacing.sm,
  },
  dayGap: {
    height: Spacing.xl,
  },
  empty: {
    paddingVertical: Spacing.xxxl * 2,
  },
});
