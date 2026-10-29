import { SymbolView } from "expo-symbols";
import type { ComponentRef, Ref } from "react";
import { StyleSheet, Text, View, type TextInput } from "react-native";

import { AmountPill, TermPill } from "@/components/lend/term-pill";
import { Avatar } from "@/components/ui/avatar";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type TermsSentenceProps = {
  recipientName: string;
  recipientColorKey: string;
  onChangeRecipient: () => void;
  amountText: string;
  onChangeAmount: (text: string) => void;
  isAmountInvalid: boolean;
  currencySymbol: string;
  amountRef?: Ref<ComponentRef<typeof TextInput>>;
  /** Formatted due date, or null before one is picked. */
  dueDateLabel: string | null;
  onPickDueDate: () => void;
};

/** "I am lending [friend] a sum of [amount]. This loan is to be paid back by [date]" */
export function TermsSentence({
  recipientName,
  recipientColorKey,
  onChangeRecipient,
  amountText,
  onChangeAmount,
  isAmountInvalid,
  currencySymbol,
  amountRef,
  dueDateLabel,
  onPickDueDate,
}: TermsSentenceProps) {
  const colors = useThemeColors();
  const wordStyle = [styles.word, { color: colors.textSecondary }];

  return (
    <View
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
    >
      <View style={styles.sentence}>
        <Text style={wordStyle}>I am lending</Text>
        <TermPill
          value={recipientName}
          placeholder="a friend"
          leading={<Avatar name={recipientName} colorKey={recipientColorKey} size={26} />}
          accessibilityLabel="Lending to"
          accessibilityHint="Choose someone else"
          onPress={onChangeRecipient}
        />
        <Text style={wordStyle}>a sum of</Text>
        <AmountPill
          ref={amountRef}
          value={amountText}
          onChangeText={onChangeAmount}
          symbol={currencySymbol}
          isInvalid={isAmountInvalid}
        />
        <Text style={wordStyle}>. This loan is to be paid back by</Text>
        <TermPill
          value={dueDateLabel}
          placeholder="pick a date"
          leading={
            <SymbolView
              name={{ ios: "calendar", android: "calendar_today", web: "calendar_today" }}
              size={18}
              tintColor={dueDateLabel ? colors.link : colors.textTertiary}
            />
          }
          accessibilityLabel="Pay back by"
          accessibilityHint="Pick the repayment date"
          onPress={onPickDueDate}
        />
      </View>

      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <SymbolView
          name={{ ios: "pencil", android: "edit", web: "edit" }}
          size={12}
          tintColor={colors.textSecondary}
        />
        <Text style={[styles.footerLabel, { color: colors.textSecondary }]}>
          Fill the blanks to build your offer
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  sentence: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  word: {
    fontSize: FontSize.heading,
    fontWeight: "600",
    lineHeight: 44,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs + 2,
    paddingVertical: Spacing.md,
  },
  footerLabel: {
    fontSize: FontSize.caption,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
});
