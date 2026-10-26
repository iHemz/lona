import type { SymbolViewProps } from "expo-symbols";

type Icon = SymbolViewProps["name"];

/** The "loans" icon: tab bar, empty states and "View loans". */
export const LOAN_STACK_ICON: Icon = {
  ios: "square.stack.3d.up",
  android: "stacks",
  web: "stacks",
};
