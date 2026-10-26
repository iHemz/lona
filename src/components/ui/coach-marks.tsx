import { useEffect, useState, type RefObject } from "react";
import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

import { Button } from "@/components/ui/button";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

export type CoachMarkStep = {
  /** The element to highlight. Give it `collapsable={false}` so it can be measured on Android. */
  target: RefObject<View | null>;
  title: string;
  body: string;
};

type CoachMarksProps = {
  steps: CoachMarkStep[];
  visible: boolean;
  /** Called when the tour ends, whether finished or skipped. */
  onFinish: () => void;
};

type Rect = { x: number; y: number; width: number; height: number };

const HOLE_PADDING = 6;
const EDGE = 16;
const TOOLTIP_MAX_WIDTH = 320;
const ARROW_SIZE = 14;

function roundedRectPath({ x, y, width, height }: Rect, r: number): string {
  return [
    `M${x + r} ${y}`,
    `H${x + width - r}`,
    `A${r} ${r} 0 0 1 ${x + width} ${y + r}`,
    `V${y + height - r}`,
    `A${r} ${r} 0 0 1 ${x + width - r} ${y + height}`,
    `H${x + r}`,
    `A${r} ${r} 0 0 1 ${x} ${y + height - r}`,
    `V${y + r}`,
    `A${r} ${r} 0 0 1 ${x + r} ${y}`,
    "Z",
  ].join(" ");
}

/**
 * A guided tour: dims the screen except for one element at a time and explains it in a
 * tooltip. The highlighted element is the real one, seen through a cut-out.
 */
export function CoachMarks({ steps, visible, onFinish }: CoachMarksProps) {
  const colors = useThemeColors();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const step = steps[index];

  // Measure after layout settles, and again if the window changes size.
  useEffect(() => {
    if (!visible || !step) return;
    const timer = setTimeout(() => {
      step.target.current?.measureInWindow((x, y, width, height) => {
        if (width > 0 && height > 0) setRect({ x, y, width, height });
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [visible, step, screenWidth, screenHeight]);

  if (!visible || !step || !rect) return null;

  const hole: Rect = {
    x: rect.x - HOLE_PADDING,
    y: rect.y - HOLE_PADDING,
    width: rect.width + HOLE_PADDING * 2,
    height: rect.height + HOLE_PADDING * 2,
  };
  // Round targets (icon buttons) get a round hole; everything else a rounded rectangle.
  const holeRadius = rect.width === rect.height ? hole.width / 2 : Radius.lg + HOLE_PADDING;

  const tooltipWidth = Math.min(screenWidth - EDGE * 2, TOOLTIP_MAX_WIDTH);
  const targetCenterX = rect.x + rect.width / 2;
  const left = Math.min(
    Math.max(targetCenterX - tooltipWidth / 2, EDGE),
    screenWidth - tooltipWidth - EDGE,
  );
  const spaceBelow = screenHeight - (hole.y + hole.height);
  const placeBelow = spaceBelow > hole.y;
  const arrowLeft = Math.min(
    Math.max(targetCenterX - left - ARROW_SIZE / 2, Radius.lg),
    tooltipWidth - Radius.lg - ARROW_SIZE,
  );
  const isLast = index === steps.length - 1;

  const finish = () => {
    setIndex(0);
    setRect(null);
    onFinish();
  };

  const next = () => {
    if (isLast) return finish();
    setRect(null);
    setIndex(index + 1);
  };

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent onRequestClose={finish}>
      <Svg width={screenWidth} height={screenHeight} style={StyleSheet.absoluteFill}>
        <Path
          d={`M0 0 H${screenWidth} V${screenHeight} H0 Z ${roundedRectPath(hole, holeRadius)}`}
          fill={colors.scrim}
          fillRule="evenodd"
        />
      </Svg>
      <View
        pointerEvents="none"
        style={[
          styles.ring,
          {
            left: hole.x,
            top: hole.y,
            width: hole.width,
            height: hole.height,
            borderRadius: holeRadius,
            borderColor: colors.primary,
          },
        ]}
      />
      {/* Taps outside the tooltip do nothing, so the tour can't be dismissed by accident. */}
      <Pressable accessible={false} style={StyleSheet.absoluteFill} />

      <View
        accessibilityViewIsModal
        style={[
          styles.tooltip,
          {
            left,
            width: tooltipWidth,
            backgroundColor: colors.surface,
            ...(placeBelow
              ? { top: hole.y + hole.height + ARROW_SIZE }
              : { bottom: screenHeight - hole.y + ARROW_SIZE }),
          },
        ]}
      >
        <View
          style={[
            styles.arrow,
            { left: arrowLeft, backgroundColor: colors.surface },
            placeBelow ? { top: -ARROW_SIZE / 2 } : { bottom: -ARROW_SIZE / 2 },
          ]}
        />
        <Text style={[styles.counter, { color: colors.link }]}>
          {index + 1} of {steps.length}
        </Text>
        <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
          {step.title}
        </Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>{step.body}</Text>
        <View style={styles.footer}>
          <View style={styles.dots} accessibilityElementsHidden>
            {steps.map((_, dotIndex) => (
              <View
                key={dotIndex}
                style={[
                  styles.dot,
                  dotIndex === index
                    ? [styles.activeDot, { backgroundColor: colors.primary }]
                    : { backgroundColor: colors.outlineBorder },
                ]}
              />
            ))}
          </View>
          <Pressable accessibilityRole="button" onPress={finish} hitSlop={12}>
            <Text style={[styles.skip, { color: colors.textSecondary }]}>Skip</Text>
          </Pressable>
          <Button label={isLast ? "Got it" : "Next"} size="compact" onPress={next} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  ring: {
    position: "absolute",
    borderWidth: 3,
  },
  tooltip: {
    position: "absolute",
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    gap: Spacing.sm,
  },
  arrow: {
    position: "absolute",
    width: ARROW_SIZE,
    height: ARROW_SIZE,
    transform: [{ rotate: "45deg" }],
  },
  counter: {
    fontSize: FontSize.caption,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  title: {
    fontSize: FontSize.body + 1,
    fontWeight: "700",
  },
  body: {
    fontSize: FontSize.subhead,
    lineHeight: 21,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
    marginTop: Spacing.md,
  },
  dots: {
    flex: 1,
    flexDirection: "row",
    gap: Spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 16,
  },
  skip: {
    fontSize: FontSize.subhead,
    fontWeight: "600",
  },
});
