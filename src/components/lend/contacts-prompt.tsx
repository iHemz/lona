import { StyleSheet, View } from "react-native";

import { FriendsIllustration } from "@/components/friends/friends-illustration";
import { EmptyState } from "@/components/ui/empty-state";
import { Radius, Spacing } from "@/constants/theme";
import type { ContactsAccess } from "@/hooks/use-phone-contacts";
import { useThemeColors } from "@/hooks/use-theme";

const CONNECT_ICON = { ios: "link", android: "link", web: "link" } as const;

type ContactsPromptProps = {
  access: Exclude<ContactsAccess, "granted" | "checking">;
  onConnect: () => void;
};

/** Stands in for the contacts list until the address book is connected. */
export function ContactsPrompt({ access, onConnect }: ContactsPromptProps) {
  const colors = useThemeColors();

  const copy = {
    ask: {
      body: "Connect your contacts to find who’s already on Lona, or text the request to anyone.",
      action: { label: "Connect contacts", icon: CONNECT_ICON, onPress: onConnect },
    },
    blocked: {
      body: "Lona doesn’t have access to your contacts. Turn it on in Settings, then come back.",
      action: { label: "Open Settings", onPress: onConnect },
    },
    unavailable: {
      body: "Contacts are available in the Lona app on your phone.",
      action: undefined,
    },
  }[access];

  return (
    <View
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
    >
      <EmptyState
        illustration={<FriendsIllustration />}
        title="No contacts connected yet"
        body={copy.body}
        action={copy.action && { ...copy.action, variant: "primary", size: "compact" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxxl,
  },
});
