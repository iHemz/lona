import type { IsoDate } from "@/lib/dates";
import {
  isActiveBorrowed,
  isActiveLent,
  isSettled,
  summariseLoansByFriend,
  totalOutstanding,
  type Friend,
  type FriendLoanSummary,
  type Loan,
} from "@/lib/loans";
import { sumMinor, type CurrencyCode, type Money } from "@/lib/money";
import { matchesName } from "@/lib/names";

export type LoanTab = "lent" | "borrowed" | "settled";

export const LOAN_TABS: { tab: LoanTab; label: string }[] = [
  { tab: "lent", label: "Lent out" },
  { tab: "borrowed", label: "Borrowed" },
  { tab: "settled", label: "Settled" },
];

export type LoanTabView = {
  rows: FriendLoanSummary[];
  /** Headline for the summary card, in the home currency. */
  totalLabel: string;
  total: Money;
  sectionTitle: string;
};

const INCLUDE: Record<LoanTab, (loan: Loan) => boolean> = {
  lent: isActiveLent,
  borrowed: isActiveBorrowed,
  settled: isSettled,
};

function tabTotal(loans: Loan[], tab: LoanTab, currency: CurrencyCode): Money {
  switch (tab) {
    case "lent":
      return totalOutstanding(loans, "lent", currency);
    case "borrowed":
      return totalOutstanding(loans, "borrowed", currency);
    case "settled": {
      const settled = loans.filter((loan) => isSettled(loan) && loan.currency === currency);
      return { amountMinor: sumMinor(settled.map((loan) => loan.principalMinor)), currency };
    }
  }
}

const TOTAL_LABEL: Record<LoanTab, string> = {
  lent: "Total owed to you",
  borrowed: "Total you owe",
  settled: "Total settled",
};

export function buildLoanTabs({
  loans,
  friends,
  today,
  currency,
}: {
  loans: Loan[];
  friends: Friend[];
  today: IsoDate;
  currency: CurrencyCode;
}): Record<LoanTab, LoanTabView> {
  const view = (tab: LoanTab): LoanTabView => ({
    rows: summariseLoansByFriend(loans, friends, today, INCLUDE[tab]),
    totalLabel: TOTAL_LABEL[tab],
    total: tabTotal(loans, tab, currency),
    sectionTitle: tab === "settled" ? "Settled loans" : "Active loans",
  });
  return { lent: view("lent"), borrowed: view("borrowed"), settled: view("settled") };
}

/** Case-insensitive match on the friend's name; an empty query matches everything. */
export function filterBySearch(rows: FriendLoanSummary[], query: string): FriendLoanSummary[] {
  return rows.filter((row) => matchesName(row.friend.name, query));
}
