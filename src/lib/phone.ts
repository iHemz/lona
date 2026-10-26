export type Country = {
  /** ISO 3166-1 alpha-2. */
  code: string;
  name: string;
  /** Without the "+". */
  dialCode: string;
  flag: string;
  /** How the national number is grouped for display, e.g. [4, 3, 3] → "7700 900 000". */
  groups: number[];
  /** Valid national-number lengths (digits, without the trunk prefix). */
  lengths: number[];
  /** Domestic prefix people often type first (e.g. "0" in the UK), dropped for international use. */
  trunkPrefix?: string;
};

// A short list to start with; a full list (or libphonenumber) can replace it later.
export const COUNTRIES: Country[] = [
  {
    code: "GB",
    name: "United Kingdom",
    dialCode: "44",
    flag: "🇬🇧",
    groups: [4, 3, 3],
    lengths: [10],
    trunkPrefix: "0",
  },
  {
    code: "IE",
    name: "Ireland",
    dialCode: "353",
    flag: "🇮🇪",
    groups: [2, 3, 4],
    lengths: [9],
    trunkPrefix: "0",
  },
  {
    code: "US",
    name: "United States",
    dialCode: "1",
    flag: "🇺🇸",
    groups: [3, 3, 4],
    lengths: [10],
  },
  { code: "CA", name: "Canada", dialCode: "1", flag: "🇨🇦", groups: [3, 3, 4], lengths: [10] },
  {
    code: "NG",
    name: "Nigeria",
    dialCode: "234",
    flag: "🇳🇬",
    groups: [3, 3, 4],
    lengths: [10],
    trunkPrefix: "0",
  },
  {
    code: "GH",
    name: "Ghana",
    dialCode: "233",
    flag: "🇬🇭",
    groups: [2, 3, 4],
    lengths: [9],
    trunkPrefix: "0",
  },
  {
    code: "KE",
    name: "Kenya",
    dialCode: "254",
    flag: "🇰🇪",
    groups: [3, 3, 3],
    lengths: [9],
    trunkPrefix: "0",
  },
  {
    code: "ZA",
    name: "South Africa",
    dialCode: "27",
    flag: "🇿🇦",
    groups: [2, 3, 4],
    lengths: [9],
    trunkPrefix: "0",
  },
  {
    code: "FR",
    name: "France",
    dialCode: "33",
    flag: "🇫🇷",
    groups: [1, 2, 2, 2, 2],
    lengths: [9],
    trunkPrefix: "0",
  },
  {
    code: "DE",
    name: "Germany",
    dialCode: "49",
    flag: "🇩🇪",
    groups: [3, 4, 4],
    lengths: [10, 11],
    trunkPrefix: "0",
  },
  { code: "ES", name: "Spain", dialCode: "34", flag: "🇪🇸", groups: [3, 3, 3], lengths: [9] },
  {
    code: "IN",
    name: "India",
    dialCode: "91",
    flag: "🇮🇳",
    groups: [5, 5],
    lengths: [10],
    trunkPrefix: "0",
  },
  {
    code: "AU",
    name: "Australia",
    dialCode: "61",
    flag: "🇦🇺",
    groups: [3, 3, 3],
    lengths: [9],
    trunkPrefix: "0",
  },
];

export const DEFAULT_COUNTRY: Country = COUNTRIES[0]!;

/**
 * Digits only, capped at the longest valid length, without a leading trunk prefix or the
 * country's own international prefix (e.g. a pasted "+44 7700…" or "0044 7700…").
 */
export function normaliseNationalNumber(input: string, country: Country): string {
  const trimmed = input.trim();
  let digits = trimmed.replace(/\D/g, "");
  const isInternational = trimmed.startsWith("+") || digits.startsWith("00");
  if (isInternational) {
    digits = digits.replace(/^00/, "");
    if (digits.startsWith(country.dialCode)) digits = digits.slice(country.dialCode.length);
  }
  if (country.trunkPrefix && digits.startsWith(country.trunkPrefix)) {
    digits = digits.slice(country.trunkPrefix.length);
  }
  return digits.slice(0, Math.max(...country.lengths));
}

/** "7700900000" → "7700 900 000"; partial input is grouped as far as it goes. */
export function formatNationalNumber(digits: string, country: Country): string {
  const parts: string[] = [];
  let index = 0;
  for (const size of country.groups) {
    if (index >= digits.length) break;
    parts.push(digits.slice(index, index + size));
    index += size;
  }
  if (index < digits.length) parts.push(digits.slice(index));
  return parts.join(" ");
}

export function isValidNationalNumber(digits: string, country: Country): boolean {
  return /^\d+$/.test(digits) && country.lengths.includes(digits.length);
}

/** "+447700900000" — the canonical form to send to a backend. */
export function toE164(digits: string, country: Country): string {
  return `+${country.dialCode}${digits}`;
}

/** "+44 7700 900 000" — for showing back to the user. */
export function formatInternational(digits: string, country: Country): string {
  return `+${country.dialCode} ${formatNationalNumber(digits, country)}`;
}
