import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Spacing } from "@/constants/theme";

/**
 * Top padding for a scrolling screen. iOS applies safe-area insets to the scroll view itself
 * (pair this with `contentInsetAdjustmentBehavior="automatic"`); Android and web need the
 * inset as padding.
 */
export function useScreenTopPadding(): number {
  const insets = useSafeAreaInsets();
  return Platform.OS === "ios" ? 0 : insets.top + Spacing.sm;
}
