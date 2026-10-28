import { useRef, useState, type ComponentRef } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

const BOX_SIZE = 52;

type CodeInputProps = {
  length: number;
  value: string;
  onChange: (code: string) => void;
  hasError?: boolean;
};

/**
 * One-time code as separate boxes. A single hidden TextInput does the typing, so SMS
 * autofill (iOS "From Messages", Android SMS retriever), paste and screen readers all work.
 */
export function CodeInput({ length, value, onChange, hasError = false }: CodeInputProps) {
  const colors = useThemeColors();
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [isFocused, setIsFocused] = useState(false);
  const activeIndex = Math.min(value.length, length - 1);

  return (
    <Pressable onPress={() => inputRef.current?.focus()} style={styles.row}>
      {Array.from({ length }, (_, index) => {
        const digit = value[index] ?? "";
        const isActive = isFocused && index === activeIndex && value.length < length;
        const borderColor = hasError
          ? colors.danger
          : isActive
            ? colors.primary
            : colors.surfaceBorder;
        return (
          <View
            key={index}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={[
              styles.box,
              { backgroundColor: colors.surface, borderColor },
              isActive && styles.activeBox,
            ]}
          >
            {digit ? (
              <Text style={[styles.digit, { color: colors.text }]}>{digit}</Text>
            ) : (
              isActive && <View style={[styles.caret, { backgroundColor: colors.primary }]} />
            )}
          </View>
        );
      })}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, "").slice(0, length))}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        autoFocus
        accessibilityLabel={`Verification code, ${length} digits`}
        caretHidden
        style={styles.hiddenInput}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.sm + 2,
  },
  // Flexes so six boxes fit a 375pt-wide phone, capped at BOX_SIZE on larger ones.
  box: {
    flex: 1,
    maxWidth: BOX_SIZE,
    aspectRatio: 1,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  activeBox: {
    borderWidth: 1.5,
  },
  digit: {
    fontSize: FontSize.title,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  caret: {
    width: 2,
    height: 24,
    borderRadius: 1,
  },
  // Covers the boxes so taps and long-press paste land on the real input, but is invisible.
  hiddenInput: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0,
    color: "transparent",
  },
});
