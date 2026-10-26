import type { Friend, Loan } from "@/lib/loans";

/** Friends the user shares at least one loan with (any status), alphabetically. */
export function friendsWithLoans(friends: Friend[], loans: Loan[]): Friend[] {
  const withLoans = new Set(loans.map((loan) => loan.friendId));
  return friends
    .filter((friend) => withLoans.has(friend.id))
    .sort((a, b) => a.name.localeCompare(b.name));
}
