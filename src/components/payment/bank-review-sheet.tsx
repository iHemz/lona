import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BankLogo } from "@/components/payment/bank-logo";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { FontSize, Radius, Spacing, TouchTarget } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { maskedNumber } from "@/lib/account";
import type { Bank } from "@/lib/banks";

const SHEET_RADIUS = 28;

const TERMS: { text: string; isAllowed: boolean }[] = [
  { text: "Confirm the account is yours.", isAllowed: true },
  { text: "Collect agreed repayments on their due dates.", isAllowed: true },
  { text: "Never take anything you haven’t agreed to.", isAllowed: false },
];

type BankReviewSheetProps = {
  bank: Bank | null;
  accountHolder: string;
  /** Last four of the linked card the bank connection is tied to, if any. */
  cardLast4: string | null;
  isConnecting: boolean;
  onConnect: () => void;
  onClose: () => void;
};

/** Review the chosen bank and agree to the mandate before handing off to the bank. */
export function BankReviewSheet({
  bank,
  accountHolder,
  cardLast4,
  isConnecting,
  onConnect,
  onClose,
}: BankReviewSheetProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [hasAgreed, setHasAgreed] = useState(false);

  return (
    <Modal visible={bank !== null} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View
        entering={FadeIn.duration(200)}
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]}
      >
        <Pressable accessibilityLabel="Close" style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      {bank && (
        <Animated.View
          entering={SlideInDown.duration(300)}
          accessibilityViewIsModal
          style={[
            styles.sheet,
            { backgroundColor: colors.background, paddingBottom: insets.bottom + Spacing.lg },
          ]}
        >
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
                  Selected bank
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Review your selected bank
                </Text>
              </View>
              <IconButton
                icon={{ ios: "xmark", android: "close", web: "close" }}
                accessibilityLabel="Close"
                onPress={onClose}
                size={36}
              />
            </View>

            <View
              accessible
              accessibilityLabel={`${accountHolder}, ${bank.name}${cardLast4 ? `, card ending ${cardLast4}` : ""}, selected`}
              style={[
                styles.account,
                { backgroundColor: colors.surface, borderColor: colors.primary },
              ]}
            >
              <View style={styles.logos}>
                <View style={[styles.cardIcon, { backgroundColor: colors.primary }]}>
                  <SymbolView
                    name={{ ios: "creditcard", android: "credit_card", web: "credit_card" }}
                    size={20}
                    tintColor={colors.onPrimary}
                  />
                </View>
                <View style={[styles.bankLogo, { borderColor: colors.surface }]}>
                  <BankLogo bank={bank} size={44} />
                </View>
              </View>
              <View style={styles.accountText}>
                <Text style={[styles.holder, { color: colors.text }]}>{accountHolder}</Text>
                <Text style={[styles.masked, { color: colors.textSecondary }]}>
                  {cardLast4 ? maskedNumber(cardLast4) : bank.name}
                </Text>
              </View>
              <SymbolView
                name={{
                  ios: "checkmark.circle.fill",
                  android: "check_circle",
                  web: "check_circle",
                }}
                size={24}
                tintColor={colors.primary}
              />
            </View>

            <Pressable accessibilityRole="button" onPress={onClose} hitSlop={8}>
              <Text style={[styles.link, { color: colors.link }]}>Add more banks</Text>
            </Pressable>

            <View
              style={[
                styles.terms,
                { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
              ]}
            >
              <Text style={[styles.termsTitle, { color: colors.textSecondary }]}>
                What you’re agreeing to
              </Text>
              {TERMS.map(({ text, isAllowed }) => (
                <View key={text} style={styles.term}>
                  <SymbolView
                    name={
                      isAllowed
                        ? { ios: "checkmark", android: "check", web: "check" }
                        : { ios: "xmark", android: "close", web: "close" }
                    }
                    size={14}
                    tintColor={isAllowed ? colors.success : colors.danger}
                  />
                  <Text style={[styles.termText, { color: colors.textSecondary }]}>{text}</Text>
                </View>
              ))}
              <View style={[styles.divider, { backgroundColor: colors.separator }]} />
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: hasAgreed }}
                onPress={() => setHasAgreed((current) => !current)}
                style={styles.consent}
              >
                <View
                  style={[
                    styles.checkbox,
                    hasAgreed
                      ? { backgroundColor: colors.primary, borderColor: colors.primary }
                      : { borderColor: colors.outlineBorder },
                  ]}
                >
                  {hasAgreed && (
                    <SymbolView
                      name={{ ios: "checkmark", android: "check", web: "check" }}
                      size={14}
                      tintColor={colors.onPrimary}
                    />
                  )}
                </View>
                <Text style={[styles.consentText, { color: colors.text }]}>
                  I fully agree to connect my bank account and set up automatic repayments for my
                  convenience.
                </Text>
              </Pressable>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              label={isConnecting ? `Connecting to ${bank.name}…` : "Go to bank"}
              icon={{ ios: "lock", android: "lock", web: "lock" }}
              trailingIcon={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
              onPress={onConnect}
              disabled={!hasAgreed}
              isLoading={isConnecting}
            />
          </View>
        </Animated.View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: "88%",
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    paddingTop: Spacing.xxl,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  headerText: {
    flex: 1,
    gap: Spacing.xs,
  },
  title: {
    fontSize: FontSize.heading + 2,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: FontSize.subhead,
  },
  account: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 2,
  },
  logos: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  bankLogo: {
    marginLeft: -12,
    borderWidth: 2,
    borderRadius: 24,
  },
  accountText: {
    flex: 1,
    gap: 2,
  },
  holder: {
    fontSize: FontSize.body,
    fontWeight: "700",
  },
  masked: {
    fontSize: FontSize.footnote,
    fontVariant: ["tabular-nums"],
  },
  link: {
    fontSize: FontSize.subhead,
    fontWeight: "600",
  },
  terms: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  termsTitle: {
    fontSize: FontSize.footnote,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  term: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  termText: {
    flex: 1,
    fontSize: FontSize.subhead,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  consent: {
    minHeight: TouchTarget,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  consentText: {
    flex: 1,
    fontSize: FontSize.subhead,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
});
