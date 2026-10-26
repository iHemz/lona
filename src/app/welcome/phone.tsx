import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { CountryPicker, FIELD_HEIGHT } from "@/components/onboarding/country-picker";
import { OnboardingStep } from "@/components/onboarding/onboarding-step";
import { Button } from "@/components/ui/button";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { sendVerificationCode } from "@/lib/mock-auth";
import {
  DEFAULT_COUNTRY,
  formatNationalNumber,
  isValidNationalNumber,
  normaliseNationalNumber,
  toE164,
  type Country,
} from "@/lib/phone";

export default function PhoneScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [digits, setDigits] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const isValid = isValidNationalNumber(digits, country);

  const changeCountry = (next: Country) => {
    setCountry(next);
    setDigits((current) => normaliseNationalNumber(current, next));
  };

  const sendCode = async () => {
    setIsSending(true);
    setError(null);
    try {
      await sendVerificationCode(toE164(digits, country));
      router.push({ pathname: "/welcome/verify", params: { country: country.code, digits } });
    } catch {
      setError("We couldn’t send a code just now. Check your connection and try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <OnboardingStep
      title="What's your number?"
      subtitle="It is how friends find you. We will text a code to make sure it's you."
      footer={
        <Button label="Send code" onPress={sendCode} disabled={!isValid} isLoading={isSending} />
      }
    >
      <View style={styles.fields}>
        <View style={styles.row}>
          <CountryPicker value={country} onChange={changeCountry} />
          <TextInput
            value={formatNationalNumber(digits, country)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={(text) => {
              setDigits(normaliseNationalNumber(text, country));
              setError(null);
            }}
            placeholder={formatNationalNumber("7".padEnd(country.lengths[0] ?? 10, "0"), country)}
            placeholderTextColor={colors.textTertiary}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            autoComplete="tel"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => isValid && !isSending && sendCode()}
            accessibilityLabel="Phone number"
            style={[
              styles.input,
              {
                color: colors.text,
                backgroundColor: colors.surface,
                borderWidth: isFocused || error ? 1.5 : StyleSheet.hairlineWidth,
                borderColor: error
                  ? colors.danger
                  : isFocused
                    ? colors.primary
                    : colors.surfaceBorder,
              },
            ]}
          />
        </View>

        {error ? (
          <Text accessibilityLiveRegion="polite" style={[styles.note, { color: colors.danger }]}>
            {error}
          </Text>
        ) : (
          <View style={styles.privacy}>
            <SymbolView
              name={{ ios: "lock", android: "lock", web: "lock" }}
              size={14}
              tintColor={colors.textSecondary}
            />
            <Text style={[styles.note, { color: colors.textSecondary }]}>
              Never shared or shown without your say-so.
            </Text>
          </View>
        )}
      </View>
    </OnboardingStep>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: Spacing.lg,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  input: {
    flex: 1,
    height: FIELD_HEIGHT,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.pill,
    // The coloured border is the focus indicator, so drop the browser's default outline.
    outlineColor: "transparent",
    fontSize: FontSize.body + 1,
    fontVariant: ["tabular-nums"],
  },
  privacy: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  note: {
    fontSize: FontSize.subhead,
  },
});
