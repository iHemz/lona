import type { SymbolViewProps } from "expo-symbols";

export type IdDocumentType = "passport" | "driving-licence" | "national-id";

export type IdDocument = {
  type: IdDocumentType;
  title: string;
  description: string;
  icon: SymbolViewProps["name"];
  /** Sides to photograph, in order. */
  sides: ("front" | "back")[];
};

export const ID_DOCUMENTS: IdDocument[] = [
  {
    type: "passport",
    title: "Passport",
    description: "Fastest, usually instant",
    icon: { ios: "person.text.rectangle", android: "badge", web: "badge" },
    sides: ["front"],
  },
  {
    type: "driving-licence",
    title: "Driving licence",
    description: "UK photocard, front and back",
    icon: { ios: "car", android: "directions_car", web: "directions_car" },
    sides: ["front", "back"],
  },
  {
    type: "national-id",
    title: "National identity card",
    description: "For EU/EEA nationals living in the UK",
    icon: { ios: "creditcard", android: "credit_card", web: "credit_card" },
    sides: ["front", "back"],
  },
];

export function findIdDocument(type: string | undefined): IdDocument | null {
  return ID_DOCUMENTS.find((document) => document.type === type) ?? null;
}

/** What to ask for on the capture screen, e.g. "Photo page inside the frame". */
export function captureInstruction(document: IdDocument, side: "front" | "back"): string {
  if (document.type === "passport") return "Photo page inside the frame";
  return side === "front" ? "Front of your card in the frame" : "Now the back of your card";
}

// Stand-in for the verification partner: checks the captured document and selfie match.
// Photos aren't sent anywhere yet; they're discarded after capture.
export async function submitIdVerification(): Promise<{ verified: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return { verified: true };
}
