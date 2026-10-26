import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { PaymentOption } from "@/components/payment/payment-option";
import { PrivacyNote } from "@/components/setup/privacy-note";
import { SetupStepLayout } from "@/components/setup/setup-step-layout";
import { Button } from "@/components/ui/button";
import { Spacing } from "@/constants/theme";
import { usePaymentMethods } from "@/hooks/use-payment-methods";

export default function ChoosePaymentMethodScreen() {
  const router = useRouter();
  const { card, bank } = usePaymentMethods();

  const addCard = () => router.push("/link-payment/card");
  const connectBank = () => router.push("/link-payment/bank");

  // The main button always offers whichever method is still missing.
  const next = !card
    ? { label: "Add a debit card", onPress: addCard }
    : !bank
      ? { label: "Connect your bank", onPress: connectBank }
      : { label: "Continue", onPress: () => router.replace("/link-payment/connected") };

  return (
    <SetupStepLayout
      task="payment"
      title="How should money move?"
      subtitle="Add both eventually. Start with whichever you need first."
      footer={<Button label={next.label} onPress={next.onPress} />}
    >
      <View style={styles.options}>
        <PaymentOption
          title="Debit card"
          description="To send money to a friend"
          icon={{ ios: "creditcard", android: "credit_card", web: "credit_card" }}
          benefit="Transfers arrive in seconds. No fee."
          benefitIcon={{ ios: "bolt", android: "bolt", web: "bolt" }}
          isLinked={card !== null}
          onPress={addCard}
        />
        <PaymentOption
          title="Bank account"
          description="To collect repayments from friends"
          icon={{ ios: "building.columns", android: "account_balance", web: "account_balance" }}
          benefit="Repays automatically"
          benefitIcon={{ ios: "arrow.triangle.2.circlepath", android: "sync", web: "sync" }}
          isLinked={bank !== null}
          onPress={connectBank}
        />
      </View>
      <PrivacyNote>
        Handled by our FCA-regulated payment partner. Lona never sees your login.
      </PrivacyNote>
    </SetupStepLayout>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: Spacing.md,
  },
});
