import { Redirect, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { PaymentCard } from "@/components/lend/payment-card";
import { PaymentMethodRow } from "@/components/lend/payment-method-row";
import { BankLogo } from "@/components/payment/bank-logo";
import { CardBrandBadge } from "@/components/payment/card-brand-badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { StepLayout } from "@/components/ui/step-layout";
import { FontSize, Spacing } from "@/constants/theme";
import { useAccount, useLedger } from "@/hooks/use-ledger";
import { useLendDraft } from "@/hooks/use-lend-draft";
import { usePaymentMethods } from "@/hooks/use-payment-methods";
import { useThemeColors } from "@/hooks/use-theme";
import { maskedNumber } from "@/lib/account";
import { findBank } from "@/lib/banks";
import { lendStepHeading, offerTerms, recipientName } from "@/lib/lend";
import { sendLoanOffer } from "@/lib/mock-offers";
import { firstName } from "@/lib/names";

export default function PaymentMethodScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { currency } = useLedger();
  const account = useAccount();
  const { card, bank } = usePaymentMethods();
  const { draft } = useLendDraft();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const terms = offerTerms(draft, currency);
  // Reached without agreed, signed terms (e.g. a deep link): start the offer again.
  if (!terms || !draft.signature) return <Redirect href="/lend" />;

  const recipientFirstName = firstName(recipientName(terms.recipient));
  const bankInfo = findBank(bank?.bankId);

  const send = async () => {
    setIsSending(true);
    setError(null);
    try {
      await sendLoanOffer(terms);
      router.replace("/lend/sent");
    } catch {
      setError("Couldn’t send the offer. Check your connection and try again.");
      setIsSending(false);
    }
  };

  return (
    <StepLayout
      navBar={{ title: "Offer loan", showMore: false }}
      heading={{ ...lendStepHeading(5), title: "How will you send the loan?" }}
      footer={
        <View style={styles.footer}>
          {error && (
            <Text accessibilityLiveRegion="polite" style={[styles.error, { color: colors.danger }]}>
              {error}
            </Text>
          )}
          <Button
            label={`Send offer to ${recipientFirstName}`}
            onPress={send}
            isLoading={isSending}
            disabled={!card}
          />
          <View style={styles.note}>
            <SymbolView
              name={{ ios: "info.circle", android: "info", web: "info" }}
              size={14}
              tintColor={colors.textSecondary}
            />
            <Text style={[styles.noteText, { color: colors.textSecondary }]}>
              Nothing leaves your account until {recipientFirstName} accepts.
            </Text>
          </View>
        </View>
      }
    >
      {card ? (
        <>
          <PaymentCard card={card} holderName={account.user.name} />
          <View style={styles.section}>
            <SectionHeader title="Cards" />
            <PaymentMethodRow
              leading={<CardBrandBadge brand={card.brand} />}
              title={account.user.name}
              detail={maskedNumber(card.last4)}
              isSelected
            />
          </View>
        </>
      ) : (
        <Button
          label="Add a debit card"
          variant="inverse"
          onPress={() => router.push("/link-payment/card")}
        />
      )}

      {bank && (
        <View style={styles.section}>
          <SectionHeader title="Banks" />
          <PaymentMethodRow
            leading={bankInfo ? <BankLogo bank={bankInfo} size={36} /> : null}
            title={`${bank.name} ${maskedNumber(bank.last4)}`}
            detail="For automatic repayments"
          />
        </View>
      )}
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.md,
  },
  footer: {
    gap: Spacing.md,
  },
  error: {
    fontSize: FontSize.footnote,
    textAlign: "center",
  },
  note: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs + 2,
  },
  noteText: {
    flexShrink: 1,
    fontSize: FontSize.footnote,
  },
});
