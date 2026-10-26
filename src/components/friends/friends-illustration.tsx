import { StyleSheet, Text, View } from "react-native";

import { DashedIconBadge } from "@/components/ui/dashed-icon-badge";
import { useThemeColors } from "@/hooks/use-theme";

const CIRCLE_SIZE = 56;

// Decorative: the empty state's title and body carry the meaning.
export function FriendsIllustration() {
  const colors = useThemeColors();

  const circle = (initial: string, side: "left" | "right") => (
    <View
      style={[
        styles.circle,
        side === "left" ? styles.left : styles.right,
        {
          backgroundColor:
            side === "left" ? colors.illustrationDotWarm : colors.illustrationDotCool,
        },
      ]}
    >
      <Text style={[styles.initial, { color: colors.illustrationPaper }]}>{initial}</Text>
    </View>
  );

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.container}
    >
      {circle("A", "left")}
      {circle("S", "right")}
      <DashedIconBadge
        icon={{ ios: "person.badge.plus", android: "person_add", web: "person_add" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 84,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    position: "absolute",
    top: (84 - CIRCLE_SIZE) / 2,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.75,
  },
  left: {
    left: 0,
    alignItems: "flex-start",
    paddingLeft: 12,
  },
  right: {
    right: 0,
    alignItems: "flex-end",
    paddingRight: 12,
  },
  initial: {
    fontSize: 20,
    fontWeight: "700",
  },
});
