import { useNavigation, useRouter, type Href } from "expo-router";

/**
 * Closes the modal the current screen is in. Works for a screen that is the modal itself
 * and for one pushed inside a modal's own stack (closes the whole modal). Falls back to
 * `fallback` when there's nothing to go back to, e.g. the modal was opened from a link.
 */
export function useCloseModal(fallback: Href): () => void {
  const navigation = useNavigation();
  const router = useRouter();

  return () => {
    const parent = navigation.getParent();
    if (parent?.canGoBack()) parent.goBack();
    else if (navigation.canGoBack()) navigation.goBack();
    else router.replace(fallback);
  };
}
