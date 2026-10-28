import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

const ICON_SIZE = 40;

type NewLoanOption = {
  title: string;
  description: string;
  icon: SymbolViewProps["name"];
  onPress?: () => void;
};

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

  const options: NewLoanOption[] = [
    {
      title: "Offer to lend",
      description: "Send money to a friend",
      icon: { ios: "paperplane", android: "send", web: "send" },
      onPress: onOfferToLend,
    },
    {
      title: "Settle up",
      description: "Pay back what you owe",
      icon: {
        ios: "arrow.left.arrow.right",
        android: "swap_horiz",
        web: "swap_horiz",
      },
      onPress: onSettleUp,
    },
  ];

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
        {options.map((option) => (
          <Pressable
            key={option.title}
            accessibilityRole="button"
            accessibilityLabel={`${option.title}, ${option.description}`}
            accessibilityState={{ disabled: !canMoveMoney }}
            disabled={!canMoveMoney}
            onPress={option.onPress}
            style={({ pressed }) => [
              styles.option,
              { backgroundColor: colors.surface },
              pressed && styles.pressed,
              !canMoveMoney && styles.disabled,
            ]}
          >
            <View style={[styles.icon, { backgroundColor: colors.linkSurface }]}>
              <SymbolView name={option.icon} size={18} tintColor={colors.link} />
            </View>
            <View style={styles.optionText}>
              <Text style={[styles.optionTitle, { color: colors.text }]}>{option.title}</Text>
              <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                {option.description}
              </Text>
            </View>
            <SymbolView
              name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
              size={14}
              tintColor={colors.textSecondary}
            />
          </Pressable>
        ))}
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
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontSize: FontSize.body,
    fontWeight: "700",
  },
  optionDescription: {
    fontSize: FontSize.subhead,
  },
});
