export type SetupTaskId = "phone" | "id" | "payment" | "reminders";

export type SetupTask = {
  id: SetupTaskId;
  title: string;
  description: string;
};

/** In order: the index + 1 is the step number shown in flows ("Step 2 of 4"). */
export const SETUP_TASKS: SetupTask[] = [
  { id: "phone", title: "Verify your phone", description: "So friends can find you" },
  { id: "id", title: "Verify your ID", description: "Required before money can move" },
  {
    id: "payment",
    title: "Link a card or bank",
    description: "To send funds and collect repayments",
  },
  { id: "reminders", title: "Turn on reminders", description: "So Lona chases, not you" },
];

export function setupStepNumber(task: SetupTaskId): number {
  return SETUP_TASKS.findIndex((candidate) => candidate.id === task) + 1;
}

export function setupProgress(completed: ReadonlySet<SetupTaskId>): {
  done: number;
  total: number;
} {
  return {
    done: SETUP_TASKS.filter((task) => completed.has(task.id)).length,
    total: SETUP_TASKS.length,
  };
}

export function isSetupComplete(completed: ReadonlySet<SetupTaskId>): boolean {
  const { done, total } = setupProgress(completed);
  return done === total;
}

/** Sending or requesting money needs a verified identity. */
export function canMoveMoney(completed: ReadonlySet<SetupTaskId>): boolean {
  return completed.has("id");
}
