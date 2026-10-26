import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { useThemeColors } from "@/hooks/use-theme";

const SIZE = 72;

/** The dashed circle with an icon at the centre of the empty-state illustrations. */
export function DashedIconBadge({ icon }: { icon: SymbolViewProps["name"] }) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.illustrationPaper, borderColor: colors.illustrationDash },
      ]}
    >
      <SymbolView name={icon} size={28} tintColor={colors.text} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
});
