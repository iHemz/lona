import { Pressable, StyleSheet, Text, View } from "react-native";

import { Avatar, DEFAULT_AVATAR_SIZE } from "@/components/ui/avatar";
import { FontSize, Spacing } from "@/constants/theme";
import { toneColor } from "@/constants/tone";
import { useThemeColors } from "@/hooks/use-theme";
import { describeDueStatus, pluraliseLoans, type FriendLoanSummary } from "@/lib/loans";
import { formatMoney } from "@/lib/money";

/** Left inset for separators so they line up with the text, not the avatar. */
export const FRIEND_ROW_SEPARATOR_INSET = Spacing.lg + DEFAULT_AVATAR_SIZE + Spacing.md;

type FriendLoanRowProps = {
  summary: FriendLoanSummary;
  onPress?: () => void;
};

export function FriendLoanRow({ summary, onPress }: FriendLoanRowProps) {
  const colors = useThemeColors();
  const { friend, loanCount, repaid, principal } = summary;
  const status = describeDueStatus(summary.dueStatus);
  const repaidLabel = formatMoney(repaid, { trimWholeAmounts: true });
  const principalLabel = formatMoney(principal, { trimWholeAmounts: true });
  const accessibilityLabel = [
    friend.name,
    pluraliseLoans(loanCount),
    status?.label,
    `${repaidLabel} repaid of ${principalLabel}`,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.background }]}
    >
      <Avatar name={friend.name} colorKey={friend.id} />
      <View style={styles.details}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {friend.name}
        </Text>
        <View style={styles.meta}>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {pluraliseLoans(loanCount)}
          </Text>
          {status && (
            <>
              <Text style={[styles.metaText, { color: colors.textTertiary }]}>•</Text>
              <Text style={[styles.metaText, { color: toneColor(status.tone, colors) }]}>
                {status.label}
              </Text>
            </>
          )}
        </View>
      </View>
      <View style={styles.amounts}>
        <Text style={[styles.repaid, { color: colors.text }]}>{repaidLabel}</Text>
        <Text style={[styles.metaText, { color: colors.textSecondary }]}>of {principalLabel}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
  },
  details: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: FontSize.body,
    fontWeight: "600",
  },
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: Spacing.sm,
  },
  metaText: {
    fontSize: FontSize.footnote,
  },
  amounts: {
    alignItems: "flex-end",
    gap: 2,
  },
  repaid: {
    fontSize: FontSize.body,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
});
