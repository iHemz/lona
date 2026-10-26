import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BankLogo } from "@/components/payment/bank-logo";
import { BankReviewSheet } from "@/components/payment/bank-review-sheet";
import { SetupStepLayout } from "@/components/setup/setup-step-layout";
import { SearchBar } from "@/components/ui/search-bar";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useAccount } from "@/hooks/use-ledger";
import { usePaymentMethods } from "@/hooks/use-payment-methods";
import { useSavePaymentMethod } from "@/hooks/use-save-payment-method";
import { useThemeColors } from "@/hooks/use-theme";
import { searchBanks, type Bank } from "@/lib/banks";
import { connectBank } from "@/lib/mock-payments";

export default function ConnectBankScreen() {
  const colors = useThemeColors();
  const { user } = useAccount();
  const { card } = usePaymentMethods();
  const { saveBank } = useSavePaymentMethod();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Bank | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const banks = searchBanks(query);
  const isSearching = query.trim().length > 0;

  const connect = async () => {
    if (!selected) return;
    setIsConnecting(true);
    setError(null);
    try {
      const linked = await connectBank(selected);
      setSelected(null);
      saveBank(linked);
    } catch {
      setError(`We couldn’t connect to ${selected.name}. Try again in a moment.`);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <SetupStepLayout
      task="payment"
      title="Connect your bank"
      subtitle="So transfers and repayments happen automatically."
    >
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search"
        accessibilityLabel="Search banks"
      />

      {error && (
        <Text accessibilityLiveRegion="polite" style={[styles.note, { color: colors.danger }]}>
          {error}
        </Text>
      )}

      {banks.length > 0 ? (
        <View style={styles.grid}>
          {banks.map((bank) => {
            const isSelected = bank.id === selected?.id;
            return (
              <Pressable
                key={bank.id}
                accessibilityRole="button"
                accessibilityLabel={bank.name}
                accessibilityState={{ selected: isSelected }}
                onPress={() => setSelected(bank)}
                style={({ pressed }) => [
                  styles.tile,
                  {
                    backgroundColor: isSelected ? colors.linkSurface : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.surfaceBorder,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <BankLogo bank={bank} />
                <Text numberOfLines={2} style={[styles.bankName, { color: colors.text }]}>
                  {bank.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text style={[styles.note, { color: colors.textSecondary }]}>
          No banks match “{query.trim()}”.
        </Text>
      )}

      {!isSearching && (
        <Text style={[styles.note, { color: colors.textSecondary }]}>and more via search</Text>
      )}

      <BankReviewSheet
        // A fresh sheet per bank, so consent is never carried over to a different bank.
        key={selected?.id ?? "none"}
        bank={selected}
        accountHolder={user.name}
        cardLast4={card?.last4 ?? null}
        isConnecting={isConnecting}
        onConnect={connect}
        onClose={() => setSelected(null)}
      />
    </SetupStepLayout>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  tile: {
    // Three across, with room for the two gaps.
    flexBasis: "30%",
    flexGrow: 1,
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  bankName: {
    fontSize: FontSize.subhead,
    fontWeight: "600",
    textAlign: "center",
  },
  note: {
    fontSize: FontSize.subhead,
    textAlign: "center",
  },
});
