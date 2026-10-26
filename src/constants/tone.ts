import type { ThemeColors } from "@/constants/theme";
import type { StatusTone } from "@/lib/loans";

export function toneColor(tone: StatusTone, colors: ThemeColors): string {
  switch (tone) {
    case "danger":
      return colors.danger;
    case "warning":
      return colors.warning;
    case "success":
      return colors.success;
    case "neutral":
      return colors.textSecondary;
  }
}
