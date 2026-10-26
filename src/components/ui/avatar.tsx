import { StyleSheet, Text, View } from "react-native";

import { AvatarColors, AvatarText } from "@/constants/theme";
import { initials, stableIndex } from "@/lib/names";

export const DEFAULT_AVATAR_SIZE = 40;

type AvatarProps = {
  name: string;
  /** Keeps the colour stable for a person even if their display name changes. */
  colorKey?: string;
  size?: number;
};

// Decorative: the person's name is always announced by the surrounding row.
export function Avatar({ name, colorKey = name, size = DEFAULT_AVATAR_SIZE }: AvatarProps) {
  const backgroundColor = AvatarColors[stableIndex(colorKey, AvatarColors.length)];

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.36 }]} maxFontSizeMultiplier={1.2}>
        {initials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: AvatarText,
    fontWeight: "600",
  },
});
