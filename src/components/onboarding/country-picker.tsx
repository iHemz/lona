import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { IconButton } from "@/components/ui/icon-button";
import { FontSize, Radius, Spacing, TouchTarget } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { COUNTRIES, type Country } from "@/lib/phone";

export const FIELD_HEIGHT = 60;

type CountryPickerProps = {
  value: Country;
  onChange: (country: Country) => void;
};

/** The "🇬🇧 +44 ⌄" pill; opens a list of countries in a sheet. */
export function CountryPicker({ value, onChange }: CountryPickerProps) {
  const colors = useThemeColors();
  const [isOpen, setIsOpen] = useState(false);

  const choose = (country: Country) => {
    onChange(country);
    setIsOpen(false);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Country: ${value.name}, +${value.dialCode}`}
        accessibilityHint="Changes the country code"
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          styles.pill,
          { backgroundColor: colors.surface, borderColor: colors.surfaceBorder },
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.flag}>{value.flag}</Text>
        <Text style={[styles.dialCode, { color: colors.text }]}>+{value.dialCode}</Text>
        <SymbolView
          name={{ ios: "chevron.down", android: "expand_more", web: "expand_more" }}
          size={12}
          tintColor={colors.textSecondary}
        />
      </Pressable>

      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <View style={styles.sheetHeader}>
            <Text accessibilityRole="header" style={[styles.sheetTitle, { color: colors.text }]}>
              Country
            </Text>
            <IconButton
              icon={{ ios: "xmark", android: "close", web: "close" }}
              accessibilityLabel="Close"
              onPress={() => setIsOpen(false)}
            />
          </View>
          <FlatList
            data={COUNTRIES}
            keyExtractor={(country) => country.code}
            renderItem={({ item }) => {
              const isSelected = item.code === value.code;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`${item.name}, +${item.dialCode}`}
                  onPress={() => choose(item)}
                  style={({ pressed }) => [
                    styles.row,
                    pressed && { backgroundColor: colors.surface },
                  ]}
                >
                  <Text style={styles.flag}>{item.flag}</Text>
                  <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.rowDial, { color: colors.textSecondary }]}>
                    +{item.dialCode}
                  </Text>
                  {isSelected && (
                    <SymbolView
                      name={{ ios: "checkmark", android: "check", web: "check" }}
                      size={16}
                      tintColor={colors.primary}
                    />
                  )}
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    height: FIELD_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.7,
  },
  flag: {
    fontSize: 20,
  },
  dialCode: {
    fontSize: FontSize.body,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  sheet: {
    flex: 1,
    paddingTop: Spacing.lg,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  sheetTitle: {
    fontSize: FontSize.heading,
    fontWeight: "700",
  },
  row: {
    minHeight: TouchTarget + Spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  name: {
    flex: 1,
    fontSize: FontSize.body,
  },
  rowDial: {
    fontSize: FontSize.body,
    fontVariant: ["tabular-nums"],
  },
});
