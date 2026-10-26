import { useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

import { BalanceSummary } from "@/components/home/balance-summary";
import { FeaturedLoanCard } from "@/components/home/featured-loan-card";
import { FeaturedLoanEmpty } from "@/components/home/featured-loan-empty";
import { HomeActions } from "@/components/home/home-actions";
import { HomeHeader } from "@/components/home/home-header";
import { RecentLoans } from "@/components/home/recent-loans";
import { OptionalSetup } from "@/components/setup/optional-setup";
import { SetupChecklist } from "@/components/setup/setup-checklist";
import { Spacing } from "@/constants/theme";
import { useHomeDashboard } from "@/hooks/use-home-dashboard";
import { useAccount } from "@/hooks/use-ledger";
import { useScreenTopPadding } from "@/hooks/use-screen-top-padding";
import { useSetup } from "@/hooks/use-setup";
import { useThemeColors } from "@/hooks/use-theme";
import { canMoveMoney, isSetupComplete } from "@/lib/setup";

export default function HomeScreen() {
  const colors = useThemeColors();
  const topPadding = useScreenTopPadding();
  const router = useRouter();
  const account = useAccount();
  const { owedToYou, youOwe, featured, recentLoans } = useHomeDashboard();
  const { completed } = useSetup();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.content, { paddingTop: topPadding }]}
    >
      <HomeHeader
        user={account.user}
        onOpenProfile={() => router.push("/profile")}
        onOpenSettings={() => router.push("/settings")}
      />
      <BalanceSummary owedToYou={owedToYou} youOwe={youOwe} />
      <HomeActions canRequestLoan={canMoveMoney(completed)} />
      {/* Setup takes precedence over the dashboard until it's finished. */}
      {isSetupComplete(completed) ? (
        <>
          {featured ? (
            <FeaturedLoanCard
              loan={featured.loan}
              friend={featured.friend}
              isOverdue={featured.isOverdue}
            />
          ) : (
            <FeaturedLoanEmpty />
          )}
          <RecentLoans
            summaries={recentLoans}
            onSeeAll={() => router.navigate("/loans")}
            onOpenFriend={(friendId) =>
              router.push({ pathname: "/friend/[id]", params: { id: friendId } })
            }
          />
        </>
      ) : (
        <>
          <SetupChecklist
            completed={completed}
            onStartTask={{
              id: () => router.push("/verify-id"),
              payment: () => router.push("/link-payment"),
            }}
          />
          <OptionalSetup />
        </>
      )}
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
