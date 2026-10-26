import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FontSize, Spacing, type ThemeColors } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { describeActivity, type ActivityEvent, type ActivityKind } from "@/lib/activity";
import { formatTime } from "@/lib/dates";
import type { Friend } from "@/lib/loans";

export const ACTIVITY_ICON_SIZE = 36;

type KindStyle = { icon: SymbolViewProps["name"]; background: string; tint: string };

function kindStyle(kind: ActivityKind, colors: ThemeColors): KindStyle {
  const clock = { ios: "clock", android: "schedule", web: "schedule" } as const;
  switch (kind) {
    case "offerSent":
    case "paymentDueSoon":
      return { icon: clock, background: colors.warningSurface, tint: colors.warning };
    case "termsAccepted":
      return {
        icon: { ios: "rosette", android: "workspace_premium", web: "workspace_premium" },
        background: colors.linkSurface,
        tint: colors.link,
      };
    case "paymentSent":
      return {
        icon: { ios: "arrow.up.right", android: "north_east", web: "north_east" },
        background: colors.chipCountSurface,
        tint: colors.text,
      };
    case "paymentReceived":
      return {
        icon: { ios: "arrow.down.left", android: "south_west", web: "south_west" },
        background: colors.successSurface,
        tint: colors.success,
      };
    case "paymentMissed":
      return {
        icon: { ios: "exclamationmark", android: "priority_high", web: "priority_high" },
        background: colors.dangerSurface,
        tint: colors.danger,
      };
  }
}

type ActivityRowProps = {
  event: ActivityEvent;
  friend: Friend;
  onPress?: () => void;
};

export function ActivityRow({ event, friend, onPress }: ActivityRowProps) {
  const colors = useThemeColors();
  const { title, detail } = describeActivity(event, friend);
  const time = formatTime(event.at);
  const { icon, background, tint } = kindStyle(event.kind, colors);
  const isUnread = !event.isRead;

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={[isUnread && "Unread", title, `${time}, ${detail}`]
        .filter(Boolean)
        .join(". ")}
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        isUnread && { backgroundColor: colors.unreadSurface },
        pressed && { backgroundColor: colors.background },
      ]}
    >
      <View style={[styles.icon, { backgroundColor: background }]}>
        <SymbolView name={icon} size={16} tintColor={tint} />
      </View>
      <View style={styles.details}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.detail, { color: colors.textSecondary }]}>
          {time} · {detail}
        </Text>
      </View>
      {/* Colour isn't the only signal: "Unread" is also in the accessibility label. */}
      {isUnread && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
  },
  icon: {
    width: ACTIVITY_ICON_SIZE,
    height: ACTIVITY_ICON_SIZE,
    borderRadius: ACTIVITY_ICON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  details: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: FontSize.body,
    fontWeight: "600",
  },
  detail: {
    fontSize: FontSize.footnote,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
