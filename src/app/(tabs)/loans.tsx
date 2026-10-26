import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

import { FRIEND_ROW_SEPARATOR_INSET, FriendLoanRow } from "@/components/home/friend-loan-row";
import { LoansEmpty } from "@/components/loans/loans-empty";
import { LoansSummaryCard } from "@/components/loans/loans-summary-card";
import { BUTTON_HEIGHT } from "@/components/ui/button";
import { FilterChips } from "@/components/ui/filter-chips";
import { GroupedRow, GroupedSeparator } from "@/components/ui/grouped-list";
import { IconButton } from "@/components/ui/icon-button";
import { SearchBar } from "@/components/ui/search-bar";
import { FontSize, Spacing } from "@/constants/theme";
import { useKeyboardVisible } from "@/hooks/use-keyboard-visible";
import { useLedger } from "@/hooks/use-ledger";
import { useScreenTopPadding } from "@/hooks/use-screen-top-padding";
import { useThemeColors } from "@/hooks/use-theme";
import { buildLoanTabs, filterBySearch, LOAN_TABS, type LoanTab } from "@/lib/loans-list";

// A provider inside the tab measures insets from the screen's own position, so on iOS the
// bottom inset includes the floating tab bar and the search bar sits just above it.
export default function LoansScreen() {
  return (
    <SafeAreaProvider>
      <LoansScreenContent />
    </SafeAreaProvider>
  );
}

function LoansScreenContent() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const topPadding = useScreenTopPadding();
  const router = useRouter();
  const isKeyboardVisible = useKeyboardVisible();
  const tabs = buildLoanTabs(useLedger());
  const [selectedTab, setSelectedTab] = useState<LoanTab>("lent");
  const [query, setQuery] = useState("");

  const view = tabs[selectedTab];
  const rows = filterBySearch(view.rows, query);
  const hasLoans = view.rows.length > 0;

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={rows}
        keyExtractor={(row) => row.key}
        renderItem={({ item, index }) => (
          <GroupedRow index={index} count={rows.length}>
            <FriendLoanRow
              summary={item}
              onPress={() =>
                router.push({ pathname: "/friend/[id]", params: { id: item.friend.id } })
              }
            />
          </GroupedRow>
        )}
        ItemSeparatorComponent={() => <GroupedSeparator inset={FRIEND_ROW_SEPARATOR_INSET} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
              Loans
            </Text>
            <FilterChips
              options={LOAN_TABS.map(({ tab, label }) => ({
                value: tab,
                label,
                count: tabs[tab].rows.length,
              }))}
              selected={selectedTab}
              onSelect={setSelectedTab}
            />
            <LoansSummaryCard label={view.totalLabel} total={view.total} />
            {hasLoans && (
              <Text
                accessibilityRole="header"
                style={[styles.sectionTitle, { color: colors.textSecondary }]}
              >
                {view.sectionTitle}
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          hasLoans ? (
            <Text style={[styles.noMatches, { color: colors.textSecondary }]}>
              No loans match “{query.trim()}”.
            </Text>
          ) : (
            <LoansEmpty tab={selectedTab} />
          )
        }
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.content, { paddingTop: topPadding }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
      {hasLoans && (
        <View
          style={[
            styles.searchDock,
            { paddingBottom: (isKeyboardVisible ? 0 : insets.bottom) + Spacing.md },
          ]}
        >
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search loan"
            accessibilityLabel="Search loans by friend's name"
            trailing={
              <IconButton
                icon={{
                  ios: "line.3.horizontal.decrease",
                  android: "filter_list",
                  web: "filter_list",
                }}
                accessibilityLabel="Filter loans"
                size={BUTTON_HEIGHT.large}
              />
            }
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  header: {
    gap: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.largeTitle,
    fontWeight: "700",
    letterSpacing: -0.4,
  },
  sectionTitle: {
    fontSize: FontSize.footnote,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginTop: Spacing.sm,
  },
  noMatches: {
    fontSize: FontSize.subhead,
    textAlign: "center",
    paddingVertical: Spacing.xxl,
  },
  searchDock: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
});
