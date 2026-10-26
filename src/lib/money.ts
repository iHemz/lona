import { DEFAULT_LOCALE } from "@/lib/locale";

export type CurrencyCode = string;

/** An exact amount in the currency's minor unit (e.g. pence for GBP). */
export type Money = {
  amountMinor: number;
  currency: CurrencyCode;
};

type FormatOptions = {
  /** Drop the minor part when it is zero: £150 instead of £150.00. */
  trimWholeAmounts?: boolean;
};

function minorDigits(currency: CurrencyCode): number {
  return (
    new Intl.NumberFormat(DEFAULT_LOCALE, { style: "currency", currency }).resolvedOptions()
      .maximumFractionDigits ?? 2
  );
}

function toMajor({ amountMinor, currency }: Money): number {
  return amountMinor / 10 ** minorDigits(currency);
}

function currencyFormatter(money: Money, { trimWholeAmounts = false }: FormatOptions) {
  const digits = minorDigits(money.currency);
  const isWhole = money.amountMinor % 10 ** digits === 0;
  const fractionDigits = trimWholeAmounts && isWhole ? 0 : digits;
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: "currency",
    currency: money.currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatMoney(money: Money, options: FormatOptions = {}): string {
  return currencyFormatter(money, options).format(toMajor(money));
}

/** "." for en-GB, "," for de-DE. */
function decimalSeparator(): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE).format(1.1).replace(/\d/g, "") || ".";
}

/**
 * Splits a formatted amount into the whole part ("£200") and the fraction (".54") so the
 * fraction can be styled separately. `fraction` is empty for zero-decimal currencies.
 *
 * Splits the formatted string rather than using `formatToParts`, which Hermes on iOS lacks.
 */
export function splitFormattedMoney(money: Money): { whole: string; fraction: string } {
  const formatted = formatMoney(money);
  const fractionStart =
    minorDigits(money.currency) > 0 ? formatted.lastIndexOf(decimalSeparator()) : -1;
  if (fractionStart === -1) return { whole: formatted, fraction: "" };
  return { whole: formatted.slice(0, fractionStart), fraction: formatted.slice(fractionStart) };
}

export function sumMinor(amounts: number[]): number {
  return amounts.reduce((total, amount) => total + amount, 0);
}
