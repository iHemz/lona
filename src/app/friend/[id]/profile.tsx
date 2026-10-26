import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { FriendHero } from "@/components/friend/friend-hero";
import { FriendModalHeader } from "@/components/friend/friend-modal-header";
import { FriendNotFound } from "@/components/friend/friend-not-found";
import { LifetimeStats } from "@/components/friend/lifetime-stats";
import { RecordCard } from "@/components/friend/record-card";
import { RepaymentRing } from "@/components/friend/repayment-ring";
import { LinkList } from "@/components/ui/link-list";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useFriendLedger } from "@/hooks/use-ledger";
import { useScreenTopPadding } from "@/hooks/use-screen-top-padding";
import { useThemeColors } from "@/hooks/use-theme";
import { formatMonthYear } from "@/lib/dates";
import { lifetimeTotals, repaymentRecord } from "@/lib/friend-profile";
import { formatMoney } from "@/lib/money";
import { firstName } from "@/lib/names";

export default function FriendProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { friend, loans, currency } = useFriendLedger(id);
  const colors = useThemeColors();
  const router = useRouter();
  const topPadding = useScreenTopPadding();

  if (!friend) return <FriendNotFound />;

  const name = firstName(friend.name);
  const totals = lifetimeTotals(loans, currency);
  const record = repaymentRecord(loans);
  const lentLabel = `${formatMoney(totals.lent, { trimWholeAmounts: true })} lent`;
  const rateLabel =
    record.onTimeRate === null ? null : `${Math.round(record.onTimeRate * 100)}% return rate`;

  const openLoans = () => {
    // Usually opened from the friend's loans screen; fall back for deep links.
    if (router.canGoBack()) router.back();
    else router.replace({ pathname: "/friend/[id]", params: { id: friend.id } });
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.content, { paddingTop: topPadding }]}
    >
      <FriendModalHeader />
      <FriendHero
        friend={friend}
        title={friend.name}
        subtitle={`On Lona since ${formatMonthYear(friend.joinedOn)}`}
      >
        <View
          accessible
          accessibilityLabel={[lentLabel, rateLabel].filter(Boolean).join(", ")}
          style={[styles.pill, { backgroundColor: colors.successSurface }]}
        >
          <SymbolView
            name={{ ios: "checkmark.shield", android: "verified_user", web: "verified_user" }}
            size={14}
            tintColor={colors.success}
          />
          <Text style={[styles.pillText, { color: colors.success }]}>
            {lentLabel}
            {rateLabel && ` • ${rateLabel}`}
          </Text>
        </View>
      </FriendHero>

      <RecordCard
        onOpen={openLoans}
        openLabel={`Loans with ${name}`}
        footer={<LifetimeStats totals={totals} />}
      >
        <View style={styles.recordRow}>
          <RepaymentRing rate={record.onTimeRate} />
          {record.repaid > 0 ? (
            <Text style={[styles.recordText, { color: colors.textSecondary }]}>
              <Text style={[styles.recordCount, { color: colors.text }]}>{record.onTime} of</Text>{" "}
              {record.repaid} {record.repaid === 1 ? "loan" : "loans"} repaid on time
            </Text>
          ) : (
            <Text style={[styles.recordText, { color: colors.textSecondary }]}>
              No loans repaid yet
            </Text>
          )}
        </View>
      </RecordCard>

      <LinkList
        items={[
          {
            label: `Activity with ${name}`,
            icon: { ios: "clock", android: "schedule", web: "schedule" },
          },
          {
            label: "Mute reminders",
            icon: { ios: "bell.slash", android: "notifications_off", web: "notifications_off" },
          },
        ]}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.xxl,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.pill,
  },
  pillText: {
    fontSize: FontSize.footnote,
    fontWeight: "600",
  },
  recordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xl,
  },
  recordText: {
    flex: 1,
    fontSize: FontSize.body,
    fontWeight: "600",
  },
  recordCount: {
    fontSize: FontSize.title,
    fontWeight: "700",
  },
});
