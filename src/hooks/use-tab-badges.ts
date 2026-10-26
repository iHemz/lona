import { useLedger } from "@/hooks/use-ledger";
import { unreadCount } from "@/lib/activity";

/** Badge counts keyed by tab route name; tabs without an entry show no badge. */
export function useTabBadges(): Partial<Record<string, number>> {
  const { activity } = useLedger();
  return { activity: unreadCount(activity) };
}
