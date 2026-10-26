import { createContext, useContext, type ReactNode } from "react";

import { usePersistedState } from "@/hooks/use-persisted-state";

const STORAGE_KEY = "lona.tour.home.seen";

type HomeTourContextValue = {
  isLoaded: boolean;
  hasSeen: boolean;
  markSeen: () => void;
  /** Developer helper. */
  reset: () => void;
};

const HomeTourContext = createContext<HomeTourContextValue>({
  isLoaded: false,
  hasSeen: false,
  markSeen: () => {},
  reset: () => {},
});

const booleanCodec = {
  parse: (stored: string) => stored === "true",
  serialize: (value: boolean) => String(value),
};

/** Whether the one-time Home tour (coach marks) has been shown on this device. */
export function HomeTourProvider({ children }: { children: ReactNode }) {
  const [hasSeen, setHasSeen, isLoaded] = usePersistedState(STORAGE_KEY, false, booleanCodec);

  const value: HomeTourContextValue = {
    isLoaded,
    hasSeen,
    markSeen: () => setHasSeen(true),
    reset: () => setHasSeen(false),
  };

  return <HomeTourContext.Provider value={value}>{children}</HomeTourContext.Provider>;
}

export function useHomeTour(): HomeTourContextValue {
  return useContext(HomeTourContext);
}
