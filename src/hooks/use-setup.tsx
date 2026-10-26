import { createContext, useContext, type ReactNode } from "react";

import { usePersistedState } from "@/hooks/use-persisted-state";
import { SETUP_TASKS, type SetupTaskId } from "@/lib/setup";

// Device-local until there's a backend; the server will own this once accounts exist.
const STORAGE_KEY = "lona.setup.completed";

type SetupContextValue = {
  isLoaded: boolean;
  completed: ReadonlySet<SetupTaskId>;
  completeTask: (task: SetupTaskId) => void;
  /** Developer helpers. */
  completeAll: () => void;
  reset: () => void;
};

const SetupContext = createContext<SetupContextValue>({
  isLoaded: false,
  completed: new Set(),
  completeTask: () => {},
  completeAll: () => {},
  reset: () => {},
});

const KNOWN_IDS = new Set<string>(SETUP_TASKS.map((task) => task.id));

const taskSetCodec = {
  parse: (stored: string): Set<SetupTaskId> => {
    const ids: unknown = JSON.parse(stored);
    if (!Array.isArray(ids)) return new Set();
    return new Set(ids.filter((id): id is SetupTaskId => KNOWN_IDS.has(id)));
  },
  serialize: (completed: Set<SetupTaskId>) => JSON.stringify([...completed]),
};

export function SetupProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted, isLoaded] = usePersistedState(
    STORAGE_KEY,
    new Set<SetupTaskId>(),
    taskSetCodec,
  );

  const value: SetupContextValue = {
    isLoaded,
    completed,
    // Functional updates so several tasks completed in one tick don't overwrite each other.
    completeTask: (task) => setCompleted((current) => new Set([...current, task])),
    completeAll: () => setCompleted(new Set(SETUP_TASKS.map((task) => task.id))),
    reset: () => setCompleted(new Set()),
  };

  return <SetupContext.Provider value={value}>{children}</SetupContext.Provider>;
}

export function useSetup(): SetupContextValue {
  return useContext(SetupContext);
}
