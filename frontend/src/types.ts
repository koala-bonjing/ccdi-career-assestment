export interface User {
  _id: string;
  name: string;
  email: string;
  preferredCourse: string;
}

export interface Evaluation {
  date?: Date;
  answers: AssessmentAnswers;
  evaluation: string;
  recommendations: string;
  recommendedProgram: ProgramType;
}

export type ProgramType = "BSCS" | "BSIT" | "BSIS" | "EE";

export const ProgramLabels: Record<ProgramType, string> = {
  BSCS: "BSCS",
  BSIT: "BSIT",
  BSIS: "BSIS",
  EE: "Technology Engineering (Electrical)",
};

export interface AssessmentAnswers {
  academicAptitude: {
    [question: string]: number;
  };
  technicalSkills: {
    [question: string]: number;
  };
  careerInterest: {
    [question: string]: number;
  };
  learningStyle: {
    [question: string]: number;
  };
}

// In your types.ts file

export interface AssessmentResult {
  success: boolean;
  evaluation: string;
  recommendations: string;
  recommendedProgram: ProgramType;
  user: User;
  percent: {
    BSIT: number;
    BSCS: number;
    BSIS: number;
    EE: number;
  };
  programScores?: {
    BSCS: number;
    BSIT: number;
    BSIS: number;
    EE: number;
  };
  submissionDate?: string;
}

export interface EvaluationResult {
  result: string;
  recommendation: string;
  recommendedCourse: ProgramType;
  percent: {
    BSIT: number;
    BSCS: number;
    BSIS: number;
    EE: number;
  };
}

export interface AssessmentFormProps {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  onSubmit: (answers: AssessmentAnswers) => void;
  onNextSection: () => void;
  onPrevSection: () => void;
  currentSectionIndex: number;
  totalSections: number;
  loading?: boolean;
}
