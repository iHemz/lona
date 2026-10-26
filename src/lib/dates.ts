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

/** "12 Aug" */
export function formatShortDate(date: IsoDate): string {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: "numeric",
    month: "short",
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
