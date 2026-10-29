import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

const PAD_HEIGHT = 160;

type SignaturePadProps = {
  /** SVG path data, one entry per stroke. */
  strokes: string[];
  onChange: (strokes: string[]) => void;
  /** Lets a parent scroll view stop scrolling while a stroke is drawn. */
  onDrawingChange?: (isDrawing: boolean) => void;
};

/** "M x y" for the touch's position within the pad. */
function pointAt(event: GestureResponderEvent): string {
  const { locationX, locationY } = event.nativeEvent;
  return `${Math.round(locationX)} ${Math.round(locationY)}`;
}

/** A simple flourish across the pad, for signing without drawing (e.g. with a screen reader). */
function flourish(width: number): string {
  const step = Math.max(width - Spacing.xxxl * 2, 80) / 6;
  const y = PAD_HEIGHT / 2;
  let path = `M ${Spacing.xxxl} ${y}`;
  for (let i = 1; i <= 6; i++) {
    path += ` Q ${Spacing.xxxl + step * (i - 0.5)} ${y + (i % 2 ? -24 : 24)} ${Spacing.xxxl + step * i} ${y}`;
  }
  return path;
}

/** Draw a signature with a finger; every stroke is kept as an SVG path. */
export function SignaturePad({ strokes, onChange, onDrawingChange }: SignaturePadProps) {
  const colors = useThemeColors();
  const [current, setCurrent] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const isEmpty = strokes.length === 0 && current === null;

  const finishStroke = () => {
    if (current) onChange([...strokes, current]);
    setCurrent(null);
    onDrawingChange?.(false);
  };

  return (
    <View
      accessible
      accessibilityLabel={isEmpty ? "Signature, not signed" : "Signature, signed"}
      accessibilityHint="Draw your signature with your finger, or double-tap to sign"
      accessibilityActions={[{ name: "activate", label: "Sign" }]}
      onAccessibilityAction={() => onChange([flourish(width)])}
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      onResponderGrant={(event) => {
        onDrawingChange?.(true);
        setCurrent(`M ${pointAt(event)}`);
      }}
      onResponderMove={(event) => {
        const point = pointAt(event);
        setCurrent((stroke) => (stroke ? `${stroke} L ${point}` : `M ${point}`));
      }}
      onResponderRelease={finishStroke}
      onResponderTerminate={finishStroke}
      style={[styles.pad, { backgroundColor: colors.surface, borderColor: colors.outlineBorder }]}
    >
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        {[...strokes, ...(current ? [current] : [])].map((stroke, index) => (
          <Path
            key={index}
            d={stroke}
            stroke={colors.text}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ))}
      </Svg>

      <View style={[styles.baseline, { backgroundColor: colors.separator }]} pointerEvents="none" />
      <Text style={[styles.hint, { color: colors.textTertiary }]} pointerEvents="none">
        Sign here
      </Text>

      {!isEmpty && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear signature"
          onPress={() => onChange([])}
          hitSlop={12}
          style={({ pressed }) => [
            styles.clear,
            { backgroundColor: colors.linkSurface },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.clearLabel, { color: colors.link }]}>Clear</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    height: PAD_HEIGHT,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderStyle: "dashed",
    overflow: "hidden",
  },
  baseline: {
    position: "absolute",
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: Spacing.xxxl + Spacing.xs,
    height: StyleSheet.hairlineWidth,
  },
  hint: {
    position: "absolute",
    left: Spacing.lg,
    bottom: Spacing.md,
    fontSize: FontSize.footnote,
    fontWeight: "500",
  },
  clear: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
  },
  pressed: {
    opacity: 0.6,
  },
  clearLabel: {
    fontSize: FontSize.footnote,
    fontWeight: "600",
  },
});
