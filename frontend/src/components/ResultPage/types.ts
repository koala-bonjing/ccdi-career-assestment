// src/pages/ResultsPage/types.ts
export type ProgramType =
  | "BSIT"
  | "BSCS"
  | "BSIS"
  | "BSET Electronics Technology"
  | "BSET Electrical Technology";

export const ProgramLabels: Record<ProgramType, string> = {
  BSCS: "BS in Computer Science",
  BSIT: "BS in Information Technology",
  BSIS: "BS in Information Systems",
  "BSET Electronics Technology": "BSET in Electronics Technology",
  "BSET Electrical Technology": "BSET in Electrical Technology",
};

// Full-name percentages (normalized)
export interface ProgramPercentages {
  BSIT: number;
  BSCS: number;
  BSIS: number;
  "BSET Electronics Technology": number;
  "BSET Electrical Technology": number;
}

// Short-key (backend format — for normalization only)
export interface ShortKeyPercentages {
  BSIT: number;
  BSCS: number;
  BSIS: number;
  "BSET-E": number;
  "BSET-EL": number;
}

export interface AcademicBreakdown {
  verbalComprehension: number;
  logicalReasoning: number;
  mathematicalAptitude: number;
  criticalAnalysis: number;
}

export interface RatingScale {
  collaboration: number;
  processOptimization: number;
  creativeProblemSolving: number;
  independentCoding: number;
  handsOnWork: number;
}

export interface LearningStyle {
  visual: number;
  auditory: number;
  readingWriting: number;
  kinesthetic: number;
}

export interface TechnicalBreakdown {
  selectedSkills: string[];
  skillCount: number;
  totalSkills: number;
}

export interface ProgramComparison {
  matchStrengths: string[];
  score: number;
  gap?: string[];
}

export interface RecommendationReasoning {
  academic: AcademicBreakdown;
  technical: TechnicalBreakdown;
  interest: RatingScale;
  learningStyle: LearningStyle;
  topStrengths: string[];
  keyDifferentiator: string;
  summary: string;
  comparison: Record<string, ProgramComparison>;
}

export interface EvaluationResult {
  recommendedProgram: ProgramType;
  percent: Record<ProgramType | string, number>;
  evaluation: string;
  recommendations: string;
  summary?: string;
  reasoning?: RecommendationReasoning;
}

export interface AuthUser {
  _id: string;
  name: string;
  fullName?: string;
  preferredCourse?: string;
  email: string;
}