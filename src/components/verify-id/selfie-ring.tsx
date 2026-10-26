import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedProps, type SharedValue } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { useThemeColors } from "@/hooks/use-theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const SELFIE_SIZE = 260;
const STROKE = 6;
const GAP = 10;
const RING_SIZE = SELFIE_SIZE + (STROKE + GAP) * 2;
const RADIUS = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type SelfieRingProps = {
  /** 0–1, how much of the head turn has been captured. */
  progress: SharedValue<number>;
  /** The camera preview, clipped to a circle. */
  children: ReactNode;
};

export function SelfieRing({ progress, children }: SelfieRingProps) {
  const colors = useThemeColors();
  const arcProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.get()),
  }));

  return (
    <View style={styles.container}>
      <Svg width={RING_SIZE} height={RING_SIZE} style={StyleSheet.absoluteFill}>
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          stroke={colors.surface}
          strokeWidth={STROKE}
          fill="none"
        />
        <AnimatedCircle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          stroke={colors.successFill}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={arcProps}
          fill="none"
          transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
        />
      </Svg>
      <View style={[styles.preview, { backgroundColor: colors.surface }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  preview: {
    width: SELFIE_SIZE,
    height: SELFIE_SIZE,
    borderRadius: SELFIE_SIZE / 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});
