import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IntroSheet } from "@/components/onboarding/intro-sheet";
import { FORM_MS, LogoIntro, ORBIT_MS } from "@/components/onboarding/logo-intro";
import { FontSize, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

/** How long the formed logo and tagline stay before the sheet appears. */
const HOLD_MS = 900;

type Stage = "animating" | "formed" | "sheet";

export default function WelcomeScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>(reduceMotion ? "formed" : "animating");

  // Animating → formed once the logo has settled (skipping jumps there directly).
  useEffect(() => {
    if (stage !== "animating") return;
    const timer = setTimeout(() => setStage("formed"), ORBIT_MS + FORM_MS);
    return () => clearTimeout(timer);
  }, [stage]);

  // Formed → sheet after a short hold so the tagline can be read.
  useEffect(() => {
    if (stage !== "formed") return;
    const timer = setTimeout(() => setStage("sheet"), HOLD_MS);
    return () => clearTimeout(timer);
  }, [stage]);

  const isAnimating = stage === "animating";

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Pressable
        accessibilityRole={isAnimating ? "button" : undefined}
        accessibilityLabel={isAnimating ? "Skip animation" : undefined}
        onPress={() => setStage((current) => (current === "animating" ? "formed" : current))}
        disabled={!isAnimating}
        // Hidden from assistive tech while the sheet is up.
        importantForAccessibility={stage === "sheet" ? "no-hide-descendants" : "auto"}
        accessibilityElementsHidden={stage === "sheet"}
        style={[styles.stage, { paddingBottom: insets.bottom + Spacing.xl }]}
      >
        <View style={styles.center}>
          <LogoIntro isFormed={!isAnimating} />
        </View>
        {isAnimating ? (
          <Text style={[styles.footer, { color: colors.textTertiary }]}>
            Tap anywhere to skip animation
          </Text>
        ) : (
          <Animated.Text
            entering={FadeIn.duration(400)}
            style={[styles.footer, { color: colors.textSecondary }]}
          >
            Loan between mates, minus the awkward.
          </Animated.Text>
        )}
      </Pressable>

      {stage === "sheet" && <IntroSheet onContinue={() => router.push("/welcome/sign-up")} />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  stage: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    fontSize: FontSize.footnote,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: Spacing.xl,
  },
});
