import { Redirect, useLocalSearchParams } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CodeInput } from "@/components/onboarding/code-input";
import { OnboardingStep } from "@/components/onboarding/onboarding-step";
import { Button } from "@/components/ui/button";
import { FontSize, Spacing } from "@/constants/theme";
import { formatCountdown, useCountdown } from "@/hooks/use-countdown";
import { useOnboarding } from "@/hooks/use-onboarding";
import { useThemeColors } from "@/hooks/use-theme";
import { sendVerificationCode, VERIFICATION_CODE_LENGTH, verifyCode } from "@/lib/mock-auth";
import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  formatInternational,
  isValidNationalNumber,
  toE164,
} from "@/lib/phone";

const RESEND_AFTER_SECONDS = 30;

export default function VerifyScreen() {
  const colors = useThemeColors();
  const { completeOnboarding } = useOnboarding();
  const params = useLocalSearchParams<{ country?: string; digits?: string }>();
  const country =
    COUNTRIES.find((candidate) => candidate.code === params.country) ?? DEFAULT_COUNTRY;
  const digits = params.digits ?? "";
  const phone = toE164(digits, country);

  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resend = useCountdown(RESEND_AFTER_SECONDS);

  // Reached without a number (e.g. a stale link): start the phone step again.
  if (!isValidNationalNumber(digits, country)) return <Redirect href="/welcome/phone" />;

  const verify = async () => {
    setIsVerifying(true);
    setError(null);
    try {
      if (await verifyCode(phone, code)) {
        // The root guard swaps the welcome flow for the app once this is set.
        completeOnboarding();
      } else {
        setError("That code didn’t work. Check it and try again.");
      }
    } catch {
      setError("We couldn’t check the code just now. Try again in a moment.");
    } finally {
      setIsVerifying(false);
    }
  };

  const resendCode = async () => {
    resend.restart();
    setCode("");
    setError(null);
    try {
      await sendVerificationCode(phone);
    } catch {
      setError("We couldn’t send a new code. Try again in a moment.");
    }
  };

  return (
    <OnboardingStep
      title="Enter the code"
      subtitle={
        <>
          Texted to{" "}
          <Text style={[styles.phone, { color: colors.text }]}>
            {formatInternational(digits, country)}
          </Text>
        </>
      }
      footer={
        <Button
          label="Verify & continue"
          onPress={verify}
          disabled={code.length < VERIFICATION_CODE_LENGTH}
          isLoading={isVerifying}
        />
      }
    >
      <View style={styles.fields}>
        <CodeInput
          length={VERIFICATION_CODE_LENGTH}
          value={code}
          onChange={(next) => {
            setCode(next);
            setError(null);
          }}
          hasError={Boolean(error)}
        />

        {error && (
          <Text accessibilityLiveRegion="polite" style={[styles.note, { color: colors.danger }]}>
            {error}
          </Text>
        )}

        {resend.remaining > 0 ? (
          <View style={styles.resend}>
            <SymbolView
              name={{ ios: "arrow.clockwise", android: "refresh", web: "refresh" }}
              size={14}
              tintColor={colors.textTertiary}
            />
            <Text style={[styles.note, { color: colors.textTertiary }]}>
              Resend in {formatCountdown(resend.remaining)}
            </Text>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={resendCode}
            hitSlop={12}
            style={({ pressed }) => [styles.resend, pressed && styles.pressed]}
          >
            <SymbolView
              name={{ ios: "arrow.clockwise", android: "refresh", web: "refresh" }}
              size={14}
              tintColor={colors.link}
            />
            <Text style={[styles.note, styles.resendLabel, { color: colors.link }]}>
              Resend code
            </Text>
          </Pressable>
        )}
      </View>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: Spacing.lg,
  },
  phone: {
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  resend: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    alignSelf: "flex-start",
  },
  resendLabel: {
    fontWeight: "600",
  },
  note: {
    fontSize: FontSize.subhead,
  },
  pressed: {
    opacity: 0.6,
  },
});
