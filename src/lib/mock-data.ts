import type { ActivityEvent } from "@/lib/activity";
import { addDays, type IsoDate } from "@/lib/dates";
import type { Friend, Loan } from "@/lib/loans";

export const MOCK_CURRENT_USER: Friend = { id: "me", name: "Ade Lawal", joinedOn: "2025-01-15" };

export type MockScenario = "populated" | "empty";

/** Preview the empty states with `EXPO_PUBLIC_MOCK_SCENARIO=empty` (e.g. in `.env.local`). */
export const MOCK_SCENARIO: MockScenario =
  process.env.EXPO_PUBLIC_MOCK_SCENARIO === "empty" ? "empty" : "populated";

// Stand-in data until there's a backend. Dates are relative to `today` so due/late
// labels stay meaningful whenever the app is run.
export function createMockLedger(
  today: IsoDate,
  scenario: MockScenario = MOCK_SCENARIO,
): { friends: Friend[]; loans: Loan[]; activity: ActivityEvent[] } {
  const on = (days: number) => addDays(today, days);
  /** A local date-time `days` from today, e.g. at(-1, "18:40"). */
  const at = (days: number, time: string) => `${on(days)}T${time}:00`;
  const gbp = (amountMinor: number) => ({ amountMinor, currency: "GBP" });

  const friends: Friend[] = [
    { id: "sasha-bello", name: "Sasha Bello", joinedOn: on(-400) },
    { id: "alex-liu", name: "Alex Liu", joinedOn: on(-180) },
    { id: "sasha-roy", name: "Sasha Roy", joinedOn: on(-21) },
    { id: "marcus-richmond", name: "Marcus Richmond", joinedOn: on(-95) },
    { id: "jacob-jonas", name: "Jacob Jonas", joinedOn: on(-60) },
    { id: "priya-shah", name: "Priya Shah", joinedOn: on(-370) },
    { id: "tom-okafor", name: "Tom Okafor", joinedOn: on(-12) },
    { id: "chloe-park", name: "Chloe Park", joinedOn: on(-730) },
  ];

  const loans: Loan[] = [
    {
      id: "loan-1",
      friendId: "sasha-bello",
      direction: "lent",
      currency: "GBP",
      principalMinor: 30000,
      repaidMinor: 10000,
      createdOn: on(-60),
      schedule: [
        { dueDate: on(-20), amountMinor: 10000 },
        { dueDate: on(12), amountMinor: 5000 },
        { dueDate: on(42), amountMinor: 5000 },
        { dueDate: on(72), amountMinor: 10000 },
      ],
    },
    {
      id: "loan-2",
      friendId: "alex-liu",
      direction: "lent",
      currency: "GBP",
      principalMinor: 15000,
      repaidMinor: 0,
      createdOn: on(-10),
      schedule: [{ dueDate: on(3), amountMinor: 15000 }],
    },
    {
      id: "loan-3",
      friendId: "sasha-roy",
      direction: "lent",
      currency: "GBP",
      principalMinor: 10000,
      repaidMinor: 5000,
      createdOn: on(-20),
      schedule: [
        { dueDate: on(-5), amountMinor: 5000 },
        { dueDate: on(30), amountMinor: 5000 },
      ],
    },
    {
      id: "loan-4",
      friendId: "marcus-richmond",
      direction: "lent",
      currency: "GBP",
      principalMinor: 10000,
      repaidMinor: 9000,
      createdOn: on(-25),
      schedule: [
        { dueDate: on(-10), amountMinor: 5000 },
        { dueDate: on(30), amountMinor: 5000 },
      ],
    },
    {
      id: "loan-5",
      friendId: "marcus-richmond",
      direction: "lent",
      currency: "GBP",
      principalMinor: 5000,
      repaidMinor: 3000,
      createdOn: on(-30),
      schedule: [
        { dueDate: on(-12), amountMinor: 2500 },
        { dueDate: on(45), amountMinor: 2500 },
      ],
    },
    {
      id: "loan-6",
      friendId: "jacob-jonas",
      direction: "lent",
      currency: "GBP",
      principalMinor: 15000,
      repaidMinor: 11946,
      createdOn: on(-40),
      schedule: [
        { dueDate: on(-30), amountMinor: 7500 },
        { dueDate: on(-2), amountMinor: 7500 },
      ],
    },
    {
      id: "loan-7",
      friendId: "priya-shah",
      direction: "borrowed",
      currency: "GBP",
      principalMinor: 2500,
      repaidMinor: 0,
      createdOn: on(-5),
      schedule: [{ dueDate: on(14), amountMinor: 2500 }],
    },
    {
      id: "loan-8",
      friendId: "tom-okafor",
      direction: "borrowed",
      currency: "GBP",
      principalMinor: 6000,
      repaidMinor: 2000,
      createdOn: on(-15),
      schedule: [
        { dueDate: on(-1), amountMinor: 2000 },
        { dueDate: on(20), amountMinor: 4000 },
      ],
    },
    {
      id: "loan-9",
      friendId: "chloe-park",
      direction: "lent",
      currency: "GBP",
      principalMinor: 8000,
      repaidMinor: 8000,
      createdOn: on(-90),
      schedule: [{ dueDate: on(-45), amountMinor: 8000 }],
      settledOn: on(-46),
    },
    {
      id: "loan-10",
      friendId: "marcus-richmond",
      direction: "borrowed",
      currency: "GBP",
      principalMinor: 15000,
      repaidMinor: 5000,
      createdOn: on(-35),
      schedule: [
        { dueDate: on(-5), amountMinor: 5000 },
        { dueDate: on(25), amountMinor: 5000 },
        { dueDate: on(55), amountMinor: 5000 },
      ],
    },
    {
      id: "loan-11",
      friendId: "marcus-richmond",
      direction: "lent",
      currency: "GBP",
      principalMinor: 20000,
      repaidMinor: 20000,
      createdOn: on(-140),
      schedule: [{ dueDate: on(-110), amountMinor: 20000 }],
      settledOn: on(-112),
    },
    {
      id: "loan-12",
      friendId: "marcus-richmond",
      direction: "borrowed",
      currency: "GBP",
      principalMinor: 18000,
      repaidMinor: 18000,
      createdOn: on(-200),
      schedule: [
        { dueDate: on(-170), amountMinor: 6000 },
        { dueDate: on(-140), amountMinor: 6000 },
        { dueDate: on(-110), amountMinor: 6000 },
      ],
      settledOn: on(-111),
    },
    {
      id: "loan-13",
      friendId: "marcus-richmond",
      direction: "lent",
      currency: "GBP",
      principalMinor: 9500,
      repaidMinor: 9500,
      createdOn: on(-260),
      schedule: [{ dueDate: on(-230), amountMinor: 9500 }],
      // Repaid a week late.
      settledOn: on(-223),
    },
    {
      id: "loan-14",
      friendId: "marcus-richmond",
      direction: "lent",
      currency: "GBP",
      principalMinor: 10000,
      repaidMinor: 10000,
      createdOn: on(-320),
      schedule: [
        { dueDate: on(-300), amountMinor: 5000 },
        { dueDate: on(-270), amountMinor: 5000 },
      ],
      settledOn: on(-271),
    },
  ];

  const activity: ActivityEvent[] = [
    {
      id: "event-1",
      kind: "offerSent",
      friendId: "sasha-roy",
      at: at(0, "11:40"),
      isRead: false,
    },
    {
      id: "event-2",
      kind: "paymentDueSoon",
      friendId: "alex-liu",
      loanId: "loan-2",
      at: at(0, "09:00"),
      amount: gbp(15000),
      dueDate: on(3),
      isRead: true,
    },
    {
      id: "event-3",
      kind: "paymentSent",
      friendId: "tom-okafor",
      loanId: "loan-8",
      at: at(-1, "18:40"),
      amount: gbp(2000),
      isRead: false,
    },
    {
      id: "event-4",
      kind: "paymentMissed",
      friendId: "jacob-jonas",
      loanId: "loan-6",
      at: at(-1, "09:00"),
      amount: gbp(3054),
      dueDate: on(-2),
      isRead: true,
    },
    {
      id: "event-5",
      kind: "termsAccepted",
      friendId: "alex-liu",
      loanId: "loan-2",
      at: at(-10, "12:03"),
      amount: gbp(15000),
      isRead: true,
    },
    {
      id: "event-6",
      kind: "paymentReceived",
      friendId: "chloe-park",
      loanId: "loan-9",
      at: at(-46, "19:20"),
      amount: gbp(8000),
      settlesLoan: true,
      isRead: true,
    },
  ];

  return scenario === "empty" ? { friends, loans: [], activity: [] } : { friends, loans, activity };
}
