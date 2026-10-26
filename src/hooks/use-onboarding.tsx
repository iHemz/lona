import { createContext, useContext, type ReactNode } from "react";

import { usePersistedState } from "@/hooks/use-persisted-state";

// Not sensitive (just "has this device seen onboarding"), so AsyncStorage rather than secure-store.
const STORAGE_KEY = "lona.onboarding.completed";

type OnboardingContextValue = {
  /** False until the stored flag has been read; render nothing route-dependent before then. */
  isLoaded: boolean;
  hasOnboarded: boolean;
  completeOnboarding: () => void;
  /** Shows onboarding again on next render, e.g. from a developer setting. */
  resetOnboarding: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue>({
  isLoaded: false,
  hasOnboarded: false,
  completeOnboarding: () => {},
  resetOnboarding: () => {},
});

const booleanCodec = {
  parse: (stored: string) => stored === "true",
  serialize: (value: boolean) => String(value),
};

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [hasOnboarded, setHasOnboarded, isLoaded] = usePersistedState(
    STORAGE_KEY,
    false,
    booleanCodec,
  );

  const value: OnboardingContextValue = {
    isLoaded,
    hasOnboarded,
    completeOnboarding: () => setHasOnboarded(true),
    resetOnboarding: () => setHasOnboarded(false),
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  return useContext(OnboardingContext);
}
