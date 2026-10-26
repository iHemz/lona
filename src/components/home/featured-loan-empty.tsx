import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text } from "react-native";

import { FeaturedCardSurface } from "@/components/home/featured-card-surface";
import { PolaroidIllustration } from "@/components/home/polaroid-illustration";
import { EmptyState } from "@/components/ui/empty-state";
import { FontSize, Radius, Spacing, TouchTarget } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type FeaturedLoanEmptyProps = {
  onSetUpLoan?: () => void;
  onLearnMore?: () => void;
};

function LearnMoreLink({ onPress }: { onPress?: () => void }) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.learnMore,
        { backgroundColor: colors.linkSurface },
        pressed && styles.pressed,
      ]}
    >
      <SymbolView
        name={{ ios: "camera", android: "add_a_photo", web: "add_a_photo" }}
        size={16}
        tintColor={colors.link}
      />
      <Text style={[styles.learnMoreLabel, { color: colors.link }]}>
        Learn more about loan companion
      </Text>
      <SymbolView
        name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
        size={14}
        tintColor={colors.textSecondary}
      />
    </Pressable>
  );
}

export function FeaturedLoanEmpty({ onSetUpLoan, onLearnMore }: FeaturedLoanEmptyProps) {
  return (
    <FeaturedCardSurface style={styles.surface}>
      <EmptyState
        illustration={<PolaroidIllustration />}
        accessory={<LearnMoreLink onPress={onLearnMore} />}
        title="No featured loan on record"
        body="Agree the terms upfront and Lona tracks everything. So you never have to chase a loan."
        action={{
          label: "Set up your first loan",
          icon: { ios: "plus", android: "add", web: "add" },
          onPress: onSetUpLoan,
        }}
      />
    </FeaturedCardSurface>
  );
}

const styles = StyleSheet.create({
  surface: {
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xxxl,
  },
  learnMore: {
    minHeight: TouchTarget,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.pill,
    flexShrink: 1,
  },
  learnMoreLabel: {
    fontSize: FontSize.subhead,
    fontWeight: "600",
    flexShrink: 1,
  },
  pressed: {
    opacity: 0.6,
  },
});
