import { CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CameraPermissionGate } from "@/components/verify-id/camera-permission-gate";
import { CaptureLayout, DarkCaptureScreen } from "@/components/verify-id/capture-layout";
import { StatusPill } from "@/components/verify-id/status-pill";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { captureInstruction, findIdDocument } from "@/lib/id-verification";
import { SETUP_TASKS, setupStepNumber } from "@/lib/setup";

// Simulated quality checks until a verification partner is integrated: after the camera is
// ready we wait a moment ("aligning"), report it as sharp, then capture.
const ALIGN_MS = 2200;
const HOLD_MS = 1200;

/** A passport photo page is 125 × 88 mm. */
const FRAME_ASPECT = 125 / 88;
const CORNER_SIZE = 28;

type Phase = "aligning" | "sharp" | "capturing";

export default function DocumentCaptureScreen() {
  return (
    <DarkCaptureScreen>
      <DocumentCaptureContent />
    </DarkCaptureScreen>
  );
}

function DocumentCaptureContent() {
  const colors = useThemeColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string; startedAt?: string }>();
  const document = findIdDocument(params.type);
  const cameraRef = useRef<CameraView>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [sideIndex, setSideIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("aligning");
  const [error, setError] = useState<string | null>(null);

  const side = document?.sides[sideIndex] ?? "front";

  const advance = () => {
    if (!document) return;
    if (sideIndex < document.sides.length - 1) {
      setSideIndex(sideIndex + 1);
      setPhase("aligning");
      return;
    }
    router.push({ pathname: "/verify-id/selfie", params: { startedAt: params.startedAt } });
  };

  const capture = async () => {
    setPhase("capturing");
    try {
      // The photo isn't uploaded anywhere yet (mocked checks), so it's discarded right away.
      await cameraRef.current?.takePictureAsync({ quality: 0.5 });
      advance();
    } catch {
      setError("Couldn’t take the photo. Try again, or upload one instead.");
      setPhase("aligning");
    }
  };

  useEffect(() => {
    if (!isCameraReady || phase !== "aligning") return;
    const timer = setTimeout(() => setPhase("sharp"), ALIGN_MS);
    return () => clearTimeout(timer);
  }, [isCameraReady, phase, sideIndex]);

  // The phase change is the trigger; the event always calls the latest `capture`.
  const onHeldSteady = useEffectEvent(() => capture());
  useEffect(() => {
    if (phase !== "sharp") return;
    const timer = setTimeout(onHeldSteady, HOLD_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  const upload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.5,
    });
    if (!result.canceled) advance();
  };

  if (!document) return <Redirect href="/verify-id" />;

  const isSharp = phase !== "aligning";
  const cornerColor = isSharp ? colors.successFill : colors.textSecondary;

  return (
    <CaptureLayout
      stepLabel={`Step ${setupStepNumber("id")} of ${SETUP_TASKS.length} · document`}
      title={captureInstruction(document, side)}
      subtitle="Flat surface, good light, no glare."
      footer={
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Upload a photo instead"
            onPress={upload}
            style={({ pressed }) => [
              styles.upload,
              { backgroundColor: colors.text },
              pressed && styles.pressed,
            ]}
          >
            <SymbolView
              name={{ ios: "plus", android: "add", web: "add" }}
              size={24}
              tintColor={colors.background}
            />
          </Pressable>
          <Text style={[styles.uploadLabel, { color: colors.textSecondary }]}>Upload instead</Text>
        </>
      }
    >
      <View style={[styles.frame, { backgroundColor: colors.surface }]}>
        <CameraPermissionGate purpose="to photograph your ID" canUpload>
          <CameraView
            ref={cameraRef}
            facing="back"
            style={StyleSheet.absoluteFill}
            onCameraReady={() => setIsCameraReady(true)}
          />
        </CameraPermissionGate>
        {(["topLeft", "topRight", "bottomLeft", "bottomRight"] as const).map((corner) => (
          <View
            key={corner}
            style={[styles.corner, styles[corner], { borderColor: cornerColor }]}
          />
        ))}
      </View>

      {error ? (
        <StatusPill label={error} tone="neutral" />
      ) : (
        <StatusPill
          label={
            phase === "aligning"
              ? "Hold your ID inside the frame"
              : phase === "sharp"
                ? "Looks sharp, hold still"
                : "Capturing…"
          }
          tone={phase === "aligning" ? "neutral" : phase === "sharp" ? "success" : "busy"}
        />
      )}

      <View style={[styles.tip, { backgroundColor: colors.surface }]}>
        <SymbolView
          name={{ ios: "lightbulb", android: "lightbulb", web: "lightbulb" }}
          size={16}
          tintColor={colors.textSecondary}
        />
        <Text style={[styles.tipText, { color: colors.textSecondary }]}>
          Take the photo yourself, or upload one from your library.
        </Text>
      </View>
    </CaptureLayout>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: "100%",
    aspectRatio: FRAME_ASPECT,
    borderRadius: Radius.lg,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: Radius.lg,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: Radius.lg,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: Radius.lg,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: Radius.lg,
  },
  tip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.md,
  },
  tipText: {
    flex: 1,
    fontSize: FontSize.footnote,
  },
  upload: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadLabel: {
    fontSize: FontSize.footnote,
  },
  pressed: {
    opacity: 0.7,
  },
});
