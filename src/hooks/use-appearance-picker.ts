import { ActionSheetIOS, Alert, Platform } from "react-native";

import {
  THEME_PREFERENCE_LABELS,
  useThemePreference,
  type ThemePreference,
} from "@/hooks/use-theme-preference";

const OPTIONS: ThemePreference[] = ["system", "light", "dark"];

/** Returns a function that lets the user choose System / Light / Dark. */
export function useAppearancePicker(): () => void {
  const { preference, setPreference } = useThemePreference();
  const labels = OPTIONS.map((option) => THEME_PREFERENCE_LABELS[option]);

  return () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { title: "Appearance", options: [...labels, "Cancel"], cancelButtonIndex: OPTIONS.length },
        (index) => {
          const choice = OPTIONS[index];
          if (choice) setPreference(choice);
        },
      );
    } else if (Platform.OS === "android") {
      // Android alerts hold up to three buttons, which fits the three options; tap outside to cancel.
      Alert.alert(
        "Appearance",
        undefined,
        OPTIONS.map((option) => ({
          text: THEME_PREFERENCE_LABELS[option],
          onPress: () => setPreference(option),
        })),
        { cancelable: true },
      );
    } else {
      // Web has no native picker here, so cycle through the options.
      const next = OPTIONS[(OPTIONS.indexOf(preference) + 1) % OPTIONS.length] ?? "system";
      setPreference(next);
    }
  };
}
