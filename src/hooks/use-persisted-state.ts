import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useEffectEvent, useState, type Dispatch, type SetStateAction } from "react";

type Codec<T> = {
  /** Turns the stored string back into a value; throw (or return the default) if it's invalid. */
  parse: (stored: string) => T;
  serialize: (value: T) => string;
};

/**
 * State that survives restarts, stored on the device with AsyncStorage. For non-sensitive
 * values only; secrets belong in expo-secure-store.
 *
 * Returns `[value, setValue, isLoaded]`. Until `isLoaded`, `value` is `initial`, and nothing
 * is written back, so the stored value is never overwritten before it has been read.
 */
export function usePersistedState<T>(
  key: string,
  initial: T,
  codec: Codec<T>,
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [isLoaded, setIsLoaded] = useState(false);
  // Effect events: the codec is used by the effects but shouldn't re-run them.
  const parse = useEffectEvent((stored: string) => codec.parse(stored));
  const serialize = useEffectEvent((current: T) => codec.serialize(current));

  useEffect(() => {
    let isActive = true;
    AsyncStorage.getItem(key)
      .then((stored) => {
        if (!isActive || stored === null) return;
        try {
          setValue(parse(stored));
        } catch {
          // Corrupt or outdated data: keep the default rather than crash.
        }
      })
      .catch((error) => console.warn(`Couldn't read "${key}"`, error))
      .finally(() => {
        if (isActive) setIsLoaded(true);
      });
    return () => {
      isActive = false;
    };
  }, [key]);

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(key, serialize(value)).catch((error) =>
      console.warn(`Couldn't save "${key}"`, error),
    );
  }, [key, value, isLoaded]);

  return [value, setValue, isLoaded];
}
