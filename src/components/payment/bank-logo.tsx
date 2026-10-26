import { StyleSheet, Text, View } from "react-native";

import { AvatarText } from "@/constants/theme";
import type { Bank } from "@/lib/banks";

// A monogram in the bank's colour until the payment partner's logo assets are wired in.
// Decorative: the bank's name is always shown or announced alongside it.
export function BankLogo({ bank, size = 48 }: { bank: Bank; size?: number }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bank.color },
      ]}
    >
      <Text style={[styles.initial, { fontSize: size * 0.42 }]} maxFontSizeMultiplier={1.2}>
        {bank.name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    color: AvatarText,
    fontWeight: "800",
  },
});
