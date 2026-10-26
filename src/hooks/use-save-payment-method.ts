import { useRouter } from "expo-router";

import { usePaymentMethods } from "@/hooks/use-payment-methods";
import { useSetup } from "@/hooks/use-setup";
import type { LinkedBank, LinkedCard } from "@/lib/mock-payments";

/**
 * Saves a newly linked card or bank, then moves the flow on: once both are linked the
 * "Link a card or bank" task is done and the user sees the confirmation; otherwise they go
 * back to choose the other method.
 */
export function useSavePaymentMethod() {
  const router = useRouter();
  const { card, bank, setCard, setBank } = usePaymentMethods();
  const { completeTask } = useSetup();

  const continueWith = (next: { card: LinkedCard | null; bank: LinkedBank | null }) => {
    if (next.card && next.bank) {
      completeTask("payment");
      router.replace("/link-payment/connected");
    } else {
      router.back();
    }
  };

  return {
    saveCard: (linked: LinkedCard) => {
      setCard(linked);
      continueWith({ card: linked, bank });
    },
    saveBank: (linked: LinkedBank) => {
      setBank(linked);
      continueWith({ card, bank: linked });
    },
  };
}
