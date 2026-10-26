import { StyleSheet, Text } from "react-native";

import { FontSize } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import type { FriendBalances } from "@/lib/friend-profile";
import { formatMoney } from "@/lib/money";

const activeLoans = (count: number) => `${count} active ${count === 1 ? "loan" : "loans"}`;

type BalanceSentenceProps = {
  name: string;
  balances: FriendBalances;
};

/** "John owes you £120 across 2 active loans. You owe John £100 across 1 active loan" */
export function BalanceSentence({ name, balances }: BalanceSentenceProps) {
  const colors = useThemeColors();
  const { owedToYou, owedToYouCount, youOwe, youOweCount } = balances;
  const money = (amount: typeof owedToYou) => formatMoney(amount, { trimWholeAmounts: true });

  const owesYou = owedToYouCount > 0;
  const youOweThem = youOweCount > 0;
  if (!owesYou && !youOweThem) {
    return (
      <Text style={[styles.sentence, { color: colors.textSecondary }]}>
        Nothing outstanding between you and {name}.
      </Text>
    );
  }

  const highlight = (color: string) => [styles.highlight, { color, textDecorationColor: color }];
  const owedStyle = highlight(colors.link);
  const oweStyle = highlight(colors.danger);

  return (
    <Text style={[styles.sentence, { color: colors.textSecondary }]}>
      {owesYou && (
        <>
          {name} owes you <Text style={owedStyle}>{money(owedToYou)}</Text> across{" "}
          <Text style={owedStyle}>{activeLoans(owedToYouCount)}</Text>
          {youOweThem ? ". " : "."}
        </>
      )}
      {youOweThem && (
        <>
          You owe {name} <Text style={oweStyle}>{money(youOwe)}</Text> across{" "}
          <Text style={oweStyle}>{activeLoans(youOweCount)}</Text>
        </>
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  sentence: {
    fontSize: FontSize.body,
    lineHeight: 36,
    textAlign: "center",
  },
  highlight: {
    fontSize: FontSize.title,
    fontWeight: "700",
    textDecorationLine: "underline",
    textDecorationStyle: "dashed",
  },
});
