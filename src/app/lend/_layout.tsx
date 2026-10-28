import { Redirect, Stack } from "expo-router";

import { useSetup } from "@/hooks/use-setup";
import { canMoveMoney } from "@/lib/setup";

export default function LendLayout() {
  const { completed } = useSetup();

  // Lending needs setup finished; also covers deep links that skip the Home sheet.
  if (!canMoveMoney(completed)) return <Redirect href="/" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
