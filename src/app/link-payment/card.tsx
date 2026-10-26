import { SymbolView } from "expo-symbols";
import { useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { CardPreview } from "@/components/payment/card-preview";
import { FieldPill } from "@/components/payment/field-pill";
import { SetupStepLayout } from "@/components/setup/setup-step-layout";
import { Button } from "@/components/ui/button";
import { FontSize, Spacing } from "@/constants/theme";
import { useSavePaymentMethod } from "@/hooks/use-save-payment-method";
import { useThemeColors } from "@/hooks/use-theme";
import {
  cvcLength,
  detectCardBrand,
  digitsOnly,
  formatCardNumber,
  formatExpiry,
  isValidCard,
  isValidCardNumber,
  isValidCvc,
  isValidExpiry,
  normaliseCardNumber,
} from "@/lib/card";
import { addDebitCard } from "@/lib/mock-payments";

const EXPIRY_LENGTH = "MM/YY".length;

export default function AddCardScreen() {
  const colors = useThemeColors();
  const { saveCard } = useSavePaymentMethod();
  const expiryRef = useRef<TextInput>(null);
  const cvcRef = useRef<TextInput>(null);

  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const brand = detectCardBrand(number);
  const isNumberComplete = number.length >= (brand === "amex" ? 15 : 16);
  const numberError = isNumberComplete && !isValidCardNumber(number);
  const expiryError = expiry.length === EXPIRY_LENGTH && !isValidExpiry(expiry);
  const cvcError = cvc.length === cvcLength(brand) && !isValidCvc(cvc, brand);
  const details = { number, expiry, cvc };

  const hint = numberError
    ? "Check the card number."
    : expiryError
      ? "Check the expiry date. It can’t be in the past."
      : cvcError
        ? "Check the security code."
        : error;

  const save = async () => {
    setIsSaving(true);
    setError(null);
    try {
      saveCard(await addDebitCard(details));
    } catch {
      setError("We couldn’t add this card. Check the details and try again.");
      setIsSaving(false);
    }
  };

  return (
    <SetupStepLayout
      task="payment"
      title="Connect your card"
      subtitle="So transfers and repayments happen automatically."
      footer={
        <Button
          label="Add a debit card"
          onPress={save}
          disabled={!isValidCard(details)}
          isLoading={isSaving}
        />
      }
    >
      <CardPreview number={number} expiry={expiry} cvc={cvc} />

      <View style={styles.pills}>
        <View style={styles.hintRow}>
          <SymbolView
            name={{ ios: "hand.tap", android: "touch_app", web: "touch_app" }}
            size={14}
            tintColor={colors.textSecondary}
          />
          <Text style={[styles.hintLabel, { color: colors.textSecondary }]}>
            Tap a pill to change it
          </Text>
        </View>
        <FieldPill
          label="Card No:"
          value={formatCardNumber(number)}
          onChangeText={(text) => {
            const next = normaliseCardNumber(text);
            setNumber(next);
            if (isValidCardNumber(next)) expiryRef.current?.focus();
          }}
          placeholder="1234 5678 9012 3456"
          keyboardType="number-pad"
          textContentType="creditCardNumber"
          autoComplete="cc-number"
          autoFocus
          hasError={numberError}
        />
        <FieldPill
          ref={expiryRef}
          label="Expires:"
          value={expiry}
          onChangeText={(text) => {
            const next = formatExpiry(text);
            setExpiry(next);
            if (next.length === EXPIRY_LENGTH && isValidExpiry(next)) cvcRef.current?.focus();
          }}
          placeholder="MM/YY"
          keyboardType="number-pad"
          autoComplete="cc-exp"
          hasError={expiryError}
        />
        <FieldPill
          ref={cvcRef}
          label="CVV:"
          value={cvc}
          onChangeText={(text) => setCvc(digitsOnly(text).slice(0, cvcLength(brand)))}
          placeholder={"0".repeat(cvcLength(brand))}
          keyboardType="number-pad"
          autoComplete="cc-csc"
          hasError={cvcError}
        />
        {hint && (
          <Text accessibilityLiveRegion="polite" style={[styles.error, { color: colors.danger }]}>
            {hint}
          </Text>
        )}
      </View>
    </SetupStepLayout>
  );
}

const styles = StyleSheet.create({
  pills: {
    gap: Spacing.md,
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  hintLabel: {
    fontSize: FontSize.caption,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  error: {
    fontSize: FontSize.subhead,
  },
});
