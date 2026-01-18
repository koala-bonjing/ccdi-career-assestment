import type { ProgramScores } from "./types";
import type { ProgramType } from "./types";
import type { AssessmentAnswers } from "../../types";

export const getRecommendedProgram = (scores: ProgramScores): ProgramType => {
  const entries = Object.entries(scores) as [keyof ProgramScores, number][];
  const [highestKey] = entries.reduce(
    (max, entry) => (entry[1] > max[1] ? entry : max),
    ["BSCS", -1] as [keyof ProgramScores, number]
  );

  const SHORT_TO_FULL: Record<keyof ProgramScores, ProgramType> = {
    BSCS: "BSCS",
    BSIT: "BSIT",
    BSIS: "BSIS",
    "BSET-E": "BSET Electronics Technology",
    "BSET-EL": "BSET Electrical Technology",
  };

  return SHORT_TO_FULL[highestKey];
};

export const isSectionComplete = (
  sectionKey: keyof AssessmentAnswers,
  questions: { questionText: string }[],
  formData: {
    academicAptitude: Record<string, number>;
    technicalSkills: Record<string, boolean>;
    careerInterest: Record<string, number>;
    learningWorkStyle: Record<string, number>;
  },
  requireFullCompletion = true
): boolean => {
  if (sectionKey === "technicalSkills") {
    return questions.some(
      (q) => formData[sectionKey]?.[q.questionText] === true
    );
  }

  const answered = questions.filter((q) => {
    const ans = formData[sectionKey]?.[q.questionText];
    if (requireFullCompletion) {
      return typeof ans === "number" && ans >= 1 && ans <= 5;
    }
    return ans !== undefined;
  });

  return requireFullCompletion
    ? answered.length === questions.length
    : answered.length > 0;
};
