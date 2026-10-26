import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { Radius } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

// Pieces for drawing a FlatList as a single rounded card: each item draws its own slice
// of the card, so the list stays virtualised.

type GroupedRowProps = {
  index: number;
  count: number;
  children: ReactNode;
};

export function GroupedRow({ index, count, children }: GroupedRowProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.slice,
        { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
        index === 0 && styles.first,
        index === count - 1 && styles.last,
      ]}
    >
      {children}
    </View>
  );
}

export function GroupedSeparator({ inset }: { inset: number }) {
  const colors = useThemeColors();

  return (
    <View
      style={[styles.slice, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
    >
      <View style={[styles.line, { marginLeft: inset, backgroundColor: colors.separator }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  slice: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  first: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
  },
  last: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
  },
  line: {
    height: StyleSheet.hairlineWidth,
  },
});
