import { createContext, useContext, useState, type ReactNode } from "react";
import { Appearance, Platform } from "react-native";

export type ThemePreference = "system" | "light" | "dark";

export const THEME_PREFERENCE_LABELS: Record<ThemePreference, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

type ThemePreferenceContextValue = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemePreferenceContext = createContext<ThemePreferenceContextValue>({
  preference: "system",
  setPreference: () => {},
});

// TODO: persist the choice once there's a storage dependency; it resets on relaunch for now.
export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  const setPreference = (next: ThemePreference) => {
    setPreferenceState(next);
    // Keeps native UI (tab bar, alerts, keyboard) in step. React Native Web has no override,
    // so web relies on `useThemeColors` reading the preference.
    if (Platform.OS !== "web") {
      Appearance.setColorScheme(next === "system" ? "unspecified" : next);
    }
  };

  return (
    <ThemePreferenceContext.Provider value={{ preference, setPreference }}>
      {children}
    </ThemePreferenceContext.Provider>
  );
}

export function useThemePreference(): ThemePreferenceContextValue {
  return useContext(ThemePreferenceContext);
}
