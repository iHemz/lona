import { StyleSheet, Text, View } from "react-native";

import { FriendModalHeader } from "@/components/friend/friend-modal-header";
import { FontSize, Spacing } from "@/constants/theme";
import { useScreenTopPadding } from "@/hooks/use-screen-top-padding";
import { useThemeColors } from "@/hooks/use-theme";

/** Shown when the route's friend id doesn't match anyone, e.g. a stale link. */
export function FriendNotFound() {
  const colors = useThemeColors();
  const topPadding = useScreenTopPadding();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: topPadding }]}>
      <FriendModalHeader />
      <View style={styles.body}>
        <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
          Friend not found
        </Text>
        <Text style={[styles.text, { color: colors.textSecondary }]}>
          They may have been removed, or the link is out of date.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: Spacing.lg,
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSize.heading,
    fontWeight: "700",
  },
  text: {
    fontSize: FontSize.subhead,
    textAlign: "center",
  },
});
