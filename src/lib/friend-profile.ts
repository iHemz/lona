import { daysBetween, formatShortDate, type IsoDate } from "@/lib/dates";
import {
  isActiveBorrowed,
  isActiveLent,
  isInstalmentPlan,
  isSettled,
  nextPayment,
  outstandingMinor,
  paidInstalmentCount,
  type Loan,
  type LoanDirection,
  type StatusTone,
} from "@/lib/loans";
import { formatMoney, sumMinor, type CurrencyCode, type Money } from "@/lib/money";

function total(loans: Loan[], currency: CurrencyCode, amount: (loan: Loan) => number): Money {
  const matching = loans.filter((loan) => loan.currency === currency);
  return { amountMinor: sumMinor(matching.map(amount)), currency };
}

export type FriendBalances = {
  owedToYou: Money;
  owedToYouCount: number;
  youOwe: Money;
  youOweCount: number;
};

export function friendBalances(loans: Loan[], currency: CurrencyCode): FriendBalances {
  const lent = loans.filter(isActiveLent);
  const borrowed = loans.filter(isActiveBorrowed);
  return {
    owedToYou: total(lent, currency, outstandingMinor),
    owedToYouCount: lent.length,
    youOwe: total(borrowed, currency, outstandingMinor),
    youOweCount: borrowed.length,
  };
}

export type ActiveLoanItem = {
  loan: Loan;
  status: { label: string; tone: StatusTone };
  outstanding: Money;
  principal: Money;
  /** Only for instalment plans. */
  instalments: { paid: number; total: number } | null;
};

/** "One-off • due 8 Aug", "Next £50 • missed 26 Jul". */
export function describeActiveLoan(
  loan: Loan,
  today: IsoDate,
): { label: string; tone: StatusTone } {
  const plan = isInstalmentPlan(loan) ? "Instalments" : "One-off";
  const next = nextPayment(loan);
  if (!next) return { label: plan, tone: "neutral" };

  const isMissed = daysBetween(today, next.dueDate) < 0;
  const prefix = isInstalmentPlan(loan)
    ? `Next ${formatMoney(next.amount, { trimWholeAmounts: true })}`
    : plan;
  const when = `${isMissed ? "missed" : "due"} ${formatShortDate(next.dueDate)}`;
  return { label: `${prefix} • ${when}`, tone: isMissed ? "danger" : "success" };
}

/** Unsettled loans, soonest next payment first. */
export function activeLoanItems(loans: Loan[], today: IsoDate): ActiveLoanItem[] {
  const nextDue = (loan: Loan) => nextPayment(loan)?.dueDate ?? "9999-12-31";
  return loans
    .filter((loan) => !isSettled(loan))
    .sort((a, b) => nextDue(a).localeCompare(nextDue(b)))
    .map((loan) => ({
      loan,
      status: describeActiveLoan(loan, today),
      outstanding: { amountMinor: outstandingMinor(loan), currency: loan.currency },
      principal: { amountMinor: loan.principalMinor, currency: loan.currency },
      instalments: isInstalmentPlan(loan)
        ? { paid: paidInstalmentCount(loan), total: loan.schedule.length }
        : null,
    }));
}

export type SettledLoanItem = {
  loan: Loan;
  settledOn: IsoDate | null;
  /** "paid in full" or "in 3 instalments". */
  detail: string;
};

/** Settled loans, most recently settled first. */
export function settledLoanItems(loans: Loan[]): SettledLoanItem[] {
  return loans
    .filter(isSettled)
    .map((loan) => ({
      loan,
      settledOn: loan.settledOn ?? null,
      detail: isInstalmentPlan(loan) ? `in ${loan.schedule.length} instalments` : "paid in full",
    }))
    .sort((a, b) => (b.settledOn ?? "").localeCompare(a.settledOn ?? ""));
}

export type RepaymentRecord = {
  /** Loans you lent them that they've fully repaid, and when it's known. */
  repaid: number;
  onTime: number;
  /** 0–1, or null when nothing has been repaid yet. */
  onTimeRate: number | null;
};

/** How reliably the friend has repaid what you lent them: settled by the final due date. */
export function repaymentRecord(loans: Loan[]): RepaymentRecord {
  const repaid = loans.filter(
    (loan) => loan.direction === "lent" && isSettled(loan) && loan.settledOn,
  );
  const onTime = repaid.filter((loan) => {
    const finalDue = loan.schedule.at(-1)?.dueDate;
    return !finalDue || (loan.settledOn ?? "") <= finalDue;
  });
  return {
    repaid: repaid.length,
    onTime: onTime.length,
    onTimeRate: repaid.length > 0 ? onTime.length / repaid.length : null,
  };
}

export type LifetimeTotals = {
  lent: Money;
  borrowed: Money;
  settledCount: number;
};

export function lifetimeTotals(loans: Loan[], currency: CurrencyCode): LifetimeTotals {
  const principal = (direction: LoanDirection) =>
    total(
      loans.filter((loan) => loan.direction === direction),
      currency,
      (loan) => loan.principalMinor,
    );
  return {
    lent: principal("lent"),
    borrowed: principal("borrowed"),
    settledCount: loans.filter(isSettled).length,
  };
}
