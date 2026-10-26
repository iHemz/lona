import { StyleSheet, View } from "react-native";

import { CardStackIllustration } from "@/components/ui/card-stack-illustration";
import { EmptyState } from "@/components/ui/empty-state";
import { LOAN_STACK_ICON } from "@/constants/icons";
import { Spacing } from "@/constants/theme";
import type { LoanTab } from "@/lib/loans-list";

const COPY: Record<LoanTab, { title: string; body: string }> = {
  lent: {
    title: "No recent loan",
    body: "Loans you make or receive will show up here, newest first.",
  },
  borrowed: {
    title: "Nothing borrowed",
    body: "Loans friends make to you will show up here.",
  },
  settled: {
    title: "No settled loans yet",
    body: "Loans that have been fully repaid will show up here.",
  },
};

type LoansEmptyProps = {
  tab: LoanTab;
  onSetUpLoan?: () => void;
};

export function LoansEmpty({ tab, onSetUpLoan }: LoansEmptyProps) {
  const { title, body } = COPY[tab];

  return (
    <View style={styles.container}>
      <EmptyState
        illustration={<CardStackIllustration icon={LOAN_STACK_ICON} />}
        title={title}
        body={body}
        action={
          tab === "lent"
            ? {
                label: "Set up your first loan",
                icon: { ios: "plus", android: "add", web: "add" },
                onPress: onSetUpLoan,
                variant: "primary",
                size: "large",
              }
            : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xxxl * 2,
  },
});
