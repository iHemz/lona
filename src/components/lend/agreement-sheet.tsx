import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { LoanOfferSummary } from "@/components/lend/loan-offer-summary";
import { SignaturePad } from "@/components/lend/signature-pad";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { SectionHeader } from "@/components/ui/section-header";
import { StepHeading } from "@/components/ui/step-header";
import { Spacing } from "@/constants/theme";
import type { IsoDate } from "@/lib/dates";
import { lendStepHeading, type LoanOfferTerms } from "@/lib/lend";

type AgreementSheetProps = {
  visible: boolean;
  terms: LoanOfferTerms;
  today: IsoDate;
  /** Starting signature, e.g. when coming back to re-sign. */
  signature: string[] | null;
  onSign: (signature: string[]) => void;
  onClose: () => void;
};

/** Step 4: review the terms and sign them, over the terms screen. */
export function AgreementSheet({ visible, onClose, ...content }: AgreementSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      {/* Mounted only while open, so it starts from the saved signature each time. */}
      <AgreementContent {...content} onClose={onClose} />
    </BottomSheet>
  );
}

function AgreementContent({
  terms,
  today,
  signature,
  onSign,
  onClose,
}: Omit<AgreementSheetProps, "visible">) {
  const [strokes, setStrokes] = useState<string[]>(signature ?? []);
  const [isDrawing, setIsDrawing] = useState(false);

  return (
    <ScrollView
      scrollEnabled={!isDrawing}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.heading}>
          <StepHeading {...lendStepHeading(4)} title="Sign the agreement" />
        </View>
        <IconButton
          icon={{ ios: "xmark", android: "close", web: "close" }}
          accessibilityLabel="Close"
          onPress={onClose}
        />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Terms" />
        <LoanOfferSummary recipient={terms.recipient} today={today} terms={terms} />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Your signature" />
        <SignaturePad strokes={strokes} onChange={setStrokes} onDrawingChange={setIsDrawing} />
      </View>

      <Button label="Proceed" disabled={strokes.length === 0} onPress={() => onSign(strokes)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  heading: {
    flex: 1,
  },
  section: {
    gap: Spacing.md,
  },
});
