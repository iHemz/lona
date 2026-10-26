import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { FontSize } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

const SIZE = 112;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type RepaymentRingProps = {
  /** 0–1, or null when there's nothing to measure yet. */
  rate: number | null;
};

/** Static ring (no animation), so it needs no reduced-motion fallback. */
export function RepaymentRing({ rate }: RepaymentRingProps) {
  const colors = useThemeColors();
  const clamped = rate === null ? 0 : Math.min(Math.max(rate, 0), 1);
  const label = rate === null ? "—" : `${Math.round(clamped * 100)}%`;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={rate === null ? "No repayments yet" : `${label} repaid on time`}
      style={styles.container}
    >
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors.successSurface}
          strokeWidth={STROKE}
          fill="none"
        />
        {clamped > 0 && (
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={colors.successFill}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - clamped)}
            fill="none"
            // Start the arc at 12 o'clock.
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        )}
      </Svg>
      <Text style={[styles.label, { color: colors.text }]} maxFontSizeMultiplier={1.2}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    position: "absolute",
    fontSize: FontSize.title,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
});
