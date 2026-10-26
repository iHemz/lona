// Client-side checks for card entry. Real card data goes to the payment partner's secure
// fields in production; Lona only ever keeps the brand, last four digits and expiry.

export type CardBrand = "visa" | "mastercard" | "amex" | "unknown";

export const CARD_BRAND_LABELS: Record<CardBrand, string> = {
  visa: "VISA",
  mastercard: "Mastercard",
  amex: "AMEX",
  unknown: "Card",
};

export function digitsOnly(input: string): string {
  return input.replace(/\D/g, "");
}

export function detectCardBrand(digits: string): CardBrand {
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  return "unknown";
}

function cardNumberLength(brand: CardBrand): number {
  return brand === "amex" ? 15 : 16;
}

/** Capped to the brand's length. */
export function normaliseCardNumber(input: string): string {
  const digits = digitsOnly(input);
  return digits.slice(0, cardNumberLength(detectCardBrand(digits)));
}

/** "4242424242424242" → "4242 4242 4242 4242"; Amex groups 4-6-5. */
export function formatCardNumber(digits: string): string {
  const groups = detectCardBrand(digits) === "amex" ? [4, 6, 5] : [4, 4, 4, 4];
  const parts: string[] = [];
  let index = 0;
  for (const size of groups) {
    if (index >= digits.length) break;
    parts.push(digits.slice(index, index + size));
    index += size;
  }
  return parts.join(" ");
}

/** Luhn checksum, which every real card number passes. */
export function passesLuhn(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return digits.length > 0 && sum % 10 === 0;
}

export function isValidCardNumber(digits: string): boolean {
  const brand = detectCardBrand(digits);
  return brand !== "unknown" && digits.length === cardNumberLength(brand) && passesLuhn(digits);
}

/** "0928", "09/28" or "9/28" → "09/28" as the user types. */
export function formatExpiry(input: string): string {
  let digits = digitsOnly(input);
  // A first digit of 2–9 can only be a single-digit month.
  if (/^[2-9]/.test(digits)) digits = `0${digits}`;
  digits = digits.slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

/** Valid if it's a real month and not before the current month. */
export function isValidExpiry(expiry: string, now: Date = new Date()): boolean {
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

export function cvcLength(brand: CardBrand): number {
  return brand === "amex" ? 4 : 3;
}

export function isValidCvc(cvc: string, brand: CardBrand): boolean {
  return new RegExp(`^\\d{${cvcLength(brand)}}$`).test(cvc);
}

export type CardDetails = { number: string; expiry: string; cvc: string };

export function isValidCard({ number, expiry, cvc }: CardDetails): boolean {
  return (
    isValidCardNumber(number) && isValidExpiry(expiry) && isValidCvc(cvc, detectCardBrand(number))
  );
}
