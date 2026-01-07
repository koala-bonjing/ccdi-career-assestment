// src/components/WelcomeScreen/types.ts

export interface AssessmentResult {
  completed: boolean;
  score?: number;
  totalQuestions?: number;
  recommendedPaths?: string[];
  strengths?: string[];
  completionDate?: string;
}

export interface AssessmentAnswers {
  academicAptitude: Record<string, number | boolean>;
  technicalSkills: Record<string, number | boolean>;
  careerInterest: Record<string, number | boolean>;
  learningStyle: Record<string, number | boolean>;
}