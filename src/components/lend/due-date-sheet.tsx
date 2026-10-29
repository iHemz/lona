import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { FontSize, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { formatFullDate, isoDateToLocalDate, todayIsoDate, type IsoDate } from "@/lib/dates";
import { dueDateBounds, dueDatePresets } from "@/lib/lend";

type DueDateSheetProps = {
  visible: boolean;
  value: IsoDate | null;
  today: IsoDate;
  onSelect: (date: IsoDate) => void;
  onClose: () => void;
};

/** Quick picks plus the platform calendar (there's no calendar on web, only the quick picks). */
export function DueDateSheet({ visible, value, today, onSelect, onClose }: DueDateSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} showGrabber>
      {/* Mounted only while open, so each opening starts from the current value. */}
      <DueDateSheetContent value={value} today={today} onSelect={onSelect} onClose={onClose} />
    </BottomSheet>
  );
}

function DueDateSheetContent({
  value,
  today,
  onSelect,
  onClose,
}: Omit<DueDateSheetProps, "visible">) {
  const colors = useThemeColors();
  const presets = dueDatePresets(today);
  const { earliest, latest } = dueDateBounds(today);
  const [selected, setSelected] = useState<IsoDate>(value ?? presets[1]?.date ?? earliest);

  const clamp = (date: IsoDate) => (date < earliest ? earliest : date > latest ? latest : date);

  return (
    <View style={styles.content}>
      <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
        When should they pay you back?
      </Text>

      <View accessibilityRole="radiogroup" style={styles.presets}>
        {presets.map((preset) => {
          const isSelected = preset.date === selected;
          return (
            <Pressable
              key={preset.label}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`${preset.label}, ${formatFullDate(preset.date)}`}
              onPress={() => setSelected(preset.date)}
              style={({ pressed }) => [
                styles.preset,
                {
                  backgroundColor: isSelected ? colors.linkSurface : colors.surface,
                  borderColor: isSelected ? colors.link : colors.surfaceBorder,
                },
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.presetLabel, { color: isSelected ? colors.link : colors.text }]}>
                {preset.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <DateTimePicker
        value={isoDateToLocalDate(selected)}
        onValueChange={(_, date) => setSelected(clamp(todayIsoDate(date)))}
        minimumDate={isoDateToLocalDate(earliest)}
        maximumDate={isoDateToLocalDate(latest)}
        display="inline"
        presentation="inline"
        accentColor={colors.primary}
      />

      <Button
        label={`Pay back by ${formatFullDate(selected)}`}
        onPress={() => {
          onSelect(selected);
          onClose();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
  },
  title: {
    fontSize: FontSize.heading,
    fontWeight: "700",
  },
  presets: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  preset: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  presetLabel: {
    fontSize: FontSize.subhead,
    fontWeight: "600",
  },
});
