import { StyleSheet, View } from "react-native";

import { Avatar } from "@/components/ui/avatar";
import { IconButton } from "@/components/ui/icon-button";
import type { Friend } from "@/lib/loans";

type HomeHeaderProps = {
  user: Friend;
  onOpenSettings?: () => void;
};

export function HomeHeader({ user, onOpenSettings }: HomeHeaderProps) {
  return (
    <View style={styles.row}>
      <Avatar name={user.name} colorKey={user.id} size={48} />
      <IconButton
        icon={{ ios: "gearshape", android: "settings", web: "settings" }}
        accessibilityLabel="Settings"
        onPress={onOpenSettings}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
