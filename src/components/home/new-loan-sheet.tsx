import { StyleSheet, Text, View } from "react-native";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { OptionRow } from "@/components/ui/option-row";
import { FontSize, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type NewLoanSheetProps = {
  visible: boolean;
  onClose: () => void;
  /** False until setup is finished; the options are shown but can't be used yet. */
  canMoveMoney: boolean;
  onOfferToLend?: () => void;
  onSettleUp?: () => void;
};

/** The "•••" menu next to Request loan: the other ways to start moving money. */
export function NewLoanSheet({
  visible,
  onClose,
  canMoveMoney,
  onOfferToLend,
  onSettleUp,
}: NewLoanSheetProps) {
  const colors = useThemeColors();

  return (
    <BottomSheet visible={visible} onClose={onClose} showGrabber>
      <View style={styles.content}>
        <View style={styles.heading}>
          <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
            New loan
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {canMoveMoney
              ? "Terms are clearly agreed up front, so there’s nothing to chase later."
              : "Finish setting up your account to lend or settle up."}
          </Text>
        </View>
        <OptionRow
          title="Offer to lend"
          description="Send money to a friend"
          icon={{ ios: "paperplane", android: "send", web: "send" }}
          onPress={onOfferToLend}
          disabled={!canMoveMoney}
        />
        <OptionRow
          title="Settle up"
          description="Pay back what you owe"
          icon={{ ios: "arrow.left.arrow.right", android: "swap_horiz", web: "swap_horiz" }}
          onPress={onSettleUp}
          disabled={!canMoveMoney}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  heading: {
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.title + 4,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: FontSize.body,
    lineHeight: 24,
  },
});
