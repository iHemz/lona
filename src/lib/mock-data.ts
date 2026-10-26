import { addDays, type IsoDate } from "@/lib/dates";
import type { Friend, Loan } from "@/lib/loans";

export const MOCK_CURRENT_USER: Friend = { id: "me", name: "Ade Lawal" };

export type MockScenario = "populated" | "empty";

/** Preview the empty states with `EXPO_PUBLIC_MOCK_SCENARIO=empty` (e.g. in `.env.local`). */
export const MOCK_SCENARIO: MockScenario =
  process.env.EXPO_PUBLIC_MOCK_SCENARIO === "empty" ? "empty" : "populated";

// Stand-in data until there's a backend. Dates are relative to `today` so due/late
// labels stay meaningful whenever the app is run.
export function createMockLedger(
  today: IsoDate,
  scenario: MockScenario = MOCK_SCENARIO,
): { friends: Friend[]; loans: Loan[] } {
  const on = (days: number) => addDays(today, days);

  const friends: Friend[] = [
    { id: "sasha-bello", name: "Sasha Bello" },
    { id: "alex-liu", name: "Alex Liu" },
    { id: "sasha-roy", name: "Sasha Roy" },
    { id: "marcus-richmond", name: "Marcus Richmond" },
    { id: "jacob-jonas", name: "Jacob Jonas" },
    { id: "priya-shah", name: "Priya Shah" },
    { id: "tom-okafor", name: "Tom Okafor" },
    { id: "chloe-park", name: "Chloe Park" },
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
    },
  ];

  return { friends, loans: scenario === "empty" ? [] : loans };
}
