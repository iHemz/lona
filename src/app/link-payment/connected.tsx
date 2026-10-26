import { useRouter } from "expo-router";

import { LinkedMethods } from "@/components/payment/linked-methods";
import { SetupChecklist } from "@/components/setup/setup-checklist";
import { SetupCompleteLayout } from "@/components/setup/setup-complete-layout";
import { Button } from "@/components/ui/button";
import { useBackToClose } from "@/hooks/use-back-to-close";
import { useCloseModal } from "@/hooks/use-close-modal";
import { usePaymentMethods } from "@/hooks/use-payment-methods";
import { useSetup } from "@/hooks/use-setup";

export default function PaymentConnectedScreen() {
  const router = useRouter();
  const { card, bank } = usePaymentMethods();
  const { completed } = useSetup();
  const close = useCloseModal("/");
  // Android back leaves the flow rather than returning to the bank list.
  useBackToClose(close);

  return (
    <SetupCompleteLayout
      title="You’re connected!"
      subtitle="Nothing has been charged."
      actions={
        <>
          <Button
            label="Turn on reminders"
            icon={{ ios: "alarm", android: "alarm", web: "alarm" }}
            onPress={() => router.replace("/reminders")}
          />
          <Button label="Later" variant="secondary" onPress={close} />
        </>
      }
    >
      <LinkedMethods card={card} bank={bank} />
      <SetupChecklist completed={completed} />
    </SetupCompleteLayout>
  );
}
