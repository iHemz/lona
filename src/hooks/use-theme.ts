import { useColorScheme } from "react-native";

import { Colors, type ThemeColors } from "@/constants/theme";
import { useThemePreference } from "@/hooks/use-theme-preference";

export function useThemeColors(): ThemeColors {
  const systemScheme = useColorScheme();
  const { preference } = useThemePreference();
  const scheme = preference === "system" ? systemScheme : preference;
  return scheme === "dark" ? Colors.dark : Colors.light;
}
