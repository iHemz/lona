import { StyleSheet, View } from "react-native";

import { IconButton } from "@/components/ui/icon-button";
import { PRIMARY_BUTTON_HEIGHT, PrimaryButton } from "@/components/ui/primary-button";
import { Spacing } from "@/constants/theme";

type HomeActionsProps = {
  onRequestLoan?: () => void;
  onMore?: () => void;
};

export function HomeActions({ onRequestLoan, onMore }: HomeActionsProps) {
  return (
    <View style={styles.row}>
      <PrimaryButton label="Request loan" onPress={onRequestLoan} style={styles.primary} />
      <IconButton
        icon={{ ios: "ellipsis", android: "more_horiz", web: "more_horiz" }}
        accessibilityLabel="More actions"
        onPress={onMore}
        size={PRIMARY_BUTTON_HEIGHT}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  primary: {
    flex: 1,
  },
});
