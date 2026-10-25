import { todayIsoDate } from "@/lib/dates";
import { buildHomeDashboard, type HomeDashboard } from "@/lib/home-dashboard";
import { createMockLedger } from "@/lib/mock-data";

// TODO: replace with the user's home currency and real data once there's a backend.
const HOME_CURRENCY = "GBP";

export function useHomeDashboard(): HomeDashboard {
  const today = todayIsoDate();
  const { friends, loans } = createMockLedger(today);
  return buildHomeDashboard({ loans, friends, today, currency: HOME_CURRENCY });
}
