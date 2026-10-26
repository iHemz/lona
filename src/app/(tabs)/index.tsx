import { useRouter } from "expo-router";
import { Platform, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BalanceSummary } from "@/components/home/balance-summary";
import { FeaturedLoanCard } from "@/components/home/featured-loan-card";
import { HomeActions } from "@/components/home/home-actions";
import { HomeHeader } from "@/components/home/home-header";
import { RecentLoans } from "@/components/home/recent-loans";
import { Spacing } from "@/constants/theme";
import { useHomeDashboard } from "@/hooks/use-home-dashboard";
import { useThemeColors } from "@/hooks/use-theme";
import { MOCK_CURRENT_USER } from "@/lib/mock-data";

// iOS applies safe-area insets to the scroll view itself (contentInsetAdjustmentBehavior);
// Android and web need them as padding.
const appliesSafeAreaAutomatically = Platform.OS === "ios";

export default function HomeScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { owedToYou, youOwe, featured, recentLoans } = useHomeDashboard();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        styles.content,
        !appliesSafeAreaAutomatically && { paddingTop: insets.top + Spacing.sm },
      ]}
    >
      <HomeHeader user={MOCK_CURRENT_USER} />
      <BalanceSummary owedToYou={owedToYou} youOwe={youOwe} />
      <HomeActions />
      {featured && (
        <FeaturedLoanCard
          loan={featured.loan}
          friend={featured.friend}
          isOverdue={featured.isOverdue}
        />
      )}
      <RecentLoans summaries={recentLoans} onSeeAll={() => router.navigate("/loans")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.xxl,
  },
});
