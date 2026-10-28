import { SymbolView } from "expo-symbols";
import { Share, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

const INVITE_MESSAGE =
  "I’m using Lona to lend to friends and settle up without the awkward chasing. Join me on Lona so we can keep track together.";

/** Nudge to invite someone who isn't on Lona yet, via the system share sheet. */
export function InviteBanner() {
  const colors = useThemeColors();

  const invite = () => {
    // Dismissing the share sheet isn't an error worth surfacing.
    Share.share({ message: INVITE_MESSAGE }).catch(() => {});
  };

  return (
    <View style={[styles.banner, { backgroundColor: colors.summarySurface }]}>
      <View style={styles.message}>
        <SymbolView
          name={{ ios: "person.crop.rectangle.stack", android: "contacts", web: "contacts" }}
          size={18}
          tintColor={colors.text}
        />
        <Text style={[styles.text, { color: colors.text }]}>
          Invite friends from your phone contacts to join you on Lona.
        </Text>
      </View>
      <Button
        label="Invite contact"
        icon={{ ios: "plus", android: "add", web: "add" }}
        variant="secondary"
        size="compact"
        onPress={invite}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    gap: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
  },
  message: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  text: {
    flex: 1,
    fontSize: FontSize.subhead,
    lineHeight: 21,
  },
});
