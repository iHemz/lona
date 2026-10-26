import { Stack } from "expo-router";

export default function LinkPaymentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Once connected there's nothing to go back to; the screen offers its own exits. */}
      <Stack.Screen name="connected" options={{ gestureEnabled: false, animation: "fade" }} />
    </Stack>
  );
}
