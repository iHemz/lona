import { useCameraPermissions } from "expo-camera";
import type { ReactNode } from "react";
import { ActivityIndicator, Linking, Platform, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { FontSize, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

type CameraPermissionGateProps = {
  /** What the camera is for, shown when asking ("…to photograph your ID"). */
  purpose: string;
  /** Whether the screen offers "upload instead", so the prompt can mention it. */
  canUpload?: boolean;
  children: ReactNode;
};

/** Renders the camera once permission is granted; otherwise explains and asks, or points to Settings. */
export function CameraPermissionGate({
  purpose,
  canUpload = false,
  children,
}: CameraPermissionGateProps) {
  const colors = useThemeColors();
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <ActivityIndicator color={colors.text} />;
  }
  if (permission.granted) return <>{children}</>;

  // Once denied for good, only the system settings can change it (not available on web).
  const canOpenSettings = !permission.canAskAgain && Platform.OS !== "web";

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Camera access needed</Text>
      <Text style={[styles.body, { color: colors.textSecondary }]}>
        Lona needs your camera {purpose}.{canUpload ? " You can also upload a photo instead." : ""}
      </Text>
      {permission.canAskAgain ? (
        <Button label="Allow camera" variant="inverse" size="compact" onPress={requestPermission} />
      ) : canOpenSettings ? (
        <Button
          label="Open Settings"
          variant="inverse"
          size="compact"
          onPress={() => Linking.openSettings()}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  title: {
    fontSize: FontSize.body,
    fontWeight: "700",
  },
  body: {
    fontSize: FontSize.subhead,
    textAlign: "center",
  },
});
