export type QuestionCategory = {
  [key: string]: string[] | Record<string, string[]>;
};

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
