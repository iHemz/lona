import { CameraView } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useReducedMotion, useSharedValue, withTiming } from "react-native-reanimated";

import { Button } from "@/components/ui/button";
import { CameraPermissionGate } from "@/components/verify-id/camera-permission-gate";
import { CaptureLayout, DarkCaptureScreen } from "@/components/verify-id/capture-layout";
import { SelfieRing } from "@/components/verify-id/selfie-ring";
import { StatusPill } from "@/components/verify-id/status-pill";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useSetup } from "@/hooks/use-setup";
import { useThemeColors } from "@/hooks/use-theme";
import { submitIdVerification } from "@/lib/id-verification";
import { SETUP_TASKS, setupStepNumber } from "@/lib/setup";

// Simulated liveness until a verification partner is integrated.
const FACE_DETECTED_MS = 800;
const HEAD_TURN_MS = 3000;

type Phase = "ready" | "scanning" | "checking";

export default function SelfieScreen() {
  return (
    <DarkCaptureScreen>
      <SelfieContent />
    </DarkCaptureScreen>
  );
}

function SelfieContent() {
  const colors = useThemeColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ startedAt?: string }>();
  const { completeTask } = useSetup();
  const reduceMotion = useReducedMotion();
  const cameraRef = useRef<CameraView>(null);
  const progress = useSharedValue(0);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [phase, setPhase] = useState<Phase>("ready");
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finish = async () => {
    setPhase("checking");
    try {
      // Discarded straight away: the checks are mocked and nothing is uploaded yet.
      await cameraRef.current?.takePictureAsync({ quality: 0.5 });
      const { verified } = await submitIdVerification();
      if (!verified) throw new Error("not verified");
      completeTask("id");
      router.replace({ pathname: "/verify-id/done", params: { startedAt: params.startedAt } });
    } catch {
      setError("We couldn’t match your selfie. Try again in good light.");
      progress.set(0);
      setPhase("ready");
    }
  };

  const onScanComplete = useEffectEvent(() => finish());
  useEffect(() => {
    if (phase !== "scanning") return;
    const detected = setTimeout(() => setIsFaceDetected(true), FACE_DETECTED_MS);
    const done = setTimeout(onScanComplete, HEAD_TURN_MS);
    return () => {
      clearTimeout(detected);
      clearTimeout(done);
    };
  }, [phase]);

  const start = () => {
    setError(null);
    setIsFaceDetected(false);
    setPhase("scanning");
    progress.set(reduceMotion ? 1 : withTiming(1, { duration: HEAD_TURN_MS }));
  };

  const status =
    phase === "checking"
      ? { label: "Checking your ID…", tone: "busy" as const }
      : phase === "scanning" && isFaceDetected
        ? { label: "Face detected", tone: "success" as const }
        : { label: "Position your face in the circle", tone: "neutral" as const };

  return (
    <CaptureLayout
      stepLabel={`Step ${setupStepNumber("id")} of ${SETUP_TASKS.length} · selfie`}
      title="Now a quick selfie"
      subtitle={"Look straight at the camera,\nthen turn your head slowly."}
      footer={
        <View style={styles.footer}>
          <View style={[styles.note, { backgroundColor: colors.surface }]}>
            <SymbolView
              name={{ ios: "lock", android: "lock", web: "lock" }}
              size={14}
              tintColor={colors.textSecondary}
            />
            <Text style={[styles.noteText, { color: colors.textSecondary }]}>
              Used only to match your ID, then deleted.
            </Text>
          </View>
          <Button
            label={phase === "ready" ? "Start" : "Hold still…"}
            variant="inverse"
            onPress={start}
            disabled={phase !== "ready" || !isCameraReady}
            style={styles.start}
          />
        </View>
      }
    >
      <SelfieRing progress={progress}>
        <CameraPermissionGate purpose="for a quick selfie">
          <CameraView
            ref={cameraRef}
            facing="front"
            mirror
            style={StyleSheet.absoluteFill}
            onCameraReady={() => setIsCameraReady(true)}
          />
        </CameraPermissionGate>
      </SelfieRing>
      {error ? (
        <StatusPill label={error} tone="neutral" />
      ) : (
        <StatusPill label={status.label} tone={status.tone} />
      )}
    </CaptureLayout>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignSelf: "stretch",
    alignItems: "center",
    gap: Spacing.lg,
  },
  note: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  noteText: {
    fontSize: FontSize.footnote,
  },
  start: {
    alignSelf: "stretch",
  },
});
