import type { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

const SHEET_RADIUS = 28;

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  /** The small drag handle at the top (decorative; tap the backdrop to close). */
  showGrabber?: boolean;
  children: ReactNode;
};

/** A panel that slides up over a dimmed backdrop; tapping the backdrop closes it. */
export function BottomSheet({ visible, onClose, showGrabber = false, children }: BottomSheetProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View
        entering={FadeIn.duration(200)}
        style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim }]}
      >
        <Pressable accessibilityLabel="Close" style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      {visible && (
        <Animated.View
          entering={SlideInDown.duration(300)}
          accessibilityViewIsModal
          style={[
            styles.sheet,
            { backgroundColor: colors.background, paddingBottom: insets.bottom + Spacing.lg },
          ]}
        >
          {showGrabber && (
            <View style={[styles.grabber, { backgroundColor: colors.outlineBorder }]} />
          )}
          {children}
        </Animated.View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: "88%",
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    paddingTop: Spacing.lg,
  },
  grabber: {
    alignSelf: "center",
    width: 40,
    height: 5,
    borderRadius: Radius.pill,
    marginBottom: Spacing.lg,
  },
});
