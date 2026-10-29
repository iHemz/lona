import { Redirect, Stack } from "expo-router";

import { LendDraftProvider } from "@/hooks/use-lend-draft";
import { useSetup } from "@/hooks/use-setup";
import { canMoveMoney } from "@/lib/setup";

export default function LendLayout() {
  const { completed } = useSetup();

  // Lending needs setup finished; also covers deep links that skip the Home sheet.
  if (!canMoveMoney(completed)) return <Redirect href="/" />;

  return (
    <LendDraftProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Once sent there's nothing to go back to; the screen offers its own exits. */}
        <Stack.Screen name="sent" options={{ gestureEnabled: false, animation: "fade" }} />
      </Stack>
    </LendDraftProvider>
  );
}
