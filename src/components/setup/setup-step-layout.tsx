import type { ReactNode } from "react";

import { StepLayout } from "@/components/ui/step-layout";
import { SETUP_TASKS, setupStepNumber, type SetupTaskId } from "@/lib/setup";

type SetupStepLayoutProps = {
  task: SetupTaskId;
  title: string;
  subtitle: string;
  children: ReactNode;
  /** Pinned to the bottom and kept above the keyboard, e.g. the step's main button. */
  footer?: ReactNode;
};

/** Light setup step: back/more header, "Step N of 4 · Task", title, subtitle, body, action. */
export function SetupStepLayout({ task, title, subtitle, children, footer }: SetupStepLayoutProps) {
  const taskTitle = SETUP_TASKS.find((candidate) => candidate.id === task)?.title ?? "";

  return (
    <StepLayout
      heading={{
        step: setupStepNumber(task),
        stepCount: SETUP_TASKS.length,
        task: taskTitle,
        title,
        subtitle,
      }}
      footer={footer}
    >
      {children}
    </StepLayout>
  );
}
