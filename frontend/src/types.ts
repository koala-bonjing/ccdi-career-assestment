// src/types/index.ts (or wherever this lives)

// 🔹 User
export interface User {
  _id: string;
  name: string;
  email: string;
  fullName?: string;
  preferredCourse?: string;
}

// 🔹 Program Types (canonical list)
export type ProgramType =
  | "BSIT"
  | "BSCS"
  | "BSIS"
  | "BSET Electronics Technology"
  | "BSET Electrical Technology";

// 🔹 Labels for UI display (e.g., dropdowns, cards)
export const ProgramLabels: Record<ProgramType, string> = {
  BSIT: "BSIT",
  BSCS: "BSCS",
  BSIS: "BSIS",
  "BSET Electronics Technology": "BSET Electronics",
  "BSET Electrical Technology": "BSET Electrical",
};

// 🔹 Compact program keys for internal scoring (optional but helpful)
// You can map full names ↔ short keys if you want to keep backend lightweight
export const PROGRAM_SHORT_KEY: Record<ProgramType, string> = {
  BSIT: "BSIT",
  BSCS: "BSCS",
  BSIS: "BSIS",
  "BSET Electronics Technology": "BSET-E",
  "BSET Electrical Technology": "BSET-EL",
};

export const SHORT_KEY_TO_PROGRAM: Record<string, ProgramType> = {
  BSIT: "BSIT",
  BSCS: "BSCS",
  BSIS: "BSIS",
  "BSET-E": "BSET Electronics Technology",
  "BSET-EL": "BSET Electrical Technology",
};

// 🔹 ProgramScores — now matches ProgramType (but numeric values by key)
// We'll use the short keys for object shape (cleaner than full names as keys)
export interface ProgramScores {
  BSIT: number;
  BSCS: number;
  BSIS: number;
  "BSET-E": number;
  "BSET-EL": number;
}

// 🔹 Question & Assessment structures
export interface Question {
  _id: string;
  questionText: string;
  program: string;
  subCategory?: string;
  options?: string[];
}

export interface AssessmentQuestions {
  foundationalAssessment: Question[];
  academicAptitude: Question[];
  technicalSkills: Question[];
  careerInterest: Question[];
  learningWorkStyle: Question[];
}

export interface AssessmentAnswers {
  foundationalAssessment: Record<string, string>;
  academicAptitude: Record<string, number>;
  technicalSkills: Record<string, boolean>;
  careerInterest: Record<string, number>;
  learningWorkStyle: Record<string, boolean>;
}

export interface CategoryExplanations {
  academicReason: string;
  technicalReason: string;
  careerReason: string;
  logisticsReason: string;
}

export interface CategoryScores {
  academic: number;
  technical: number;
  career: number;
  logistics: number;
}
// 🔹 EvaluationResult — AI’s raw JSON response shape
export interface EvaluationResult {
  result: string;
  summary: string;
  recommendation: string;
  detailedEvaluation: string;
  recommendedCourse: ProgramType;
  percent: {
    BSIT: number;
    BSCS: number;
    BSIS: number;
    "BSET Electronics Technology": number;
    "BSET Electrical Technology": number;
  };
  answer: AssessmentAnswers;
  categoryExplanations?: CategoryExplanations;
  aiAnswer?: string;
}

export interface PreparationNeeded {
  mathReview: string;
  readingSupport: string;
  timeManagement: string;
}


// 🔹 AssessmentResult — post-processed, ready for UI/storage
export interface AssessmentResult {
  success: boolean;
  summary: string;
  evaluation: string;
  recommendations: string;
  detailedEvaluation: string;
  recommendedProgram: ProgramType;
  user: User;
  percent: {
    BSIT: number;
    BSCS: number;
    BSIS: number;
    "BSET Electronics Technology": number;
    "BSET Electrical Technology": number;
  };
  programScores: ProgramScores;
  submissionDate?: string;
  answers: AssessmentAnswers;
  categoryExplanations?: CategoryExplanations;
  aiAnswer?: string;
  categoryScores: CategoryScores;
  preparationNeeded?: PreparationNeeded;
  examAnalysis: string;
}

// 🔹 Props for AssessmentForm
export interface AssessmentFormProps {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  onSubmit: (data: {
    answers: AssessmentAnswers;
    programScores: ProgramScores; // ✅ matches interface
    recommendedProgram: ProgramType; // ✅ stricter: was string → now ProgramType
  }) => void;
  loading?: boolean;
  restoredFormData: AssessmentAnswers | null;
  onStartNew: () => void;
}

// 🔹 Optional: if you store evaluations in DB
export interface Evaluation {
  date?: Date;
  answers: AssessmentAnswers;
  evaluation: string;
  recommendedProgram: ProgramType;
}

// 🔹 Extended for UI display — derived, not stored
export interface AssessmentDisplayResult extends AssessmentResult {
  completed: boolean;
  completionDate: string;
  // Derived score: e.g., percentile of top program (0–100)
  score: number;
  // Approx total questions (adjust if dynamic)
  totalQuestions: number;
  // Human-readable top 3 programs
  recommendedPaths: string[]; // e.g., ["BSIT", "BSCS", "BSET Electronics"]
  // Placeholder for now — can be extracted from evaluation text later
  strengths: string[];
}

export type SectionAnswers = Record<
  string,
  string | number | boolean | undefined
>;
