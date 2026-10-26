import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

const ICON_SIZE = 44;

type PaymentOptionProps = {
  title: string;
  description: string;
  icon: SymbolViewProps["name"];
  /** The benefit line under a divider, e.g. "Transfers arrive in seconds. No fee." */
  benefit: string;
  benefitIcon: SymbolViewProps["name"];
  isLinked: boolean;
  onPress: () => void;
};

/** A way to move money (card or bank); green with a check once linked. */
export function PaymentOption({
  title,
  description,
  icon,
  benefit,
  benefitIcon,
  isLinked,
  onPress,
}: PaymentOptionProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${isLinked ? "linked" : description}`}
      accessibilityHint={isLinked ? "Change it" : `Add a ${title.toLowerCase()}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: isLinked ? colors.successFill : colors.surfaceBorder,
          borderWidth: isLinked ? 1.5 : StyleSheet.hairlineWidth,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.main}>
        <View
          style={[
            styles.icon,
            { backgroundColor: isLinked ? colors.linkSurface : colors.chipCountSurface },
          ]}
        >
          <SymbolView
            name={icon}
            size={20}
            tintColor={isLinked ? colors.link : colors.textSecondary}
          />
        </View>
        <View style={styles.text}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>
        </View>
        {isLinked && (
          <SymbolView
            name={{ ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }}
            size={24}
            tintColor={colors.successFill}
          />
        )}
      </View>
      <View style={[styles.divider, { backgroundColor: colors.separator }]} />
      <View style={styles.benefit}>
        <SymbolView
          name={benefitIcon}
          size={14}
          tintColor={isLinked ? colors.successFill : colors.textSecondary}
        />
        <Text style={[styles.benefitText, { color: colors.text }]}>{benefit}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  pressed: {
    opacity: 0.8,
  },
  main: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: FontSize.body + 1,
    fontWeight: "700",
  },
  description: {
    fontSize: FontSize.subhead,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  benefit: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  benefitText: {
    fontSize: FontSize.subhead,
  },
});
