import { daysBetween, formatShortDate, type IsoDate } from "@/lib/dates";
import { sumMinor, type CurrencyCode, type Money } from "@/lib/money";

export type Friend = {
  id: string;
  name: string;
};

export type Instalment = {
  dueDate: IsoDate;
  amountMinor: number;
};

export type LoanDirection = "lent" | "borrowed";

export type Loan = {
  id: string;
  friendId: string;
  direction: LoanDirection;
  currency: CurrencyCode;
  principalMinor: number;
  repaidMinor: number;
  createdOn: IsoDate;
  /** One entry for a single repayment, several for an instalment plan. Sums to the principal. */
  schedule: Instalment[];
};

/** Days ahead within which a payment is flagged as "due soon". */
export const DUE_SOON_DAYS = 7;

export function outstandingMinor(loan: Loan): number {
  return Math.max(loan.principalMinor - loan.repaidMinor, 0);
}

export function isSettled(loan: Loan): boolean {
  return loan.repaidMinor >= loan.principalMinor;
}

export function isInstalmentPlan(loan: Loan): boolean {
  return loan.schedule.length > 1;
}

type ScheduledInstalment = Instalment & { startMinor: number; endMinor: number };

function withRunningTotals(schedule: Instalment[]): ScheduledInstalment[] {
  let runningTotal = 0;
  return schedule.map((instalment) => {
    const startMinor = runningTotal;
    runningTotal += instalment.amountMinor;
    return { ...instalment, startMinor, endMinor: runningTotal };
  });
}

/** Instalments not yet fully covered by repayments, in schedule order. */
function unpaidInstalments(loan: Loan): ScheduledInstalment[] {
  return withRunningTotals(loan.schedule).filter(
    (instalment) => instalment.endMinor > loan.repaidMinor,
  );
}

export type NextPayment = {
  dueDate: IsoDate;
  /** What's left on the instalment, accounting for any partial payment towards it. */
  amount: Money;
};

export function nextPayment(loan: Loan): NextPayment | null {
  const [next] = unpaidInstalments(loan);
  if (!next) return null;
  return {
    dueDate: next.dueDate,
    amount: {
      amountMinor: next.endMinor - Math.max(loan.repaidMinor, next.startMinor),
      currency: loan.currency,
    },
  };
}

export function overdueInstalmentCount(loan: Loan, today: IsoDate): number {
  return unpaidInstalments(loan).filter((instalment) => daysBetween(today, instalment.dueDate) < 0)
    .length;
}

export type ProgressSegment = {
  /** Cumulative amount at the end of this segment, for the tick label. */
  endMinor: number;
  /** 0–1; overpayment is clamped to 1. */
  fillRatio: number;
};

export function scheduleProgress(loan: Loan): ProgressSegment[] {
  return withRunningTotals(loan.schedule).map(({ startMinor, endMinor, amountMinor }) => {
    const fillRatio =
      amountMinor <= 0
        ? Number(loan.repaidMinor >= endMinor)
        : Math.min(Math.max((loan.repaidMinor - startMinor) / amountMinor, 0), 1);
    return { endMinor, fillRatio };
  });
}

export function totalOutstanding(
  loans: Loan[],
  direction: LoanDirection,
  currency: CurrencyCode,
): Money {
  const matching = loans.filter(
    (loan) => loan.direction === direction && loan.currency === currency,
  );
  return { amountMinor: sumMinor(matching.map(outstandingMinor)), currency };
}

/** The active lent loan with the most still owed; ties go to the soonest next payment. */
export function pickFeaturedLoan(loans: Loan[], currency: CurrencyCode): Loan | null {
  const candidates = loans.filter(
    (loan) => loan.direction === "lent" && loan.currency === currency && !isSettled(loan),
  );
  const nextDue = (loan: Loan) => nextPayment(loan)?.dueDate ?? "9999-12-31";
  const [featured] = [...candidates].sort(
    (a, b) => outstandingMinor(b) - outstandingMinor(a) || nextDue(a).localeCompare(nextDue(b)),
  );
  return featured ?? null;
}

export type DueStatus =
  | { kind: "late"; count: number }
  | { kind: "dueSoon"; inDays: number }
  | { kind: "scheduled"; date: IsoDate; isNextOfSeveral: boolean }
  | { kind: "none" };

export type FriendLoanSummary = {
  friend: Friend;
  loanCount: number;
  repaid: Money;
  principal: Money;
  dueStatus: DueStatus;
  latestCreatedOn: IsoDate;
};

function dueStatusFor(loans: Loan[], today: IsoDate): DueStatus {
  const lateCount = sumMinor(loans.map((loan) => overdueInstalmentCount(loan, today)));
  if (lateCount > 0) return { kind: "late", count: lateCount };

  const nextDates = loans
    .map((loan) => nextPayment(loan)?.dueDate)
    .filter((date): date is IsoDate => date !== undefined)
    .sort();
  const soonest = nextDates[0];
  if (!soonest) return { kind: "none" };

  const inDays = daysBetween(today, soonest);
  if (inDays <= DUE_SOON_DAYS) return { kind: "dueSoon", inDays };
  return { kind: "scheduled", date: soonest, isNextOfSeveral: loans.length > 1 };
}

/**
 * Groups active lent loans per friend (and currency, so amounts are never mixed),
 * most recently created first.
 */
export function summariseLentLoansByFriend(
  loans: Loan[],
  friends: Friend[],
  today: IsoDate,
): FriendLoanSummary[] {
  const groups = new Map<string, Loan[]>();
  for (const loan of loans) {
    if (loan.direction !== "lent" || isSettled(loan)) continue;
    const key = `${loan.friendId}:${loan.currency}`;
    groups.set(key, [...(groups.get(key) ?? []), loan]);
  }

  const summaries: FriendLoanSummary[] = [];
  for (const group of groups.values()) {
    const [first] = group;
    const friend = friends.find((candidate) => candidate.id === first?.friendId);
    if (!first || !friend) continue;
    summaries.push({
      friend,
      loanCount: group.length,
      repaid: {
        amountMinor: sumMinor(group.map((loan) => loan.repaidMinor)),
        currency: first.currency,
      },
      principal: {
        amountMinor: sumMinor(group.map((loan) => loan.principalMinor)),
        currency: first.currency,
      },
      dueStatus: dueStatusFor(group, today),
      latestCreatedOn:
        group
          .map((loan) => loan.createdOn)
          .sort()
          .at(-1) ?? first.createdOn,
    });
  }

  return summaries.sort((a, b) => b.latestCreatedOn.localeCompare(a.latestCreatedOn));
}

export type StatusTone = "danger" | "warning" | "success" | "neutral";

export function describeDueStatus(status: DueStatus): { label: string; tone: StatusTone } | null {
  switch (status.kind) {
    case "late":
      return { label: `${status.count} late`, tone: "danger" };
    case "dueSoon": {
      const label =
        status.inDays === 0
          ? "due today"
          : status.inDays === 1
            ? "due tomorrow"
            : `due in ${status.inDays} days`;
      return { label, tone: "warning" };
    }
    case "scheduled":
      return {
        label: `${status.isNextOfSeveral ? "next" : "due"} on ${formatShortDate(status.date)}`,
        tone: "success",
      };
    case "none":
      return null;
  }
}

export function pluraliseLoans(count: number): string {
  return `${count} ${count === 1 ? "loan" : "loans"}`;
}
