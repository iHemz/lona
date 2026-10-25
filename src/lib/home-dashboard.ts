import type { IsoDate } from "@/lib/dates";
import {
  overdueInstalmentCount,
  pickFeaturedLoan,
  summariseLentLoansByFriend,
  totalOutstanding,
  type Friend,
  type FriendLoanSummary,
  type Loan,
} from "@/lib/loans";
import type { CurrencyCode, Money } from "@/lib/money";

export const RECENT_LOANS_LIMIT = 4;

export type HomeDashboard = {
  owedToYou: Money;
  youOwe: Money;
  featured: { loan: Loan; friend: Friend; isOverdue: boolean } | null;
  recentLoans: FriendLoanSummary[];
};

export function buildHomeDashboard({
  loans,
  friends,
  today,
  currency,
}: {
  loans: Loan[];
  friends: Friend[];
  today: IsoDate;
  currency: CurrencyCode;
}): HomeDashboard {
  const featuredLoan = pickFeaturedLoan(loans, currency);
  const featuredFriend = friends.find((friend) => friend.id === featuredLoan?.friendId);

  return {
    owedToYou: totalOutstanding(loans, "lent", currency),
    youOwe: totalOutstanding(loans, "borrowed", currency),
    featured:
      featuredLoan && featuredFriend
        ? {
            loan: featuredLoan,
            friend: featuredFriend,
            isOverdue: overdueInstalmentCount(featuredLoan, today) > 0,
          }
        : null,
    recentLoans: summariseLentLoansByFriend(loans, friends, today).slice(0, RECENT_LOANS_LIMIT),
  };
}
