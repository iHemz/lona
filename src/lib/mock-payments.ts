import type { Bank } from "@/lib/banks";
import { detectCardBrand, type CardBrand, type CardDetails } from "@/lib/card";
import { stableIndex } from "@/lib/names";

// Stand-in for the FCA-regulated payment partner. In production the card is entered in the
// partner's secure fields (tokenised; never touches Lona's servers) and the bank connects via
// Open Banking in the bank's own app. Only the non-sensitive fields below are ever kept.

export type LinkedCard = {
  brand: CardBrand;
  last4: string;
  expiry: string;
};

export type LinkedBank = {
  bankId: string;
  name: string;
  last4: string;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function addDebitCard(details: CardDetails): Promise<LinkedCard> {
  await wait(800);
  return {
    brand: detectCardBrand(details.number),
    last4: details.number.slice(-4),
    expiry: details.expiry,
  };
}

/** Simulates the Open Banking hand-off to the bank and back. */
export async function connectBank(bank: Bank): Promise<LinkedBank> {
  await wait(1500);
  // Stable per bank so the mock account number doesn't change between runs.
  const last4 = String(1000 + stableIndex(bank.id, 9000));
  return { bankId: bank.id, name: bank.name, last4 };
}
