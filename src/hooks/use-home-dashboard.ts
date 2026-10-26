import { useLedger } from "@/hooks/use-ledger";
import { buildHomeDashboard, type HomeDashboard } from "@/lib/home-dashboard";

export function useHomeDashboard(): HomeDashboard {
  return buildHomeDashboard(useLedger());
}
