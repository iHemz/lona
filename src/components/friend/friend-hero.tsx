import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { FontSize, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import type { Friend } from "@/lib/loans";

type FriendHeroProps = {
  friend: Friend;
  title: string;
  subtitle: string;
  /** Rendered under the subtitle, e.g. an action button or a stats pill. */
  children?: ReactNode;
};

export function FriendHero({ friend, title, subtitle, children }: FriendHeroProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <Avatar name={friend.name} colorKey={friend.id} size={56} />
      <View style={styles.text}>
        <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: Spacing.lg,
  },
  text: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: FontSize.footnote,
    textAlign: "center",
  },
});
