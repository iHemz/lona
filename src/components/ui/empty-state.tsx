import type { SymbolViewProps } from "expo-symbols";
import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { FontSize, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type EmptyStateProps = {
  illustration: ReactNode;
  /** Rendered between the illustration and the title, e.g. a "learn more" link. */
  accessory?: ReactNode;
  title: string;
  body: string;
  action?: {
    label: string;
    icon?: SymbolViewProps["name"];
    onPress?: () => void;
  };
};

export function EmptyState({ illustration, accessory, title, body, action }: EmptyStateProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      {illustration}
      {accessory}
      <View style={styles.copy}>
        <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>{body}</Text>
      </View>
      {action && (
        <Button
          label={action.label}
          icon={action.icon}
          onPress={action.onPress}
          variant="inverse"
          size="compact"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: Spacing.xl,
  },
  copy: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSize.heading,
    fontWeight: "700",
    textAlign: "center",
  },
  body: {
    fontSize: FontSize.subhead,
    lineHeight: 21,
    textAlign: "center",
    maxWidth: 320,
  },
});
