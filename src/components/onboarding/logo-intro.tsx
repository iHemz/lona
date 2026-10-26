import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

import { LonaMark } from "@/components/brand/lona-mark";
import { LonaWordmark } from "@/components/brand/lona-wordmark";
import { Spacing } from "@/constants/theme";

export const ORBIT_MS = 1600;
export const FORM_MS = 600;

const MARK_SIZE = 88;
/** The mark starts small and grows into place. */
const START_SCALE = 0.3;
const ORBIT_RADIUS = 56;
/** Whole turns, so the heading ends pointing forward (0°) with no snap. */
const ORBIT_TURNS = 2;

type LogoIntroProps = {
  /** Show the settled logo: when the animation has finished, was skipped, or motion is reduced. */
  isFormed: boolean;
};

function useOrbitStyle(orbit: SharedValue<number>, form: SharedValue<number>) {
  return useAnimatedStyle(() => {
    const progress = orbit.get();
    // Start at 12 o'clock and spiral inward to the centre.
    const angle = progress * ORBIT_TURNS * 2 * Math.PI - Math.PI / 2;
    const radius = ORBIT_RADIUS * (1 - progress);
    // Point along the direction of travel (the circle's tangent).
    const heading = (((angle + Math.PI / 2) * 180) / Math.PI) % 360;
    return {
      transform: [
        { translateX: Math.cos(angle) * radius },
        { translateY: Math.sin(angle) * radius },
        { rotate: `${heading}deg` },
        { scale: interpolate(form.get(), [0, 1], [START_SCALE, 1]) },
      ],
    };
  });
}

/** The Lona mark circles in, then settles and the wordmark appears. */
export function LogoIntro({ isFormed }: LogoIntroProps) {
  const orbit = useSharedValue(0);
  const form = useSharedValue(0);

  useEffect(() => {
    if (isFormed) {
      cancelAnimation(orbit);
      cancelAnimation(form);
      orbit.set(1);
      form.set(1);
      return;
    }
    orbit.set(withTiming(1, { duration: ORBIT_MS, easing: Easing.inOut(Easing.cubic) }));
    form.set(
      withDelay(
        ORBIT_MS,
        withTiming(1, { duration: FORM_MS, easing: Easing.out(Easing.back(1.6)) }),
      ),
    );
  }, [isFormed, orbit, form]);

  const markStyle = useOrbitStyle(orbit, form);
  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: form.get(),
    transform: [{ translateY: interpolate(form.get(), [0, 1], [12, 0]) }],
  }));

  return (
    <View accessible accessibilityRole="image" accessibilityLabel="Lona" style={styles.stage}>
      <Animated.View style={markStyle}>
        <LonaMark size={MARK_SIZE} />
      </Animated.View>
      <Animated.View style={wordmarkStyle}>
        <LonaWordmark />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.lg,
  },
});
