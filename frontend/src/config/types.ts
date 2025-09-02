export type QuestionCategory = {
  [key: string]: string[] | Record<string, string[]>;
};

export type AnswerValue = string | number | boolean;

export type FlatQuestionCategory = string[];

export type EvaluationResult = {
  result: string;
  recommendation: string;
  recommendedCourse: string;
  percent: {
    BSIT: number;
    BSCS: number;
    BSIS: number;
    teElectrical: number;
  };
};


// src/types.ts
export interface AssessmentAnswers {
  academicAptitude: Record<string, number | string | boolean>;
  technicalSkills: Record<string, number | string | boolean>;
  careerInterest: Record<string, number | string | boolean>;
  learningStyle: Record<string, number | string | boolean>;
}
