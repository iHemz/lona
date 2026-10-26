import { StyleSheet, View } from "react-native";

import { IconButton } from "@/components/ui/icon-button";
import { ModalCloseButton } from "@/components/ui/modal-close-button";
import { Spacing } from "@/constants/theme";

type FriendModalHeaderProps = {
  onAddLoan?: () => void;
  onMore?: () => void;
};

/** Close / new loan / more. Close dismisses the whole friend modal, whichever screen it's on. */
export function FriendModalHeader({ onAddLoan, onMore }: FriendModalHeaderProps) {
  return (
    <View style={styles.row}>
      <ModalCloseButton fallback="/friends" />
      <View style={styles.trailing}>
        <IconButton
          icon={{ ios: "plus", android: "add", web: "add" }}
          accessibilityLabel="New loan"
          onPress={onAddLoan}
          variant="primary"
        />
        <IconButton
          icon={{ ios: "ellipsis", android: "more_horiz", web: "more_horiz" }}
          accessibilityLabel="More options"
          onPress={onMore}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  trailing: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
});
