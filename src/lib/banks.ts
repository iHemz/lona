export type Bank = {
  id: string;
  name: string;
  /** Brand colour for the monogram until the payment partner's logos are wired in. */
  color: string;
  /** Shown first, before searching. */
  isPopular?: boolean;
};

export const BANKS: Bank[] = [
  { id: "starling", name: "Starling", color: "#3B1C4A", isPopular: true },
  { id: "lloyds", name: "Lloyds", color: "#006A4D", isPopular: true },
  { id: "barclays", name: "Barclays", color: "#00AEEF", isPopular: true },
  { id: "hsbc", name: "HSBC", color: "#DB0011", isPopular: true },
  { id: "revolut", name: "Revolut", color: "#191C1F", isPopular: true },
  { id: "natwest", name: "NatWest", color: "#5A287D", isPopular: true },
  { id: "monzo", name: "Monzo", color: "#14233C" },
  { id: "santander", name: "Santander", color: "#EC0000" },
  { id: "nationwide", name: "Nationwide", color: "#1B1464" },
  { id: "halifax", name: "Halifax", color: "#005EB8" },
  { id: "tsb", name: "TSB", color: "#1D4F91" },
  { id: "metro", name: "Metro Bank", color: "#C8102E" },
  { id: "first-direct", name: "first direct", color: "#000000" },
  { id: "chase", name: "Chase UK", color: "#117ACA" },
  { id: "virgin-money", name: "Virgin Money", color: "#CC0000" },
  { id: "coop", name: "Co-operative Bank", color: "#00B1E7" },
  { id: "bank-of-scotland", name: "Bank of Scotland", color: "#1E3264" },
  { id: "rbs", name: "Royal Bank of Scotland", color: "#0A2F5C" },
];

export function findBank(id: string | undefined): Bank | null {
  return BANKS.find((bank) => bank.id === id) ?? null;
}

/** Popular banks with no query; otherwise case-insensitive name matches. */
export function searchBanks(query: string): Bank[] {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return BANKS.filter((bank) => bank.isPopular);
  return BANKS.filter((bank) => bank.name.toLocaleLowerCase().includes(needle));
}
