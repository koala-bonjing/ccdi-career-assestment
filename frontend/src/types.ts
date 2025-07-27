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

export interface AssessmentResult {
  success: boolean;
  evaluation: string;
  recommendations: string;
  recommendedProgram: ProgramType;
  percent?: {
    BSCS: number;
    BSIT: number;
    BSIS: number;
    teElectrical: number;
  };
  user: User;
}
