import { Redirect, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { LoanOfferSummary } from "@/components/lend/loan-offer-summary";
import { OptionRow } from "@/components/ui/option-row";
import { SectionHeader } from "@/components/ui/section-header";
import { StepLayout } from "@/components/ui/step-layout";
import { Spacing } from "@/constants/theme";
import { useLedger } from "@/hooks/use-ledger";
import { useLendDraft } from "@/hooks/use-lend-draft";
import { lendStepHeading } from "@/lib/lend";

export default function RepaymentPlanScreen() {
  const router = useRouter();
  const { today } = useLedger();
  const { draft, update } = useLendDraft();

  // Opened without choosing someone first (e.g. a deep link): start from step 1.
  if (!draft.recipient) return <Redirect href="/lend" />;

  return (
    <StepLayout
      navBar={{ title: "Offer loan", showMore: false }}
      heading={{ ...lendStepHeading(2), title: "How should they pay you back?" }}
    >
      <View style={styles.options}>
        <OptionRow
          title="One-time payment"
          description="They repay the total by a deadline"
          icon={{ ios: "banknote", android: "payments", web: "payments" }}
          onPress={() => {
            update({ plan: "one-time" });
            router.push("/lend/terms");
          }}
        />
        {/* TODO: enable once the instalment terms screen is designed. */}
        <OptionRow
          title="Instalment payments"
          description="Coming soon"
          icon={{ ios: "square.stack.3d.up", android: "layers", web: "layers" }}
          disabled
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Selected friend" />
        <LoanOfferSummary recipient={draft.recipient} today={today} />
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: Spacing.md,
  },
  section: {
    gap: Spacing.md,
  },
});
