import { useNavigation, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { IconButton } from "@/components/ui/icon-button";
import { Spacing } from "@/constants/theme";

const BUTTON_SIZE = 44;

type FriendModalHeaderProps = {
  onAddLoan?: () => void;
  onMore?: () => void;
};

/** Close / new loan / more. Close dismisses the whole friend modal, whichever screen it's on. */
export function FriendModalHeader({ onAddLoan, onMore }: FriendModalHeaderProps) {
  const navigation = useNavigation();
  const router = useRouter();

  const close = () => {
    const modal = navigation.getParent();
    if (modal?.canGoBack()) modal.goBack();
    else router.replace("/friends");
  };

  return (
    <View style={styles.row}>
      <IconButton
        icon={{ ios: "xmark", android: "close", web: "close" }}
        accessibilityLabel="Close"
        onPress={close}
        size={BUTTON_SIZE}
      />
      <View style={styles.trailing}>
        <IconButton
          icon={{ ios: "plus", android: "add", web: "add" }}
          accessibilityLabel="New loan"
          onPress={onAddLoan}
          size={BUTTON_SIZE}
          variant="primary"
        />
        <IconButton
          icon={{ ios: "ellipsis", android: "more_horiz", web: "more_horiz" }}
          accessibilityLabel="More options"
          onPress={onMore}
          size={BUTTON_SIZE}
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
