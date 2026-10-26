import type { Ref } from "react";
import { StyleSheet, View } from "react-native";

import { BUTTON_HEIGHT, Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Spacing } from "@/constants/theme";

type HomeActionsProps = {
  /** False until the user can move money (ID verified). */
  canRequestLoan: boolean;
  onRequestLoan?: () => void;
  onMore?: () => void;
  /** Lets the Home tour point at the "•••" button. */
  moreRef?: Ref<View>;
};

export function HomeActions({ canRequestLoan, onRequestLoan, onMore, moreRef }: HomeActionsProps) {
  return (
    <View style={styles.row}>
      <Button
        label="Request loan"
        onPress={onRequestLoan}
        disabled={!canRequestLoan}
        style={styles.primary}
      />
      <IconButton
        ref={moreRef}
        icon={{ ios: "ellipsis", android: "more_horiz", web: "more_horiz" }}
        accessibilityLabel="More actions"
        onPress={onMore}
        size={BUTTON_HEIGHT.large}
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
