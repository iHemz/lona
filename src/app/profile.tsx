import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { LifetimeStats } from "@/components/friend/lifetime-stats";
import { RecordCard } from "@/components/friend/record-card";
import { RepaymentRing } from "@/components/friend/repayment-ring";
import { ProfileHeader } from "@/components/profile/profile-header";
import { LinkList } from "@/components/ui/link-list";
import { ModalCloseButton } from "@/components/ui/modal-close-button";
import { FontSize, Spacing } from "@/constants/theme";
import { useAccount, useLedger } from "@/hooks/use-ledger";
import { useScreenTopPadding } from "@/hooks/use-screen-top-padding";
import { useThemeColors } from "@/hooks/use-theme";
import { maskedNumber } from "@/lib/account";
import { lifetimeTotals, repaymentRecord } from "@/lib/friend-profile";

export default function ProfileScreen() {
  const colors = useThemeColors();
  const topPadding = useScreenTopPadding();
  const router = useRouter();
  const account = useAccount();
  const { loans, currency } = useLedger();

  const totals = lifetimeTotals(loans, currency);
  // Your own record: how reliably you've repaid what you borrowed.
  const record = repaymentRecord(loans, "borrowed");

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[styles.content, { paddingTop: topPadding }]}
    >
      <ModalCloseButton />
      <ProfileHeader account={account} />

      <RecordCard
        onOpen={() => router.navigate("/loans")}
        openLabel="Your loans"
        footer={<LifetimeStats totals={totals} />}
      >
        <View style={styles.recordRow}>
          <RepaymentRing rate={record.onTimeRate} />
          {record.repaid > 0 ? (
            <Text style={[styles.recordText, { color: colors.textSecondary }]}>
              <Text style={[styles.recordCount, { color: colors.text }]}>{record.onTime} of</Text>{" "}
              {record.repaid} {record.repaid === 1 ? "loan" : "loans"} repaid on time
            </Text>
          ) : (
            <Text style={[styles.recordText, { color: colors.textSecondary }]}>
              No loans repaid yet
            </Text>
          )}
        </View>
      </RecordCard>

      <LinkList
        title="Identity"
        items={[
          {
            label: "Personal details",
            icon: { ios: "person", android: "person", web: "person" },
          },
          {
            label: "Phone & email",
            icon: { ios: "envelope", android: "mail", web: "mail" },
            isVerified: account.contactVerified,
          },
          {
            label: "ID verification",
            icon: { ios: "person.text.rectangle", android: "badge", web: "badge" },
            isVerified: account.isVerified,
          },
        ]}
      />

      <LinkList
        title="Money & reminders"
        items={[
          {
            label: "Linked card",
            icon: { ios: "creditcard", android: "credit_card", web: "credit_card" },
            value: account.card ? maskedNumber(account.card.last4) : "Add",
          },
          {
            label: "Bank account",
            icon: { ios: "building.columns", android: "account_balance", web: "account_balance" },
            value: account.bank
              ? `${account.bank.name} ${maskedNumber(account.bank.last4)}`
              : "Add",
          },
          {
            label: "Reminders",
            icon: { ios: "bell", android: "notifications", web: "notifications" },
          },
        ]}
      />

      <LinkList
        title="Privacy & data"
        items={[
          {
            label: "Your data & proof",
            icon: { ios: "folder", android: "folder", web: "folder" },
          },
        ]}
      />

      <LinkList
        title="Support & account"
        items={[
          {
            label: "Help",
            icon: { ios: "questionmark.circle", android: "help", web: "help" },
          },
          {
            label: "Terms & privacy",
            icon: { ios: "doc.text", android: "description", web: "description" },
          },
          {
            label: "Sign out",
            icon: {
              ios: "rectangle.portrait.and.arrow.right",
              android: "logout",
              web: "logout",
            },
            isDestructive: true,
          },
        ]}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.xxl,
  },
  recordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xl,
  },
  recordText: {
    flex: 1,
    fontSize: FontSize.body,
    fontWeight: "600",
  },
  recordCount: {
    fontSize: FontSize.title,
    fontWeight: "700",
  },
});
