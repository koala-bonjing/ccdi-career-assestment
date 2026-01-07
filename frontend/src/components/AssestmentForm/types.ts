import type { AssessmentAnswers } from "../../types";

export type ProgramType =
  | "BSIT"
  | "BSCS"
  | "BSIS"
  | "BSET Electronics Technology"
  | "BSET Electrical Technology";

export interface ProgramScores {
  BSCS: number;
  BSIT: number;
  BSIS: number;
  "BSET-E": number;
  "BSET-EL": number;
}

export interface AssessmentSectionProps {
  questions: { _id: string; questionText: string; program?: string }[];
  formData: AssessmentAnswers;
  onChange: (
    section: keyof AssessmentAnswers,
    q: string,
    val: number | boolean,
    prog?: string
  ) => void;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  currentSection: number;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  totalSections: number;
}

export interface AssessmentActionFooterProps {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
  isLastSection: boolean;
  isComplete: boolean;
  nextLabel?: string;
}
