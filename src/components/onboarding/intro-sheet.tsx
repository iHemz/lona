import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { FontSize, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

const FEATURES: { icon: SymbolViewProps["name"]; title: string; body: string }[] = [
  {
    icon: { ios: "calendar.badge.checkmark", android: "event_available", web: "event_available" },
    title: "Agreed up front",
    body: "Amount and payback date are settled before any money moves. No vague “whenever” timeline.",
  },
  {
    icon: { ios: "alarm", android: "alarm", web: "alarm" },
    title: "Never from you",
    body: "Gentle nudges come from Lona, never from you, so you’re never chasing a friend over money.",
  },
  {
    icon: { ios: "bolt", android: "bolt", web: "bolt" },
    title: "One-tap payback",
    body: "Repayments move smoothly through Lona and settle themselves, with nothing to mark or confirm.",
  },
  {
    icon: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
    title: "An AI-ready safety net",
    body: "Every agreement is logged, so if things go wrong, AI turns your proof into a formal letter: the formal step before a small claim.",
  },
];

const SHEET_RADIUS = 28;

type IntroSheetProps = {
  onContinue: () => void;
};

/** "Here's Lona." — what the app does, shown over the formed logo. */
export function IntroSheet({ onContinue }: IntroSheetProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View
        entering={FadeIn.duration(250)}
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]}
      />
      <Animated.View
        entering={SlideInDown.duration(350)}
        accessibilityViewIsModal
        style={[
          styles.sheet,
          { backgroundColor: colors.background, paddingBottom: insets.bottom + Spacing.lg },
        ]}
      >
        <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
          Here’s Lona<Text style={{ color: colors.primary }}>.</Text>
        </Text>
        <ScrollView style={styles.features} contentContainerStyle={styles.featuresContent}>
          {FEATURES.map(({ icon, title, body }) => (
            <View key={title} accessible style={styles.feature}>
              <SymbolView name={icon} size={20} tintColor={colors.text} />
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.featureBody, { color: colors.textSecondary }]}>{body}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <Button label="Continue" onPress={onContinue} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: "85%",
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xl,
  },
  title: {
    fontSize: FontSize.heading,
    fontWeight: "700",
    textAlign: "center",
  },
  features: {
    flexGrow: 0,
  },
  featuresContent: {
    gap: Spacing.xl,
  },
  feature: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.lg,
  },
  featureText: {
    flex: 1,
    gap: Spacing.xs,
  },
  featureTitle: {
    fontSize: FontSize.body,
    fontWeight: "700",
  },
  featureBody: {
    fontSize: FontSize.footnote,
    lineHeight: 18,
  },
});
