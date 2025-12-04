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



export interface Question {
  _id: string;
  questionText: string;
  program?: string;
  options?: string[];
}

export interface AssessmentQuestions {
  academicAptitude: Question[];
  technicalSkills: Question[];
  careerInterest: Question[];
  learningStyle: Question[];
}



export interface AssessmentResult {
  success: boolean;
  summary: string;
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
  summary: string;
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
  onSubmit: (data: {
    answers: AssessmentAnswers;
    programScores: {
      BSCS: number;
      BSIT: number;
      BSIS: number;
      EE: number;
    };
    recommendedProgram: string;
  }) => void;
  loading?: boolean;
  restoredFormData: AssessmentAnswers | null;
  onStartNew: () => void;
}


// src/types/assessment.ts
export interface Question {
  _id: string;
  questionText: string;
  program?: string;
  options?: string[];
}

export interface AssessmentQuestions {
  academicAptitude: Question[];
  technicalSkills: Question[];
  careerInterest: Question[];
  learningStyle: Question[];
}

export interface AssessmentAnswers {
  academicAptitude: Record<string, number>; // 1-5 for Likert scale
  technicalSkills: Record<string, boolean>; // true/false for checkboxes
  careerInterest: Record<string, number>; // 1-5 for Likert scale
  learningStyle: Record<string, number>; // string for selected option
}

export interface User {
  _id: string;
  name: string;
  email: string;
  preferredCourse: string;
}

export interface ProgramScores {
  BSCS: number;
  BSIT: number;
  BSIS: number;
  EE: number;
}
