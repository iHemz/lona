import { StyleSheet, Text, type StyleProp, type TextStyle } from "react-native";

import { FontSize } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { splitFormattedMoney, type Money } from "@/lib/money";

type LargeMoneyProps = {
  money: Money;
  style?: StyleProp<TextStyle>;
};

/** A headline amount with the minor part de-emphasised: "£460" + ".54". */
export function LargeMoney({ money, style }: LargeMoneyProps) {
  const colors = useThemeColors();
  const { whole, fraction } = splitFormattedMoney(money);

  return (
    <Text style={[styles.whole, { color: colors.text }, style]} maxFontSizeMultiplier={1.6}>
      {whole}
      <Text style={[styles.fraction, { color: colors.textTertiary }]}>{fraction}</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  whole: {
    fontSize: FontSize.balance,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    letterSpacing: -0.5,
  },
  fraction: {
    fontSize: FontSize.balanceFraction,
    fontWeight: "600",
  },
});
