import { Redirect, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { PolaroidIllustration } from "@/components/home/polaroid-illustration";
import { LoanOfferSummary } from "@/components/lend/loan-offer-summary";
import { Button } from "@/components/ui/button";
import { SuccessLayout } from "@/components/ui/success-layout";
import { Spacing } from "@/constants/theme";
import { useBackToClose } from "@/hooks/use-back-to-close";
import { useLedger } from "@/hooks/use-ledger";
import { useLendDraft } from "@/hooks/use-lend-draft";
import { offerTerms, recipientName } from "@/lib/lend";
import { formatMoney } from "@/lib/money";
import { firstName } from "@/lib/names";

export default function OfferSentScreen() {
  const router = useRouter();
  const { today, currency } = useLedger();
  const { draft } = useLendDraft();
  const goHome = () => router.dismissTo("/");
  useBackToClose(goHome);

  const terms = offerTerms(draft, currency);
  if (!terms) return <Redirect href="/" />;

  const { recipient } = terms;
  const viewLoan =
    recipient.kind === "friend"
      ? () => {
          goHome();
          router.push({ pathname: "/friend/[id]", params: { id: recipient.friend.id } });
        }
      : null;

  return (
    <SuccessLayout
      title="Offer sent!"
      subtitle={`${formatMoney(terms.amount)} · One-time payment`}
      actions={
        <View style={styles.actions}>
          <Button label="Go home" variant="secondary" onPress={goHome} style={styles.action} />
          {/* A contact has no loan page until they join and accept. */}
          {viewLoan && <Button label="View loan" onPress={viewLoan} style={styles.action} />}
        </View>
      }
    >
      <View style={styles.polaroid}>
        <PolaroidIllustration
          caption={`Still developing…\nit develops as ${firstName(recipientName(recipient))} repays`}
        />
      </View>
      <LoanOfferSummary recipient={recipient} today={today} terms={terms} />
    </SuccessLayout>
  );
}

const styles = StyleSheet.create({
  polaroid: {
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  action: {
    flex: 1,
  },
});
