import type { PhoneContact } from "@/lib/contacts";
import type { Friend } from "@/lib/loans";
import { matchesName } from "@/lib/names";

// TODO: replace with the real step list once the rest of the offer-to-lend flow is designed.
export const LEND_STEP_COUNT = 4;

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
