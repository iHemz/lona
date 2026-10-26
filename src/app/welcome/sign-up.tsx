import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GoogleLogo } from "@/components/brand/google-logo";
import { LonaMark } from "@/components/brand/lona-mark";
import { Button } from "@/components/ui/button";
import { FontSize, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { ColorSchemeOverride } from "@/hooks/use-theme-preference";

// Sign in with Apple is native on iOS; elsewhere it needs a web flow, so only offer it on iOS.
const OFFERS_APPLE = Platform.OS === "ios";

// The design keeps this screen dark regardless of the system setting.
export default function SignUpScreen() {
  return (
    <ColorSchemeOverride scheme="dark">
      <StatusBar style="light" />
      <SignUpContent />
    </ColorSchemeOverride>
  );
}

function SignUpContent() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // TODO: sign in with the chosen provider once auth exists. Every option then continues to
  // phone verification, which is how friends find each other.
  const continueWith = () => router.push("/welcome/phone");

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View
        style={styles.backdrop}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <LonaMark size={560} color={colors.surface} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.lg },
        ]}
      >
        <View style={styles.headline}>
          <Text accessibilityRole="header" style={[styles.title, { color: colors.textTertiary }]}>
            Let’s get{"\n"}you <Text style={{ color: colors.text }}>set up</Text>
            <Text style={{ color: colors.primary }}>.</Text>
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Keep your money clear and your friendships intact.
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            label="Continue with Google"
            variant="inverse"
            leading={<GoogleLogo />}
            onPress={continueWith}
          />
          <View style={styles.divider} accessibilityElementsHidden>
            <View style={[styles.rule, { backgroundColor: colors.separator }]} />
            <Text style={[styles.or, { color: colors.textTertiary }]}>OR</Text>
            <View style={[styles.rule, { backgroundColor: colors.separator }]} />
          </View>
          <View style={styles.row}>
            {OFFERS_APPLE && (
              <Button
                label="Apple"
                variant="outline"
                icon={{ ios: "apple.logo" }}
                onPress={continueWith}
                style={styles.half}
              />
            )}
            <Button
              label="Email"
              variant="outline"
              icon={{ ios: "envelope", android: "mail", web: "mail" }}
              onPress={continueWith}
              style={styles.half}
            />
          </View>
          <Text style={[styles.legal, { color: colors.textTertiary }]}>
            By continuing you agree to the{" "}
            <Text accessibilityRole="link" style={{ color: colors.link }}>
              Terms
            </Text>{" "}
            &{" "}
            <Text accessibilityRole="link" style={{ color: colors.link }}>
              Privacy Policy
            </Text>
            .
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  backdrop: {
    position: "absolute",
    top: -40,
    left: -160,
    transform: [{ rotate: "-12deg" }],
  },
  content: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xxxl,
  },
  headline: {
    flex: 1,
    justifyContent: "center",
    gap: Spacing.md,
  },
  title: {
    fontSize: FontSize.display,
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: 46,
  },
  subtitle: {
    fontSize: FontSize.body,
  },
  actions: {
    gap: Spacing.lg,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  rule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  or: {
    fontSize: FontSize.caption,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  half: {
    flex: 1,
  },
  legal: {
    fontSize: FontSize.caption,
    textAlign: "center",
  },
});
