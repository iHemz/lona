import { todayIsoDate, type IsoDate } from "@/lib/dates";
import type { Friend, Loan } from "@/lib/loans";
import { createMockLedger } from "@/lib/mock-data";
import type { CurrencyCode } from "@/lib/money";

// TODO: replace with the user's home currency and real data once there's a backend.
const HOME_CURRENCY = "GBP";

export type Ledger = {
  friends: Friend[];
  loans: Loan[];
  today: IsoDate;
  currency: CurrencyCode;
};

export type FriendLedger = Omit<Ledger, "friends"> & {
  /** Null when no friend has this id (e.g. a stale link). */
  friend: Friend | null;
};

/** One friend and only the loans you share with them. */
export function useFriendLedger(friendId: string): FriendLedger {
  const { friends, loans, ...rest } = useLedger();
  return {
    ...rest,
    friend: friends.find((candidate) => candidate.id === friendId) ?? null,
    loans: loans.filter((loan) => loan.friendId === friendId),
  };
}

/** The current user's friends and loans. Mock data for now. */
export function useLedger(): Ledger {
  const today = todayIsoDate();
  const { friends, loans } = createMockLedger(today);
  return { friends, loans, today, currency: HOME_CURRENCY };
}
