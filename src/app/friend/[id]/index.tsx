import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, SectionList, StyleSheet, Text, View } from "react-native";

import { ActiveLoanRow, LOAN_ICON_SIZE } from "@/components/friend/active-loan-row";
import { BalanceSentence } from "@/components/friend/balance-sentence";
import { FriendHero } from "@/components/friend/friend-hero";
import { FriendModalHeader } from "@/components/friend/friend-modal-header";
import { FriendNotFound } from "@/components/friend/friend-not-found";
import { RecordCard } from "@/components/friend/record-card";
import { SettledLoanRow } from "@/components/friend/settled-loan-row";
import { Button } from "@/components/ui/button";
import { GroupedRow, GroupedSeparator } from "@/components/ui/grouped-list";
import { FontSize, Spacing } from "@/constants/theme";
import { useFriendLedger } from "@/hooks/use-ledger";
import { useScreenTopPadding } from "@/hooks/use-screen-top-padding";
import { useThemeColors } from "@/hooks/use-theme";
import {
  activeLoanItems,
  friendBalances,
  settledLoanItems,
  type ActiveLoanItem,
  type SettledLoanItem,
} from "@/lib/friend-profile";
import { firstName } from "@/lib/names";

/** Rows shown per section before "See all". */
const PREVIEW_COUNT = 4;

type SectionKey = "active" | "settled";
type Row = { kind: "active"; item: ActiveLoanItem } | { kind: "settled"; item: SettledLoanItem };
type Section = { key: SectionKey; title: string; total: number; data: Row[] };

export default function FriendLoansScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { friend, loans, today, currency } = useFriendLedger(id);
  const colors = useThemeColors();
  const router = useRouter();
  const topPadding = useScreenTopPadding();
  const [expanded, setExpanded] = useState<Record<SectionKey, boolean>>({
    active: false,
    settled: false,
  });

  if (!friend) return <FriendNotFound />;

  const name = firstName(friend.name);
  const active = activeLoanItems(loans, today);
  const settled = settledLoanItems(loans);
  const preview = <T,>(key: SectionKey, rows: T[]) =>
    expanded[key] ? rows : rows.slice(0, PREVIEW_COUNT);

  const sections: Section[] = [
    {
      key: "active" as const,
      title: "Active",
      total: active.length,
      data: preview("active", active).map((item) => ({ kind: "active" as const, item })),
    },
    {
      key: "settled" as const,
      title: "Settled",
      total: settled.length,
      data: preview("settled", settled).map((item) => ({ kind: "settled" as const, item })),
    },
  ].filter((section) => section.total > 0);

  return (
    <SectionList<Row, Section>
      style={{ backgroundColor: colors.background }}
      sections={sections}
      keyExtractor={(row) => row.item.loan.id}
      stickySectionHeadersEnabled={false}
      renderItem={({ item: row, index, section }) => (
        <GroupedRow index={index} count={section.data.length}>
          {row.kind === "active" ? (
            <ActiveLoanRow item={row.item} />
          ) : (
            <SettledLoanRow item={row.item} />
          )}
        </GroupedRow>
      )}
      ItemSeparatorComponent={() => (
        <GroupedSeparator inset={Spacing.lg + LOAN_ICON_SIZE + Spacing.md} />
      )}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text
            accessibilityRole="header"
            style={[styles.sectionTitle, { color: colors.textSecondary }]}
          >
            {section.title} • {section.total}
          </Text>
          {section.total > PREVIEW_COUNT && (
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                setExpanded((current) => ({ ...current, [section.key]: !current[section.key] }))
              }
              hitSlop={12}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text style={[styles.seeAll, { color: colors.link }]}>
                {expanded[section.key] ? "Show less" : "See all"}
              </Text>
            </Pressable>
          )}
        </View>
      )}
      renderSectionFooter={() => <View style={styles.sectionGap} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <FriendModalHeader />
          <FriendHero
            friend={friend}
            title={`Loans with ${friend.name}`}
            subtitle={`Every loan between you and ${name}.`}
          >
            <Button
              label="View profile"
              icon={{
                ios: "person.crop.circle",
                android: "account_circle",
                web: "account_circle",
              }}
              variant="inverse"
              size="compact"
              onPress={() =>
                router.push({ pathname: "/friend/[id]/profile", params: { id: friend.id } })
              }
            />
          </FriendHero>
          <RecordCard
            footer={
              active.length > 0 && (
                <View style={styles.hint}>
                  <SymbolView
                    name={{ ios: "hand.tap", android: "touch_app", web: "touch_app" }}
                    size={14}
                    tintColor={colors.textSecondary}
                  />
                  <Text style={[styles.hintText, { color: colors.textSecondary }]}>
                    Tap a loan below to track or settle it
                  </Text>
                </View>
              )
            }
          >
            <BalanceSentence name={name} balances={friendBalances(loans, currency)} />
          </RecordCard>
        </View>
      }
      ListEmptyComponent={
        <Text style={[styles.empty, { color: colors.textSecondary }]}>
          No loans with {name} yet.
        </Text>
      }
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.content, { paddingTop: topPadding }]}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    gap: Spacing.xxl,
    paddingBottom: Spacing.xxl,
  },
  hint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  hintText: {
    fontSize: FontSize.caption,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.footnote,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  seeAll: {
    fontSize: FontSize.body,
    fontWeight: "600",
  },
  sectionGap: {
    height: Spacing.xxl,
  },
  empty: {
    fontSize: FontSize.subhead,
    textAlign: "center",
    paddingVertical: Spacing.xxl,
  },
  pressed: {
    opacity: 0.6,
  },
});
