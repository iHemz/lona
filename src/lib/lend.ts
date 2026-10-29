import type { PhoneContact } from "@/lib/contacts";
import { addDays, formatTimeAgo, type IsoDate } from "@/lib/dates";
import type { Friend, Instalment } from "@/lib/loans";
import { formatMoney, type Money } from "@/lib/money";
import { matchesName } from "@/lib/names";

/** The offer-to-lend steps, in order; the agreement is signed in a sheet over the terms. */
export const LEND_STEPS = [
  "Choose friend",
  "Choose repayment plan",
  "Draft loan terms",
  "Agreement",
  "Choose payment method",
] as const;

/** Props for `StepHeading` on step `step` (1-based) of the flow. */
export function lendStepHeading(step: number) {
  return { step, stepCount: LEND_STEPS.length, task: LEND_STEPS[step - 1] ?? "" };
}

/** Rows each section shows before "See all". */
export const RECIPIENT_PREVIEW_LIMIT = 4;

export type Recipient =
  { kind: "friend"; friend: Friend } | { kind: "contact"; contact: PhoneContact };

export type RecipientSectionKey = "friends" | "contacts";

export type RecipientSection = {
  key: RecipientSectionKey;
  title: string;
  data: Recipient[];
  /** True when rows are hidden behind "See all". */
  hasMore: boolean;
  /** How many people matched before the preview limit, to tell "none at all" from "no matches". */
  matchCount: number;
};

type SectionOptions = {
  friends: Friend[];
  contacts: PhoneContact[];
  query: string;
  expanded: ReadonlySet<RecipientSectionKey>;
};

/**
 * Friends on Lona, then phone contacts, both filtered by the search. Each shows a short preview
 * until expanded; a search shows every match.
 */
export function recipientSections({
  friends,
  contacts,
  query,
  expanded,
}: SectionOptions): RecipientSection[] {
  const isSearching = query.trim().length > 0;

  const section = (
    key: RecipientSectionKey,
    title: string,
    matches: Recipient[],
  ): RecipientSection => {
    const showAll = isSearching || expanded.has(key);
    const data = showAll ? matches : matches.slice(0, RECIPIENT_PREVIEW_LIMIT);
    return { key, title, data, hasMore: data.length < matches.length, matchCount: matches.length };
  };

  return [
    section(
      "friends",
      "On Lona",
      friends
        .filter((friend) => matchesName(friend.name, query))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((friend) => ({ kind: "friend", friend })),
    ),
    section(
      "contacts",
      "From your contacts",
      contacts
        .filter((contact) => matchesName(contact.name, query))
        .map((contact) => ({ kind: "contact", contact })),
    ),
  ];
}

export function recipientName(recipient: Recipient): string {
  return recipient.kind === "friend" ? recipient.friend.name : recipient.contact.name;
}

/** Unique across friends and contacts, for list keys. */
export function recipientKey(recipient: Recipient): string {
  return recipient.kind === "friend"
    ? `friend-${recipient.friend.id}`
    : `contact-${recipient.contact.id}`;
}

/** Same avatar colour key as the friend and contact rows, so a person keeps their colour. */
export function recipientColorKey(recipient: Recipient): string {
  return recipient.kind === "friend" ? recipient.friend.id : recipient.contact.id;
}

/** "Joined 3 months ago" for a friend on Lona, their phone number for a contact. */
export function recipientDetail(recipient: Recipient, today: IsoDate): string {
  return recipient.kind === "friend"
    ? `Joined ${formatTimeAgo(recipient.friend.joinedOn, today)}`
    : recipient.contact.phone;
}

/** Contacts aren't on Lona yet, so the offer reaches them as an invite. */
export function isOnLona(recipient: Recipient): boolean {
  return recipient.kind === "friend";
}

export type RepaymentPlan = "one-time" | "instalments";

/** The offer as it's built up across the steps; each field is filled in by one step. */
export type LoanOfferDraft = {
  recipient: Recipient | null;
  plan: RepaymentPlan | null;
  /** Null until a valid amount is entered. */
  amountMinor: number | null;
  dueDate: IsoDate | null;
  /** SVG path data for each stroke of the lender's signature. */
  signature: string[] | null;
};

export const EMPTY_DRAFT: LoanOfferDraft = {
  recipient: null,
  plan: null,
  amountMinor: null,
  dueDate: null,
  signature: null,
};

export type LoanOfferTerms = {
  recipient: Recipient;
  amount: Money;
  dueDate: IsoDate;
  schedule: Instalment[];
};

/** The agreed terms, or null while the amount (more than zero) or due date is missing. */
export function offerTerms(draft: LoanOfferDraft, currency: string): LoanOfferTerms | null {
  const { recipient, amountMinor, dueDate } = draft;
  if (!recipient || !amountMinor || amountMinor <= 0 || !dueDate) return null;
  return {
    recipient,
    amount: { amountMinor, currency },
    dueDate,
    // One-time payment is the only plan so far: the whole amount on the due date.
    schedule: [{ dueDate, amountMinor }],
  };
}

/** "£200.00 ×1" */
export function formatPaymentPlan(terms: LoanOfferTerms): string {
  const [first] = terms.schedule;
  const perPayment = first ? first.amountMinor : terms.amount.amountMinor;
  return `${formatMoney({ amountMinor: perPayment, currency: terms.amount.currency })} ×${terms.schedule.length}`;
}

// TODO: confirm limits with product; a year keeps a friendly loan from drifting indefinitely.
const MAX_LOAN_DAYS = 365;

/** The range a repayment date can be picked from: tomorrow up to a year away. */
export function dueDateBounds(today: IsoDate): { earliest: IsoDate; latest: IsoDate } {
  return { earliest: addDays(today, 1), latest: addDays(today, MAX_LOAN_DAYS) };
}

/** Quick picks for the repayment date. */
export function dueDatePresets(today: IsoDate): { label: string; date: IsoDate }[] {
  return [
    { label: "In 1 week", date: addDays(today, 7) },
    { label: "In 2 weeks", date: addDays(today, 14) },
    { label: "In 1 month", date: addDays(today, 30) },
  ];
}
