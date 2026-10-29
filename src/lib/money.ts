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

/** "," for en-GB, "." for de-DE. */
function groupSeparator(): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE).format(1000).replace(/\d/g, "");
}

/**
 * What the user typed as an amount ("1,200.5") in minor units (120050). Null unless it's a
 * plain non-negative number with no more decimals than the currency allows.
 */
export function parseMoneyInput(input: string, currency: CurrencyCode): number | null {
  const digits = minorDigits(currency);
  const group = groupSeparator();
  const cleaned = (group ? input.split(group).join("") : input).replace(/\s/g, "");
  const escapedDecimal = decimalSeparator().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern =
    digits > 0 ? new RegExp(`^(\\d+)(?:${escapedDecimal}(\\d{0,${digits}}))?$`) : /^(\d+)$/;
  const match = pattern.exec(cleaned);
  if (!match) return null;
  const whole = Number(match[1]);
  const fraction = Number((match[2] ?? "").padEnd(digits, "0") || 0);
  const minor = whole * 10 ** digits + fraction;
  return Number.isSafeInteger(minor) ? minor : null;
}

/** 20050 → "200.50", 20000 → "200": an amount as the user would type it back in. */
export function formatMoneyInput({ amountMinor, currency }: Money): string {
  const digits = minorDigits(currency);
  const unit = 10 ** digits;
  const whole = Math.floor(amountMinor / unit);
  const fraction = amountMinor % unit;
  return fraction === 0
    ? String(whole)
    : `${whole}${decimalSeparator()}${String(fraction).padStart(digits, "0")}`;
}

/** The currency's symbol on its own, e.g. "£", for a prefix beside an amount field. */
export function currencySymbol(currency: CurrencyCode): string {
  return formatMoney({ amountMinor: 0, currency }, { trimWholeAmounts: true }).replace(
    /[\d\s]/g,
    "",
  );
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
