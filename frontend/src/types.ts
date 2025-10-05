export interface User {
  _id: string;
  name: string;
  email: string;
  evaluations?: Evaluation[];
}

export interface Evaluation {
  date?: Date;
  answers: AssessmentAnswers;
  evaluation: string;
  recommendations: string;
  recommendedProgram: ProgramType;
}

export type ProgramType = "BSCS" | "BSIT" | "BSIS" | "teElectrical";

export const ProgramLabels: Record<ProgramType, string> = {
  BSCS: "BSCS",
  BSIT: "BSIT",
  BSIS: "BSIS",
  teElectrical: "Technology Engineering (Electrical)",
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
    teElectrical: number;
  };
}