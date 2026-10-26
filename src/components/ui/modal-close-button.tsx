import type { Href } from "expo-router";

import { IconButton } from "@/components/ui/icon-button";
import { useCloseModal } from "@/hooks/use-close-modal";

type ModalCloseButtonProps = {
  /** Where to go when there's nothing to close back to (e.g. opened from a link). */
  fallback?: Href;
};

export function ModalCloseButton({ fallback = "/" }: ModalCloseButtonProps) {
  const close = useCloseModal(fallback);

  return (
    <IconButton
      icon={{ ios: "xmark", android: "close", web: "close" }}
      accessibilityLabel="Close"
      onPress={close}
    />
  );
}
