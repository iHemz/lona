import { Caveat_500Medium, useFonts } from "@expo-google-fonts/caveat";
import { SymbolView } from "expo-symbols";
import { StyleSheet, Text, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";

const DEFAULT_CAPTION = "Every loan gets a photo\nthat develops as it’s repaid.";

type PolaroidIllustrationProps = {
  /** Handwritten under the photo; a line break keeps it to two short lines. */
  caption?: string;
};

export function PolaroidIllustration({ caption = DEFAULT_CAPTION }: PolaroidIllustrationProps) {
  const colors = useThemeColors();
  // Falls back to the system font until the handwriting font has loaded (or if it fails).
  const [fontLoaded] = useFonts({ Caveat_500Medium });

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={caption.replace("\n", " ")}
      style={[
        styles.paper,
        {
          backgroundColor: colors.illustrationPaper,
          boxShadow: `0 8px 20px ${colors.illustrationShadow}`,
        },
      ]}
    >
      <View style={[styles.photo, { backgroundColor: colors.illustrationPhoto }]}>
        <SymbolView
          name={{ ios: "camera", android: "photo_camera", web: "photo_camera" }}
          size={28}
          tintColor={colors.illustrationIcon}
        />
      </View>
      <Text
        maxFontSizeMultiplier={1.3}
        style={[
          styles.caption,
          { color: colors.illustrationInk },
          fontLoaded ? styles.handwriting : styles.fallback,
        ]}
      >
        {caption}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  paper: {
    width: 216,
    padding: Spacing.sm + 2,
    paddingBottom: Spacing.md,
    borderRadius: 4,
    transform: [{ rotate: "-3deg" }],
  },
  photo: {
    height: 120,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  caption: {
    marginTop: Spacing.sm + 2,
    textAlign: "center",
  },
  handwriting: {
    fontFamily: "Caveat_500Medium",
    fontSize: 18,
    lineHeight: 22,
  },
  fallback: {
    fontSize: 13,
    lineHeight: 18,
    fontStyle: "italic",
  },
});
