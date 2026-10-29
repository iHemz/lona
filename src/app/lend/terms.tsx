import { Redirect, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useRef, useState, type ComponentRef } from "react";
import { StyleSheet, Text, type TextInput } from "react-native";

import { AgreementSheet } from "@/components/lend/agreement-sheet";
import { DueDateSheet } from "@/components/lend/due-date-sheet";
import { TermChips, type TermChip } from "@/components/lend/term-chips";
import { TermsSentence } from "@/components/lend/terms-sentence";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StepLayout } from "@/components/ui/step-layout";
import { FontSize } from "@/constants/theme";
import { useLedger } from "@/hooks/use-ledger";
import { useLendDraft } from "@/hooks/use-lend-draft";
import { useThemeColors } from "@/hooks/use-theme";
import { formatFullDate } from "@/lib/dates";
import {
  isOnLona,
  lendStepHeading,
  offerTerms,
  recipientColorKey,
  recipientName,
} from "@/lib/lend";
import { currencySymbol, formatMoney, formatMoneyInput, parseMoneyInput } from "@/lib/money";
import { shortName } from "@/lib/names";

type ChipKey = "amount" | "recipient" | "due-date";

export default function LoanTermsScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { today, currency } = useLedger();
  const { draft, update } = useLendDraft();
  const amountRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [amountText, setAmountText] = useState(() =>
    draft.amountMinor ? formatMoneyInput({ amountMinor: draft.amountMinor, currency }) : "",
  );
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);

  if (!draft.recipient) return <Redirect href="/lend" />;

  const recipient = draft.recipient;
  const name = recipientName(recipient);
  const terms = offerTerms(draft, currency);
  const parsedAmount = parseMoneyInput(amountText, currency);
  // Zero isn't a loan, and anything unparseable (letters, too many decimals) can't be sent.
  const isAmountInvalid = amountText.length > 0 && !parsedAmount;

  const changeAmount = (text: string) => {
    setAmountText(text);
    update({ amountMinor: parseMoneyInput(text, currency) });
  };
  const changeRecipient = () => router.dismissTo("/lend");

  const pressChip = (key: ChipKey) => {
    if (key === "amount") amountRef.current?.focus();
    else if (key === "recipient") changeRecipient();
    else setIsDateOpen(true);
  };

  const chips: TermChip<ChipKey>[] = [];
  if (terms) {
    chips.push({
      key: "amount",
      leading: (
        <SymbolView
          name={{ ios: "banknote", android: "payments", web: "payments" }}
          size={16}
          tintColor={colors.link}
        />
      ),
      label: formatMoney(terms.amount),
    });
  }
  chips.push({
    key: "recipient",
    leading: <Avatar name={name} colorKey={recipientColorKey(recipient)} size={24} />,
    label: name,
    note: isOnLona(recipient) ? undefined : "Not on Lona? An invite will be sent",
  });
  if (draft.dueDate) {
    chips.push({
      key: "due-date",
      leading: (
        <SymbolView
          name={{ ios: "calendar", android: "calendar_today", web: "calendar_today" }}
          size={16}
          tintColor={colors.link}
        />
      ),
      label: `Pay back by ${formatFullDate(draft.dueDate)}`,
    });
  }

  return (
    <>
      <StepLayout
        navBar={{ title: "Offer loan", showMore: false }}
        heading={{ ...lendStepHeading(3), title: "What are the loan terms?" }}
        footer={
          <Button
            label="Confirm terms"
            disabled={!terms}
            onPress={() => setIsAgreementOpen(true)}
          />
        }
      >
        <TermsSentence
          recipientName={shortName(name) || name}
          recipientColorKey={recipientColorKey(recipient)}
          onChangeRecipient={changeRecipient}
          amountText={amountText}
          onChangeAmount={changeAmount}
          isAmountInvalid={isAmountInvalid}
          currencySymbol={currencySymbol(currency)}
          amountRef={amountRef}
          dueDateLabel={draft.dueDate ? formatFullDate(draft.dueDate, "short") : null}
          onPickDueDate={() => setIsDateOpen(true)}
        />
        {isAmountInvalid && (
          <Text accessibilityLiveRegion="polite" style={[styles.error, { color: colors.danger }]}>
            Enter an amount above {currencySymbol(currency)}0, like 200 or 200.50.
          </Text>
        )}
        <TermChips chips={chips} onPress={pressChip} />
      </StepLayout>

      <DueDateSheet
        visible={isDateOpen}
        value={draft.dueDate}
        today={today}
        onSelect={(dueDate) => update({ dueDate })}
        onClose={() => setIsDateOpen(false)}
      />
      {terms && (
        <AgreementSheet
          visible={isAgreementOpen}
          terms={terms}
          today={today}
          signature={draft.signature}
          onSign={(signature) => {
            update({ signature });
            setIsAgreementOpen(false);
            router.push("/lend/payment");
          }}
          onClose={() => setIsAgreementOpen(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  error: {
    fontSize: FontSize.footnote,
    marginTop: -8,
  },
});
