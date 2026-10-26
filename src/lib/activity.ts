import {
  addDays,
  formatShortDate,
  formatWeekdayDate,
  localDay,
  type IsoDate,
  type IsoDateTime,
} from "@/lib/dates";
import type { Friend } from "@/lib/loans";
import { formatMoney, type Money } from "@/lib/money";
import { firstName } from "@/lib/names";

export type ActivityKind =
  | "offerSent"
  | "termsAccepted"
  | "paymentSent"
  | "paymentReceived"
  | "paymentDueSoon"
  | "paymentMissed";

/** Something that happened between the user and a friend. Comes from the backend eventually. */
export type ActivityEvent = {
  id: string;
  kind: ActivityKind;
  friendId: string;
  loanId?: string;
  at: IsoDateTime;
  amount?: Money;
  /** For due-soon and missed payments. */
  dueDate?: IsoDate;
  /** For payments: whether this payment settled the loan. */
  settlesLoan?: boolean;
  isRead: boolean;
};

export type ActivityFilter = "all" | "payments" | "updates";

export const ACTIVITY_FILTERS: { value: ActivityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "payments", label: "Payments" },
  { value: "updates", label: "Updates" },
];

const PAYMENT_KINDS: ActivityKind[] = ["paymentSent", "paymentReceived"];

export function matchesFilter(event: ActivityEvent, filter: ActivityFilter): boolean {
  if (filter === "all") return true;
  const isPayment = PAYMENT_KINDS.includes(event.kind);
  return filter === "payments" ? isPayment : !isPayment;
}

export function unreadCount(events: ActivityEvent[]): number {
  return events.filter((event) => !event.isRead).length;
}

/** "Waiting on Sam" / "loan offer sent", "Benji's £30 is due soon" / "due 20 Jul". */
export function describeActivity(
  event: ActivityEvent,
  friend: Friend,
): { title: string; detail: string } {
  const name = firstName(friend.name);
  const amount = event.amount ? formatMoney(event.amount, { trimWholeAmounts: true }) : null;
  const due = event.dueDate ? formatShortDate(event.dueDate) : null;

  switch (event.kind) {
    case "offerSent":
      return { title: `Waiting on ${name}`, detail: "loan offer sent" };
    case "termsAccepted":
      return {
        title: `${name} accepted your terms`,
        detail: amount ? `${amount} sent` : "loan started",
      };
    case "paymentSent":
      return {
        title: `You paid ${name}`,
        detail: event.settlesLoan ? "loan settled" : `${amount ?? "payment"} paid`,
      };
    case "paymentReceived":
      return {
        title: `${name} paid you`,
        detail: event.settlesLoan ? "loan settled" : `${amount ?? "payment"} received`,
      };
    case "paymentDueSoon":
      return {
        title: amount ? `${name}’s ${amount} is due soon` : `${name}’s payment is due soon`,
        detail: due ? `due ${due}` : "due soon",
      };
    case "paymentMissed":
      return {
        title: `${name} missed a payment`,
        detail: [amount, due && `was due ${due}`].filter(Boolean).join(" · ") || "overdue",
      };
  }
}

export type ActivityDay = { day: IsoDate; title: string; data: ActivityEvent[] };

/** Newest first, grouped by local day: "Today", "Yesterday", then "Fri 12 July". */
export function groupByDay(events: ActivityEvent[], today: IsoDate): ActivityDay[] {
  const sorted = [...events].sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
  const days = new Map<IsoDate, ActivityEvent[]>();
  for (const event of sorted) {
    const day = localDay(event.at);
    days.set(day, [...(days.get(day) ?? []), event]);
  }

  const titleFor = (day: IsoDate) => {
    if (day === today) return "Today";
    if (day === addDays(today, -1)) return "Yesterday";
    return formatWeekdayDate(day);
  };
  return [...days].map(([day, data]) => ({ day, title: titleFor(day), data }));
}
