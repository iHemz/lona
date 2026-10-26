import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FontSize, Radius, Spacing } from "@/constants/theme";
import { toneColor } from "@/constants/tone";
import { useThemeColors } from "@/hooks/use-theme";
import type { ActiveLoanItem } from "@/lib/friend-profile";
import { formatMoney } from "@/lib/money";

export const LOAN_ICON_SIZE = 40;

type ActiveLoanRowProps = {
  item: ActiveLoanItem;
  onPress?: () => void;
};

export function ActiveLoanRow({ item, onPress }: ActiveLoanRowProps) {
  const colors = useThemeColors();
  const { loan, status, outstanding, principal, instalments } = item;
  const isLent = loan.direction === "lent";
  const title = isLent ? "You lent" : "You borrowed";
  const outstandingLabel = formatMoney(outstanding, { trimWholeAmounts: true });
  const principalLabel = formatMoney(principal, { trimWholeAmounts: true });
  const paidLabel = instalments ? `${instalments.paid} of ${instalments.total} paid` : null;

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={[
        title,
        `${outstandingLabel} outstanding of ${principalLabel}`,
        status.label.replace(" • ", ", "),
        paidLabel,
      ]
        .filter(Boolean)
        .join(", ")}
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.container, pressed && { backgroundColor: colors.background }]}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.icon,
            { backgroundColor: isLent ? colors.chipCountSurface : colors.dangerSurface },
          ]}
        >
          <SymbolView
            name={
              isLent
                ? { ios: "arrow.down.left", android: "south_west", web: "south_west" }
                : { ios: "arrow.up.right", android: "north_east", web: "north_east" }
            }
            size={16}
            tintColor={isLent ? colors.text : colors.danger}
          />
        </View>
        <View style={styles.details}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.status, { color: toneColor(status.tone, colors) }]}>
            {status.label}
          </Text>
        </View>
        <View style={styles.amounts}>
          <Text style={[styles.amount, { color: colors.text }]}>{outstandingLabel}</Text>
          <Text style={[styles.of, { color: colors.textSecondary }]}>of {principalLabel}</Text>
        </View>
      </View>

      {instalments && (
        <View style={styles.progressRow}>
          <View style={[styles.track, { backgroundColor: colors.progressTrack }]}>
            <View
              style={[
                styles.fill,
                {
                  width: `${(instalments.paid / Math.max(instalments.total, 1)) * 100}%`,
                  backgroundColor: colors.successFill,
                },
              ]}
            />
          </View>
          <Text style={[styles.of, { color: colors.textSecondary }]}>{paidLabel}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
    gap: Spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  icon: {
    width: LOAN_ICON_SIZE,
    height: LOAN_ICON_SIZE,
    borderRadius: LOAN_ICON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  details: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: FontSize.body,
    fontWeight: "600",
  },
  status: {
    fontSize: FontSize.footnote,
  },
  amounts: {
    alignItems: "flex-end",
    gap: 2,
  },
  amount: {
    fontSize: FontSize.body,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  of: {
    fontSize: FontSize.footnote,
    fontVariant: ["tabular-nums"],
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  track: {
    flex: 1,
    height: 4,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: Radius.pill,
  },
});
