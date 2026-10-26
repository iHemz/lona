import type { Friend } from "@/lib/loans";

/** The signed-in user's own account details. Comes from the backend eventually. */
export type Account = {
  user: Friend;
  /** Identity verified (ID check passed). */
  isVerified: boolean;
  contactVerified: boolean;
  card: { last4: string } | null;
  bank: { name: string; last4: string } | null;
};

/** "···· 4242" */
export function maskedNumber(last4: string): string {
  return `···· ${last4}`;
}
