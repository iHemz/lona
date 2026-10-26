import { DEFAULT_LOCALE } from "@/lib/locale";

/** A calendar date with no time or zone, formatted `YYYY-MM-DD`. */
export type IsoDate = string;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toUtcMs(date: IsoDate): number {
  return Date.parse(`${date}T00:00:00Z`);
}

export function todayIsoDate(now: Date = new Date()): IsoDate {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function addDays(date: IsoDate, days: number): IsoDate {
  return new Date(toUtcMs(date) + days * MS_PER_DAY).toISOString().slice(0, 10);
}

/** Whole days from `from` to `to`; negative when `to` is in the past. */
export function daysBetween(from: IsoDate, to: IsoDate): number {
  return Math.round((toUtcMs(to) - toUtcMs(from)) / MS_PER_DAY);
}

/** "today", "3 days ago", "6 months ago". English-only, like the rest of the copy for now. */
export function formatTimeAgo(date: IsoDate, today: IsoDate): string {
  const days = Math.max(daysBetween(date, today), 0);
  const ago = (count: number, unit: string) => `${count} ${unit}${count === 1 ? "" : "s"} ago`;
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return ago(days, "day");
  if (days < 30) return ago(Math.floor(days / 7), "week");
  // 30-day months reach 12 just before a year; cap so it never reads "12 months ago".
  if (days < 365) return ago(Math.min(Math.floor(days / 30), 11), "month");
  return ago(Math.floor(days / 365), "year");
}

/** "12 Aug" */
export function formatShortDate(date: IsoDate): string {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(toUtcMs(date));
}

/** "May 2026" */
export function formatMonthYear(date: IsoDate): string {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(toUtcMs(date));
}

/** "Fri 12 July" */
export function formatWeekdayDate(date: IsoDate): string {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    weekday: "short",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(toUtcMs(date));
}
