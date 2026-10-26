import { createContext, useContext, type ReactNode } from "react";

import { usePersistedState } from "@/hooks/use-persisted-state";
import type { LinkedBank, LinkedCard } from "@/lib/mock-payments";

// Only brand, last four and expiry for cards and the bank name/last four for accounts; never a
// full card number, CVC or bank login.
const STORAGE_KEY = "lona.payment-methods";

type PaymentMethods = {
  card: LinkedCard | null;
  bank: LinkedBank | null;
};

type PaymentMethodsContextValue = PaymentMethods & {
  isLoaded: boolean;
  setCard: (card: LinkedCard) => void;
  setBank: (bank: LinkedBank) => void;
  /** Developer helper. */
  reset: () => void;
};

const EMPTY: PaymentMethods = { card: null, bank: null };

const PaymentMethodsContext = createContext<PaymentMethodsContextValue>({
  ...EMPTY,
  isLoaded: false,
  setCard: () => {},
  setBank: () => {},
  reset: () => {},
});

const codec = {
  parse: (stored: string): PaymentMethods => ({ ...EMPTY, ...JSON.parse(stored) }),
  serialize: (methods: PaymentMethods) => JSON.stringify(methods),
};

export function PaymentMethodsProvider({ children }: { children: ReactNode }) {
  const [methods, setMethods, isLoaded] = usePersistedState(STORAGE_KEY, EMPTY, codec);

  const value: PaymentMethodsContextValue = {
    ...methods,
    isLoaded,
    setCard: (card) => setMethods((current) => ({ ...current, card })),
    setBank: (bank) => setMethods((current) => ({ ...current, bank })),
    reset: () => setMethods(EMPTY),
  };

  return <PaymentMethodsContext.Provider value={value}>{children}</PaymentMethodsContext.Provider>;
}

export function usePaymentMethods(): PaymentMethodsContextValue {
  return useContext(PaymentMethodsContext);
}
