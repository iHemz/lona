import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PrivacyNote } from "@/components/setup/privacy-note";
import { SetupStepLayout } from "@/components/setup/setup-step-layout";
import { Button } from "@/components/ui/button";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { ID_DOCUMENTS, type IdDocumentType } from "@/lib/id-verification";

const ICON_SIZE = 40;

export default function ChooseIdScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const [selected, setSelected] = useState<IdDocumentType>("passport");
  const selectedDocument = ID_DOCUMENTS.find((document) => document.type === selected);

  return (
    <SetupStepLayout
      task="id"
      title="Which ID do you have?"
      subtitle="We check it against a quick selfie. Takes about 2 minutes."
      footer={
        <Button
          label={`Continue with ${selectedDocument?.title.toLowerCase() ?? "ID"}`}
          onPress={() =>
            router.push({
              pathname: "/verify-id/document",
              params: { type: selected, startedAt: String(Date.now()) },
            })
          }
        />
      }
    >
      <View accessibilityRole="radiogroup" style={styles.options}>
        {ID_DOCUMENTS.map((document) => {
          const isSelected = document.type === selected;
          return (
            <Pressable
              key={document.type}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`${document.title}, ${document.description}`}
              onPress={() => setSelected(document.type)}
              style={[
                styles.option,
                {
                  backgroundColor: colors.surface,
                  borderColor: isSelected ? colors.primary : colors.surfaceBorder,
                  borderWidth: isSelected ? 1.5 : StyleSheet.hairlineWidth,
                },
              ]}
            >
              <View
                style={[
                  styles.optionIcon,
                  { backgroundColor: isSelected ? colors.linkSurface : colors.chipCountSurface },
                ]}
              >
                <SymbolView
                  name={document.icon}
                  size={18}
                  tintColor={isSelected ? colors.link : colors.textSecondary}
                />
              </View>
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>{document.title}</Text>
                <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                  {document.description}
                </Text>
              </View>
              {isSelected ? (
                <SymbolView
                  name={{
                    ios: "checkmark.circle.fill",
                    android: "check_circle",
                    web: "check_circle",
                  }}
                  size={22}
                  tintColor={colors.successFill}
                />
              ) : (
                <View style={[styles.radio, { borderColor: colors.outlineBorder }]} />
              )}
            </Pressable>
          );
        })}
      </View>

      <PrivacyNote>
        Encrypted, checked by our verification partner, and never shown to your friends.
      </PrivacyNote>
    </SetupStepLayout>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: Spacing.md,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
  },
  optionIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontSize: FontSize.body,
    fontWeight: "600",
  },
  optionDescription: {
    fontSize: FontSize.footnote,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
  },
});
