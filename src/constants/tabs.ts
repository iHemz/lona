import type { AndroidSymbol, SFSymbol } from "expo-symbols";

export type AppTab = {
  /** Route file name in `src/app/(tabs)/`. */
  name: string;
  label: string;
  sf: { default: SFSymbol; selected: SFSymbol };
  /** Material symbol, used on Android and web. */
  md: AndroidSymbol;
};

export const APP_TABS: AppTab[] = [
  { name: "index", label: "Home", sf: { default: "house", selected: "house.fill" }, md: "home" },
  {
    name: "loans",
    label: "Loans",
    sf: { default: "square.stack.3d.up", selected: "square.stack.3d.up.fill" },
    md: "stacks",
  },
  {
    name: "friends",
    label: "Friends",
    sf: { default: "person.2", selected: "person.2.fill" },
    md: "group",
  },
  {
    name: "activity",
    label: "Activity",
    sf: { default: "bell", selected: "bell.fill" },
    md: "notifications",
  },
];
