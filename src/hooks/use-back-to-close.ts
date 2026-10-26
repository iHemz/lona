import { useFocusEffect } from "expo-router";
import { BackHandler } from "react-native";

/**
 * Makes Android's back button run `close` while this screen is focused, e.g. so a
 * success screen leaves its flow instead of going back to the step before it.
 */
export function useBackToClose(close: () => void): void {
  useFocusEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      close();
      return true;
    });
    return () => subscription.remove();
  });
}
