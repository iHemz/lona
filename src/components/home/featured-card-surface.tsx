import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type FeaturedCardSurfaceProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** The tinted card shared by the featured loan and its empty state. */
export function FeaturedCardSurface({ children, style }: FeaturedCardSurfaceProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.featuredSurface, borderColor: colors.featuredBorder },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
});
