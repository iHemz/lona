import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PlaceholderScreen } from "@/components/ui/placeholder-screen";
import { StepNavBar } from "@/components/ui/step-header";
import { Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type AmountParams = {
  name: string;
  /** Set when lending to a friend already on Lona. */
  friendId?: string;
  /** Set when lending to a phone contact who'll be invited. */
  phone?: string;
};

// Placeholder for step 2 until the amount screen is designed.
export default function LendAmountScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { name } = useLocalSearchParams<AmountParams>();

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.background, paddingTop: insets.top + Spacing.sm },
      ]}
    >
      <StepNavBar />
      <PlaceholderScreen title={`Lend to ${name ?? "your friend"}`} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
