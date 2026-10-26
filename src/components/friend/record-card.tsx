import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FontSize, Radius, Spacing, TouchTarget } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type RecordCardProps = {
  /** Shows a chevron in the header when set. */
  onOpen?: () => void;
  openLabel?: string;
  children: ReactNode;
  /** Rendered below the tinted panel, on the card's own surface. */
  footer?: ReactNode;
};

/** White card with a "RECORD" header and a tinted panel, shared by both friend screens. */
export function RecordCard({ onOpen, openLabel, children, footer }: RecordCardProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
    >
      <View style={[styles.panel, { backgroundColor: colors.featuredSurface }]}>
        <View style={styles.header}>
          <View style={styles.eyebrowRow}>
            <SymbolView
              name={{
                ios: "flame.fill",
                android: "local_fire_department",
                web: "local_fire_department",
              }}
              size={14}
              tintColor={colors.textSecondary}
            />
            <Text style={[styles.eyebrow, { color: colors.textSecondary }]}>Record</Text>
          </View>
          {onOpen && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={openLabel}
              onPress={onOpen}
              hitSlop={(TouchTarget - 28) / 2}
              style={({ pressed }) => [
                styles.chevron,
                { backgroundColor: colors.surface },
                pressed && styles.pressed,
              ]}
            >
              <SymbolView
                name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
                size={12}
                tintColor={colors.textSecondary}
              />
            </Pressable>
          )}
        </View>
        {children}
      </View>
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.xs,
    overflow: "hidden",
  },
  panel: {
    borderRadius: Radius.lg - Spacing.xs,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  eyebrow: {
    fontSize: FontSize.caption,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  chevron: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.6,
  },
});
