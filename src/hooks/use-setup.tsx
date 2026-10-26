import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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

function parse(stored: string | null): Set<SetupTaskId> {
  if (!stored) return new Set();
  try {
    const ids: unknown = JSON.parse(stored);
    if (!Array.isArray(ids)) return new Set();
    return new Set(ids.filter((id): id is SetupTaskId => KNOWN_IDS.has(id)));
  } catch {
    return new Set();
  }
}

export function SetupProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [completed, setCompleted] = useState<Set<SetupTaskId>>(new Set());

  useEffect(() => {
    let isActive = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (isActive) setCompleted(parse(stored));
      })
      .catch((error) => console.warn("Couldn't read setup progress", error))
      .finally(() => {
        if (isActive) setIsLoaded(true);
      });
    return () => {
      isActive = false;
    };
  }, []);

  // Save after every change once the stored value has been read (never overwrite it first).
  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])).catch((error) =>
      console.warn("Couldn't save setup progress", error),
    );
  }, [completed, isLoaded]);

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
