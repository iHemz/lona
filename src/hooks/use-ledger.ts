import type { Account } from "@/lib/account";
import type { ActivityEvent } from "@/lib/activity";
import { todayIsoDate, type IsoDate } from "@/lib/dates";
import type { Friend, Loan } from "@/lib/loans";
import { createMockLedger, MOCK_ACCOUNT } from "@/lib/mock-data";
import type { CurrencyCode } from "@/lib/money";

// TODO: replace with the user's home currency and real data once there's a backend.
const HOME_CURRENCY = "GBP";

export type Ledger = {
  friends: Friend[];
  loans: Loan[];
  activity: ActivityEvent[];
  today: IsoDate;
  currency: CurrencyCode;
};

export type FriendLedger = Omit<Ledger, "friends"> & {
  /** Null when no friend has this id (e.g. a stale link). */
  friend: Friend | null;
};

/** One friend and only the loans you share with them. */
export function useFriendLedger(friendId: string): FriendLedger {
  const { friends, loans, activity, ...rest } = useLedger();
  return {
    ...rest,
    friend: friends.find((candidate) => candidate.id === friendId) ?? null,
    loans: loans.filter((loan) => loan.friendId === friendId),
    activity: activity.filter((event) => event.friendId === friendId),
  };
}

/** The current user's friends and loans. Mock data for now. */
export function useLedger(): Ledger {
  const today = todayIsoDate();
  const { friends, loans, activity } = createMockLedger(today);
  return { friends, loans, activity, today, currency: HOME_CURRENCY };
}

/** The signed-in user's account. Mock data for now. */
export function useAccount(): Account {
  return MOCK_ACCOUNT;
}
