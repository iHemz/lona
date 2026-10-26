import { SymbolView } from "expo-symbols";
import { Fragment } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FontSize, Radius, Spacing, TouchTarget } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme";
import { SETUP_TASKS, setupProgress, type SetupTaskId } from "@/lib/setup";

const MARK_SIZE = 20;

type SetupChecklistProps = {
  completed: ReadonlySet<SetupTaskId>;
  /** Handler per pending task; tasks without one aren't actionable yet. */
  onStartTask?: Partial<Record<SetupTaskId, () => void>>;
};

/** "Finish setting up": progress and the remaining tasks before money can move. */
export function SetupChecklist({ completed, onStartTask = {} }: SetupChecklistProps) {
  const colors = useThemeColors();
  const { done, total } = setupProgress(completed);

  return (
    <View
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
    >
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
            Finish setting up
          </Text>
          <Text style={[styles.count, { color: colors.link }]}>
            {done} of {total}
          </Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Needed before you can send or request money
        </Text>
        <View
          accessibilityRole="progressbar"
          accessibilityLabel="Setup progress"
          accessibilityValue={{ min: 0, max: total, now: done }}
          style={[styles.track, { backgroundColor: colors.progressTrack }]}
        >
          <View
            style={[
              styles.fill,
              { width: `${(done / total) * 100}%`, backgroundColor: colors.successFill },
            ]}
          />
        </View>
      </View>

      {SETUP_TASKS.map((task, index) => {
        const isDone = completed.has(task.id);
        const onPress = isDone ? undefined : onStartTask[task.id];
        return (
          <Fragment key={task.id}>
            {index > 0 && (
              <View style={[styles.separator, { backgroundColor: colors.separator }]} />
            )}
            <Pressable
              accessibilityRole={onPress ? "button" : undefined}
              accessibilityLabel={`${task.title}, ${isDone ? "done" : task.description}`}
              accessibilityState={{ checked: isDone }}
              onPress={onPress}
              disabled={!onPress}
              style={({ pressed }) => [
                styles.task,
                pressed && { backgroundColor: colors.background },
              ]}
            >
              {isDone ? (
                <SymbolView
                  name={{
                    ios: "checkmark.circle.fill",
                    android: "check_circle",
                    web: "check_circle",
                  }}
                  size={MARK_SIZE}
                  tintColor={colors.successFill}
                />
              ) : (
                <View style={[styles.pendingMark, { borderColor: colors.outlineBorder }]} />
              )}
              <View style={styles.taskText}>
                <Text
                  style={[
                    styles.taskTitle,
                    { color: isDone ? colors.textTertiary : colors.text },
                    isDone && styles.struck,
                  ]}
                >
                  {task.title}
                </Text>
                {!isDone && (
                  <Text style={[styles.taskDescription, { color: colors.textSecondary }]}>
                    {task.description}
                  </Text>
                )}
              </View>
              {isDone ? (
                <Text style={[styles.done, { color: colors.success }]}>Done</Text>
              ) : (
                <SymbolView
                  name={{ ios: "chevron.right", android: "chevron_right", web: "chevron_right" }}
                  size={14}
                  tintColor={colors.textTertiary}
                />
              )}
            </Pressable>
          </Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  header: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: FontSize.body,
    fontWeight: "700",
  },
  count: {
    fontSize: FontSize.subhead,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: FontSize.footnote,
  },
  track: {
    height: 4,
    borderRadius: Radius.pill,
    overflow: "hidden",
    marginTop: Spacing.sm,
  },
  fill: {
    height: "100%",
    borderRadius: Radius.pill,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.lg + MARK_SIZE + Spacing.md,
  },
  task: {
    minHeight: TouchTarget + Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  pendingMark: {
    width: MARK_SIZE,
    height: MARK_SIZE,
    borderRadius: MARK_SIZE / 2,
    borderWidth: 1.5,
  },
  taskText: {
    flex: 1,
    gap: 2,
  },
  taskTitle: {
    fontSize: FontSize.body,
    fontWeight: "600",
  },
  struck: {
    textDecorationLine: "line-through",
  },
  taskDescription: {
    fontSize: FontSize.footnote,
  },
  done: {
    fontSize: FontSize.footnote,
    fontWeight: "600",
  },
});
