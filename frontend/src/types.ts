/**
 * Core TypeScript definitions for the CCDI Career Assessment application.
 * Contains user models, program structures, scoring types, and evaluation results.
 */
export interface User {
  _id: string;
  name: string;
  email: string;
  fullName?: string;
  preferredCourse?: string;
}

export type ProgramType =
  | "BSIT"
  | "BSCS"
  | "BSIS"
  | "BSET Electronics Technology"
  | "BSET Electrical Technology"
  | "ACT - Multimedia & Animation"
  | "ACT - Programming"
  | "ACT - Networking";

export const ProgramLabels: Record<ProgramType, string> = {
  BSIT: "BSIT",
  BSCS: "BSCS",
  BSIS: "BSIS",
  "BSET Electronics Technology": "BSET Electronics",
  "BSET Electrical Technology": "BSET Electrical",
  "ACT - Multimedia & Animation": "ACT Multimedia & Animation",
  "ACT - Programming": "ACT Programming",
  "ACT - Networking": "ACT Networking",
};

export const PROGRAM_SHORT_KEY: Record<ProgramType, string> = {
  BSIT: "BSIT",
  BSCS: "BSCS",
  BSIS: "BSIS",
  "BSET Electronics Technology": "BSET-E",
  "BSET Electrical Technology": "BSET-EL",
  "ACT - Multimedia & Animation": "ACT-MM",
  "ACT - Programming": "ACT-P",
  "ACT - Networking": "ACT-N",
};

export const SHORT_KEY_TO_PROGRAM: Record<string, ProgramType> = {
  BSIT: "BSIT",
  BSCS: "BSCS",
  BSIS: "BSIS",
  "BSET-E": "BSET Electronics Technology",
  "BSET-EL": "BSET Electrical Technology",
  "ACT-MM": "ACT - Multimedia & Animation",
  "ACT-P": "ACT - Programming",
  "ACT-N": "ACT - Networking",
};

export interface ProgramScores {
  BSIT: number;
  BSCS: number;
  BSIS: number;
  "BSET-E": number;
  "BSET-EL": number;
  "ACT-MM": number;
  "ACT-P": number;
  "ACT-N": number;
}

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
export interface EvaluationResult {
  result: string;
  summary: string;
  recommendation: string;
  detailedEvaluation: string;
  recommendedCourse: ProgramType;
  percent: Record<string, number>;
  answer: AssessmentAnswers;
  categoryExplanations?: CategoryExplanations;
  aiAnswer?: string;
}

export interface PreparationNeeded {
  mathReview: string;
  readingSupport: string;
  timeManagement: string;
}

export interface PrereqAnalysis {
  summary: string;
  prerequisites: number;
  studyHabits: number;
  problemSolving: number;
  timeScore: number;
  overallScore: number;
  warnings: string[];
  recommendations: string[];
}
export interface AssessmentResult {
  success: boolean;
  summary: string;
  evaluation: string;
  recommendations: string;
  detailedEvaluation: string;
  recommendedProgram: ProgramType;
  user: User;
  percent: Record<string, number>;
  programScores: ProgramScores;
  submissionDate?: string;
  answers: AssessmentAnswers;
  categoryExplanations?: CategoryExplanations;
  aiAnswer?: string;
  categoryScores: CategoryScores;
  preparationNeeded?: string[];
  examAnalysis: string;

  successRoadmap?: string;

  foundationalScore?: number;
  prereqAnalysis?: PrereqAnalysis;
  foundationalDetails?: FoundationalDetails;
  weaknesses?: WrongAnswer[];
}

export interface FoundationalResult {
  questionId: string;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  weight: number;
  earnedPoints: number;
  maxPoints: number;
  gradingReasoning: string;
  percentageAwarded?: number;
  isSubjective: boolean;
  subCategory: string;
}
export interface WrongAnswer {
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  subCategory: string;
  aiReasoning?: string;
}

export interface SubjectiveGrading {
  question: string;
  studentAnswer: string;
  pointsAwarded: number;
  maxPoints: number;
  percentage: number;
  reasoning: string;
}

export interface FoundationalDetails {
  score: number;
  earnedPoints: number;
  totalPossible: number;
  correctCount: number;
  totalQuestions: number;
  results: FoundationalResult[];
  wrongAnswers: WrongAnswer[];
  subjectiveGradingDetails: SubjectiveGrading[];
}
export interface AssessmentFormProps {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  onSubmit: (data: {
    answers: AssessmentAnswers;
    programScores: ProgramScores;
    recommendedProgram: ProgramType;
  }) => void;
  loading?: boolean;
  restoredFormData: AssessmentAnswers | null;
  onStartNew: () => void;
}

export interface Evaluation {
  date?: Date;
  answers: AssessmentAnswers;
  evaluation: string;
  recommendedProgram: ProgramType;
}

export interface AssessmentDisplayResult extends AssessmentResult {
  completed: boolean;
  completionDate: string;
  score: number;
  totalQuestions: number;
}

export type SectionAnswers = Record<
  string,
  string | number | boolean | undefined
>;
