import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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

async function persist(completed: boolean): Promise<void> {
  try {
    if (completed) await AsyncStorage.setItem(STORAGE_KEY, "true");
    else await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Losing the flag only means onboarding shows again; don't block the user.
    console.warn("Couldn't save onboarding state", error);
  }
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    let isActive = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (isActive) setHasOnboarded(value === "true");
      })
      .catch((error) => console.warn("Couldn't read onboarding state", error))
      .finally(() => {
        if (isActive) setIsLoaded(true);
      });
    return () => {
      isActive = false;
    };
  }, []);

  const value: OnboardingContextValue = {
    isLoaded,
    hasOnboarded,
    completeOnboarding: () => {
      setHasOnboarded(true);
      void persist(true);
    },
    resetOnboarding: () => {
      setHasOnboarded(false);
      void persist(false);
    },
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  return useContext(OnboardingContext);
}
