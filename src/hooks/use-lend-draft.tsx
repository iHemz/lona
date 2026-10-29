import { createContext, useContext, useState, type ReactNode } from "react";

import { EMPTY_DRAFT, type LoanOfferDraft } from "@/lib/lend";

type LendDraftContextValue = {
  draft: LoanOfferDraft;
  update: (changes: Partial<LoanOfferDraft>) => void;
};

const LendDraftContext = createContext<LendDraftContextValue>({
  draft: EMPTY_DRAFT,
  update: () => {},
});

/**
 * Holds the offer while it's built across the lend steps. Lives in the flow's layout, so it
 * starts empty each time the flow opens and is dropped when it closes.
 */
export function LendDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<LoanOfferDraft>(EMPTY_DRAFT);

  const value: LendDraftContextValue = {
    draft,
    update: (changes) => setDraft((current) => ({ ...current, ...changes })),
  };

  return <LendDraftContext.Provider value={value}>{children}</LendDraftContext.Provider>;
}

export function useLendDraft(): LendDraftContextValue {
  return useContext(LendDraftContext);
}
