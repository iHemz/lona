import { useIsFocused, useRouter } from "expo-router";
import { useRef, useState, type ComponentRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { BalanceSummary } from "@/components/home/balance-summary";
import { FeaturedLoanCard } from "@/components/home/featured-loan-card";
import { FeaturedLoanEmpty } from "@/components/home/featured-loan-empty";
import { HomeActions } from "@/components/home/home-actions";
import { HomeHeader } from "@/components/home/home-header";
import { NewLoanSheet } from "@/components/home/new-loan-sheet";
import { RecentLoans } from "@/components/home/recent-loans";
import { OptionalSetup } from "@/components/setup/optional-setup";
import { SetupChecklist } from "@/components/setup/setup-checklist";
import { CoachMarks, type CoachMarkStep } from "@/components/ui/coach-marks";
import { Spacing } from "@/constants/theme";
import { useHomeDashboard } from "@/hooks/use-home-dashboard";
import { useHomeTour } from "@/hooks/use-home-tour";
import { useAccount } from "@/hooks/use-ledger";
import { useScreenTopPadding } from "@/hooks/use-screen-top-padding";
import { useSetup } from "@/hooks/use-setup";
import { useThemeColors } from "@/hooks/use-theme";
import { canMoveMoney, isSetupComplete } from "@/lib/setup";

export default function HomeScreen() {
  const colors = useThemeColors();
  const topPadding = useScreenTopPadding();
  const router = useRouter();
  const isFocused = useIsFocused();
  const account = useAccount();
  const { owedToYou, youOwe, featured, recentLoans } = useHomeDashboard();
  const { completed } = useSetup();
  const tour = useHomeTour();
  const [isNewLoanOpen, setIsNewLoanOpen] = useState(false);
  const moreRef = useRef<ComponentRef<typeof View>>(null);
  const featuredRef = useRef<ComponentRef<typeof View>>(null);

  const setupComplete = isSetupComplete(completed);
  // The first time Home is shown after setup, point out the two less obvious things.
  const showTour = setupComplete && tour.isLoaded && !tour.hasSeen && isFocused && !isNewLoanOpen;
  const tourSteps: CoachMarkStep[] = [
    {
      target: moreRef,
      title: "Two more actions",
      body: "Tap ••• to offer to lend a friend money, or settle up what you already owe.",
    },
    {
      target: featuredRef,
      title: "Every loan gets a photo",
      body: "Pick a picture when you set a loan up. It develops with each repayment, so progress is something you look forward to.",
    },
  ];

  return (
    <>
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
        <HomeActions
          canRequestLoan={canMoveMoney(completed)}
          onMore={() => setIsNewLoanOpen(true)}
          moreRef={moreRef}
        />
        {/* Setup takes precedence over the dashboard until it's finished. */}
        {setupComplete ? (
          <>
            <View ref={featuredRef} collapsable={false}>
              {featured ? (
                <FeaturedLoanCard
                  loan={featured.loan}
                  friend={featured.friend}
                  isOverdue={featured.isOverdue}
                />
              ) : (
                <FeaturedLoanEmpty />
              )}
            </View>
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
                reminders: () => router.push("/reminders"),
              }}
            />
            <OptionalSetup />
          </>
        )}
      </ScrollView>

      <NewLoanSheet
        visible={isNewLoanOpen}
        onClose={() => setIsNewLoanOpen(false)}
        canMoveMoney={canMoveMoney(completed)}
        onOfferToLend={() => {
          setIsNewLoanOpen(false);
          router.push("/lend");
        }}
      />
      <CoachMarks steps={tourSteps} visible={showTour} onFinish={tour.markSeen} />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.xxl,
  },
});
