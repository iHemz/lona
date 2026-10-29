import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import { SetupChecklist } from "@/components/setup/setup-checklist";
import { Button } from "@/components/ui/button";
import { SuccessLayout } from "@/components/ui/success-layout";
import { useBackToClose } from "@/hooks/use-back-to-close";
import { useCloseModal } from "@/hooks/use-close-modal";
import { useSetup } from "@/hooks/use-setup";

/** Longer than this and the start time is stale or wrong, so the time isn't worth showing. */
const MAX_PLAUSIBLE_SECONDS = 60 * 60;

/** "Took 40 seconds." from when the user picked their ID type. */
function elapsedLabel(startedAt: string | undefined): string | null {
  const started = Number(startedAt);
  if (!Number.isFinite(started) || started <= 0) return null;
  const seconds = Math.round((Date.now() - started) / 1000);
  if (seconds < 0 || seconds > MAX_PLAUSIBLE_SECONDS) return null;
  return `Took ${seconds} ${seconds === 1 ? "second" : "seconds"}.`;
}

export default function IdVerifiedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ startedAt?: string }>();
  const { completed } = useSetup();
  const close = useCloseModal("/");
  // Measured once on arrival, not on every render.
  const [elapsed] = useState(() => elapsedLabel(params.startedAt));
  // Android back leaves the flow rather than returning to the camera.
  useBackToClose(close);

  return (
    <SuccessLayout
      title="ID verified!"
      subtitle={`${elapsed ? `${elapsed} ` : ""}You won’t be asked again.`}
      actions={
        <>
          <Button
            label="Link a card or bank"
            icon={{ ios: "link", android: "link", web: "link" }}
            onPress={() => router.replace("/link-payment")}
          />
          <Button label="Later" variant="secondary" onPress={close} />
        </>
      }
    >
      <SetupChecklist completed={completed} />
    </SuccessLayout>
  );
}
