import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Fragment, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FontSize, Radius, Spacing, TouchTarget } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

const ICON_SIZE = 18;

const TRAILING_ICONS = {
  chevron: { ios: "chevron.right", android: "chevron_right", web: "chevron_right" },
  external: { ios: "arrow.up.right", android: "open_in_new", web: "open_in_new" },
  menu: { ios: "chevron.up.chevron.down", android: "unfold_more", web: "unfold_more" },
} as const;

export type LinkListItem = {
  label: string;
  icon: SymbolViewProps["name"];
  onPress?: () => void;
  /** Secondary text before the trailing indicator, e.g. "English" or "···· 4242". */
  value?: string;
  /** Shows a green check; "verified" is also announced. */
  isVerified?: boolean;
  /** `chevron` opens a screen, `external` leaves the app, `menu` picks from options. */
  trailing?: keyof typeof TRAILING_ICONS | "none";
  /** Replaces the trailing indicator, e.g. a Switch. The row itself is then not pressable. */
  accessory?: ReactNode;
  isDestructive?: boolean;
};

type LinkListProps = {
  items: LinkListItem[];
  /** Optional section heading above the card. */
  title?: string;
};

/** A short, fixed list of rows (icon, label, value, indicator) in a rounded card. */
export function LinkList({ items, title }: LinkListProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.section}>
      {title && (
        <Text accessibilityRole="header" style={[styles.title, { color: colors.textSecondary }]}>
          {title}
        </Text>
      )}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
        ]}
      >
        {items.map((item, index) => (
          <Fragment key={item.label}>
            {index > 0 && (
              <View style={[styles.separator, { backgroundColor: colors.separator }]} />
            )}
            <LinkListRow item={item} />
          </Fragment>
        ))}
      </View>
    </View>
  );
}

function LinkListRow({ item }: { item: LinkListItem }) {
  const colors = useThemeColors();
  const { label, icon, onPress, value, isVerified, accessory, isDestructive } = item;
  const trailing = item.trailing ?? "chevron";
  const tint = isDestructive ? colors.danger : colors.text;

  const content = (
    <>
      <SymbolView
        name={icon}
        size={ICON_SIZE}
        tintColor={isDestructive ? colors.danger : colors.textSecondary}
      />
      <Text style={[styles.label, { color: tint }]}>{label}</Text>
      {value && <Text style={[styles.value, { color: colors.textSecondary }]}>{value}</Text>}
      {isVerified && (
        <SymbolView
          name={{ ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }}
          size={16}
          tintColor={colors.successFill}
        />
      )}
      {accessory ??
        (trailing !== "none" && !isDestructive && (
          <SymbolView name={TRAILING_ICONS[trailing]} size={14} tintColor={colors.textTertiary} />
        ))}
    </>
  );

  if (accessory) {
    return <View style={styles.row}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole={trailing === "external" ? "link" : "button"}
      accessibilityLabel={[label, value, isVerified && "verified"].filter(Boolean).join(", ")}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.background }]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.sm,
  },
  title: {
    fontSize: FontSize.footnote,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  row: {
    minHeight: TouchTarget + Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  label: {
    flex: 1,
    fontSize: FontSize.body,
  },
  value: {
    fontSize: FontSize.body,
    fontVariant: ["tabular-nums"],
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.lg + ICON_SIZE + Spacing.md,
  },
});
