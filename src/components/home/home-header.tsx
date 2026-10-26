import { Pressable, StyleSheet, View } from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { IconButton } from "@/components/ui/icon-button";
import type { Friend } from "@/lib/loans";

type HomeHeaderProps = {
  user: Friend;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
};

export function HomeHeader({ user, onOpenProfile, onOpenSettings }: HomeHeaderProps) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Your profile"
        onPress={onOpenProfile}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <Avatar name={user.name} colorKey={user.id} size={48} />
      </Pressable>
      <IconButton
        icon={{ ios: "gearshape", android: "settings", web: "settings" }}
        accessibilityLabel="Settings"
        onPress={onOpenSettings}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
