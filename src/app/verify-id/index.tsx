import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { ID_DOCUMENTS, type IdDocumentType } from "@/lib/id-verification";
import { SETUP_TASKS, setupStepNumber } from "@/lib/setup";

const ICON_SIZE = 40;

export default function ChooseIdScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selected, setSelected] = useState<IdDocumentType>("passport");
  const selectedDocument = ID_DOCUMENTS.find((document) => document.type === selected);

  const step = `Step ${setupStepNumber("id")} of ${SETUP_TASKS.length} · Verify your ID`;

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + Spacing.sm,
          paddingBottom: insets.bottom + Spacing.md,
        },
      ]}
    >
      <View style={styles.header}>
        <IconButton
          icon={{ ios: "chevron.left", android: "chevron_left", web: "chevron_left" }}
          accessibilityLabel="Back"
          onPress={() => router.back()}
        />
        <IconButton
          icon={{ ios: "ellipsis", android: "more_horiz", web: "more_horiz" }}
          accessibilityLabel="More options"
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <Text style={[styles.step, { color: colors.textSecondary }]}>{step}</Text>
          <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
            Which ID do you have?
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            We check it against a quick selfie. Takes about 2 minutes.
          </Text>
        </View>

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

        <View
          style={[
            styles.privacy,
            { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
          ]}
        >
          <SymbolView
            name={{ ios: "checkmark.shield", android: "verified_user", web: "verified_user" }}
            size={18}
            tintColor={colors.success}
          />
          <Text style={[styles.privacyText, { color: colors.text }]}>
            Encrypted, checked by our verification partner, and never shown to your friends.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={`Continue with ${selectedDocument?.title.toLowerCase() ?? "ID"}`}
          onPress={() =>
            router.push({
              pathname: "/verify-id/document",
              params: { type: selected, startedAt: String(Date.now()) },
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  heading: {
    gap: Spacing.sm,
  },
  step: {
    fontSize: FontSize.caption,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: FontSize.subhead,
  },
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
  privacy: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  privacyText: {
    flex: 1,
    fontSize: FontSize.footnote,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
  },
});
