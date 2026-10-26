import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import type { Account } from "@/lib/account";

const AVATAR_SIZE = 80;
const BADGE_SIZE = 28;

type ProfileHeaderProps = {
  account: Account;
  onChangePhoto?: () => void;
};

export function ProfileHeader({ account, onChangePhoto }: ProfileHeaderProps) {
  const colors = useThemeColors();
  const { user, isVerified } = account;
  const memberSince = `member since ${user.joinedOn.slice(0, 4)}`;

  return (
    <View style={styles.container}>
      <View>
        <Avatar name={user.name} colorKey={user.id} size={AVATAR_SIZE} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change photo"
          onPress={onChangePhoto}
          hitSlop={8}
          style={[
            styles.badge,
            { backgroundColor: colors.inverse, borderColor: colors.background },
          ]}
        >
          <SymbolView
            name={{ ios: "camera.fill", android: "photo_camera", web: "photo_camera" }}
            size={12}
            tintColor={colors.onInverse}
          />
        </Pressable>
      </View>
      <Text accessibilityRole="header" style={[styles.name, { color: colors.text }]}>
        {user.name}
      </Text>
      <View style={[styles.pill, { backgroundColor: colors.successSurface }]}>
        <SymbolView
          name={
            isVerified
              ? { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }
              : { ios: "clock", android: "schedule", web: "schedule" }
          }
          size={14}
          tintColor={colors.success}
        />
        <Text style={[styles.pillText, { color: colors.success }]}>
          {isVerified ? "Verified" : "Not verified yet"} · {memberSince}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: Spacing.md,
  },
  badge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: FontSize.title,
    fontWeight: "700",
    textAlign: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.pill,
  },
  pillText: {
    fontSize: FontSize.footnote,
    fontWeight: "600",
  },
});
