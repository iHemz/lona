import type { LoanOfferTerms } from "@/lib/lend";

// Stand-in for the backend. A real send would create a pending loan, notify the friend (or text
// an invite to a contact) and hold the money until they accept; nothing moves before then.

export type SentOffer = {
  id: string;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendLoanOffer(_terms: LoanOfferTerms): Promise<SentOffer> {
  await wait(1000);
  return { id: `offer-${Date.now()}` };
}
