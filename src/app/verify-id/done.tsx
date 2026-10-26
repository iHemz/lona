import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { BackHandler, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SetupChecklist } from "@/components/setup/setup-checklist";
import { Button } from "@/components/ui/button";
import { FontSize, Spacing } from "@/constants/theme";
import { useCloseModal } from "@/hooks/use-close-modal";
import { useSetup } from "@/hooks/use-setup";
import { useThemeColors } from "@/hooks/use-theme";

const BADGE_SIZE = 56;

/** Longer than this and the start time is stale or wrong, so the time isn't worth showing. */
const MAX_PLAUSIBLE_SECONDS = 60 * 60;

/** "Took 40 seconds." from when the user picked their ID type. */
function elapsedLabel(startedAt: string | undefined): string | null {
  const started = Number(startedAt);
  if (!Number.isFinite(started) || started <= 0) return null;
  const seconds = Math.round((Date.now() - started) / 1000);
  if (seconds < 0 || seconds > MAX_PLAUSIBLE_SECONDS) return null;
  return `Took ${seconds} ${seconds === 1 ? "second" : "seconds"}.`;
}

export default function IdVerifiedScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ startedAt?: string }>();
  const { completed } = useSetup();
  const close = useCloseModal("/");
  // Measured once on arrival, not on every render.
  const [elapsed] = useState(() => elapsedLabel(params.startedAt));

  // Android back leaves the flow rather than returning to the camera.
  useFocusEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      close();
      return true;
    });
    return () => subscription.remove();
  });

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + Spacing.xxxl,
          paddingBottom: insets.bottom + Spacing.md,
        },
      ]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <View style={[styles.badge, { backgroundColor: colors.successFill }]}>
            <SymbolView
              name={{ ios: "checkmark", android: "check", web: "check" }}
              size={26}
              weight="bold"
              tintColor={colors.onPrimary}
            />
          </View>
          <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
            ID verified!
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {elapsed ? `${elapsed} ` : ""}You won’t be asked again.
          </Text>
        </View>
        <SetupChecklist completed={completed} />
      </ScrollView>

      <View style={styles.actions}>
        <Button label="Link a card or bank" icon={{ ios: "link", android: "link", web: "link" }} />
        <Button label="Later" variant="secondary" onPress={close} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xxl,
  },
  heading: {
    alignItems: "center",
    gap: Spacing.md,
  },
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: FontSize.title + 4,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: FontSize.subhead,
    textAlign: "center",
    maxWidth: 260,
  },
  actions: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
});
