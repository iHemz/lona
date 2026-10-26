import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { AppState, Linking, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useCloseModal } from "@/hooks/use-close-modal";
import { useSetup } from "@/hooks/use-setup";
import { useThemeColors } from "@/hooks/use-theme";

type Phase = "asking" | "denied";

/** Asks for notification permission over the current screen, with a nudge towards "Allow". */
export default function RemindersScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const close = useCloseModal("/");
  const { completeTask } = useSetup();
  const [phase, setPhase] = useState<Phase>("asking");
  const hasAsked = useRef(false);

  const finish = () => {
    completeTask("reminders");
    router.replace("/setup-complete");
  };

  const ask = useEffectEvent(async () => {
    try {
      let permission = await Notifications.getPermissionsAsync();
      if (!permission.granted && permission.canAskAgain) {
        permission = await Notifications.requestPermissionsAsync();
      }
      if (permission.granted) finish();
      else setPhase("denied");
    } catch {
      setPhase("denied");
    }
  });

  // Ask once on arrival (guarded against effects running twice in development).
  useEffect(() => {
    if (hasAsked.current) return;
    hasAsked.current = true;
    void ask();
  }, []);

  // If they went to Settings and switched notifications on, pick that up when they return.
  const recheck = useEffectEvent(async () => {
    const permission = await Notifications.getPermissionsAsync().catch(() => null);
    if (permission?.granted) finish();
  });
  useEffect(() => {
    if (phase !== "denied") return;
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void recheck();
    });
    return () => subscription.remove();
  }, [phase]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.scrim }]}>
      {phase === "asking" ? (
        <View
          accessibilityLiveRegion="polite"
          style={[
            styles.hint,
            { backgroundColor: colors.surface, marginBottom: insets.bottom + Spacing.xxl },
          ]}
        >
          <SymbolView
            name={{ ios: "arrow.up", android: "arrow_upward", web: "arrow_upward" }}
            size={16}
            tintColor={colors.link}
          />
          <Text style={[styles.hintText, { color: colors.textSecondary }]}>
            Tap “Allow”, this is the only way Lona can remind on your behalf.
          </Text>
        </View>
      ) : (
        <View
          accessibilityViewIsModal
          style={[styles.card, { backgroundColor: colors.background }]}
        >
          <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
            Reminders are off
          </Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            Lona can only nudge friends for you with notifications.
            {Platform.OS === "web" ? "" : " Turn them on in Settings, then come back."}
          </Text>
          {Platform.OS !== "web" && (
            <Button label="Open Settings" onPress={() => Linking.openSettings()} />
          )}
          <Button label="Not now" variant="secondary" onPress={close} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: Spacing.xl,
  },
  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.md,
  },
  hintText: {
    flex: 1,
    fontSize: FontSize.footnote,
    lineHeight: 18,
  },
  card: {
    alignSelf: "stretch",
    marginBottom: "40%",
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    gap: Spacing.md,
  },
  title: {
    fontSize: FontSize.heading,
    fontWeight: "700",
  },
  body: {
    fontSize: FontSize.subhead,
    lineHeight: 21,
    marginBottom: Spacing.sm,
  },
});
