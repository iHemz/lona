import { Stack } from "expo-router";

export default function VerifyIdLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Once verified there's nothing to go back to; the screen offers its own exits. */}
      <Stack.Screen name="done" options={{ gestureEnabled: false, animation: "fade" }} />
    </Stack>
  );
}
