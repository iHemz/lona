import { SetupChecklist } from "@/components/setup/setup-checklist";
import { SetupCompleteLayout } from "@/components/setup/setup-complete-layout";
import { Button } from "@/components/ui/button";
import { useBackToClose } from "@/hooks/use-back-to-close";
import { useCloseModal } from "@/hooks/use-close-modal";
import { useSetup } from "@/hooks/use-setup";

export default function SetupCompleteScreen() {
  const { completed } = useSetup();
  const goHome = useCloseModal("/");
  useBackToClose(goHome);

  return (
    <SetupCompleteLayout
      title="You’re all set up!"
      subtitle="Ready to lend or borrow, and Lona handles the awkward part."
      actions={<Button label="Go home" onPress={goHome} />}
    >
      <SetupChecklist completed={completed} />
    </SetupCompleteLayout>
  );
}
