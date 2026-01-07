// src/components/WelcomeScreen/hooks/useAssessmentState.ts
import { useEffect, useState } from 'react';
import type { AssessmentResult, AssessmentDisplayResult, AssessmentAnswers, ProgramType } from '../types'; // ✅ adjust path


    

// 🔹 Helper: derive display-friendly fields
export const deriveDisplayData = (
  result: AssessmentResult | null
): AssessmentDisplayResult | null => {
  if (!result) return null;

  // Map full program names → display labels
  const programLabels = [
    "BSIT",
    "BSCS",
    "BSIS",
    "BSET Electronics Technology",
    "BSET Electrical Technology",
  ] as const;

  // Get top 3 recommended paths (by percent)
  const sortedPrograms = programLabels
    .map((prog) => ({
      program: prog,
      percent: result.percent[prog],
    }))
    .sort((a, b) => b.percent - a.percent);

  const topPaths = sortedPrograms
    .filter(p => p.percent > 0)
    .slice(0, 3)
    .map(p => p.program);

  return {
    ...result,
    completed: result.success,
    completionDate: result.submissionDate || new Date().toLocaleDateString(),
    // 💡 Derive score: e.g., max percent → normalized score out of 100
    // You can adjust logic (e.g. average of top 2, etc.)
    score: Math.round(Math.max(...programLabels.map(p => result.percent[p]))),
    totalQuestions: 50, // ✅ Replace with actual if known, or derive from answers
    recommendedPaths: topPaths,
    strengths: [  // ✅ Mock for now — replace with real logic (e.g. from evaluation text)
      "Analytical Thinking",
      "Problem Solving",
      "Technical Aptitude",
    ],
  };
};

// 🔹 Helper: check raw localStorage for legacy or canonical data
const getStoredAssessment = (): AssessmentResult | null => {
  try {
    // 🔹 Try canonical format first
    const stored = localStorage.getItem('assessment-result');
    if (stored) return JSON.parse(stored) as AssessmentResult;

    // 🔹 Fallback: legacy format (for smooth migration)
    const completed = localStorage.getItem('assessment-completed') === 'true';
    if (!completed) return null;

    const completionDate =
      localStorage.getItem('assessment-completion-date') ||
      new Date().toLocaleDateString();

    const scoreData = localStorage.getItem('assessment-score');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { score = 85, totalQuestions = 50 } = scoreData
      ? JSON.parse(scoreData)
      : {};

    const recData = localStorage.getItem('assessment-recommendations');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { recommendedPaths = ["BSIT", "BSCS"], strengths = [] } = recData
      ? JSON.parse(recData)
      : {};

    // ⚠️ Fallback: synthetic canonical result
    const percent = {
      BSIT: 85,
      BSCS: 78,
      BSIS: 65,
      "BSET Electronics Technology": 42,
      "BSET Electrical Technology": 38,
    };

    return {
      success: true,
      summary: "Legacy assessment",
      evaluation: "Completed via legacy flow",
      recommendations: "See recommended paths",
      recommendedProgram: recommendedPaths[0] as ProgramType, // ⚠️ safe assumption for migration
      user: { _id: '', name: '', email: '' }, // placeholder
      percent,
      programScores: {
        BSIT: score,
        BSCS: 78,
        BSIS: 65,
        "BSET-E": 42,
        "BSET-EL": 38,
      },
      submissionDate: completionDate,
    };
  } catch (error) {
    console.error('Failed to parse stored assessment', error);
    return null;
  }
};

const hasExistingProgress = (): boolean => {
  try {
    const answers = localStorage.getItem('evaluation-answers');
    if (!answers) return false;
    const parsed: AssessmentAnswers = JSON.parse(answers);
    return Object.values(parsed).some(section => Object.keys(section).length > 0);
  } catch (error) {
    console.error('Error checking progress:', error);
    return false;
  }
};

export const useAssessmentState = () => {
  const [rawResult, setRawResult] = useState<AssessmentResult | null>(null);
  const [hasProgress, setHasProgress] = useState(false);

  // Derive display-ready version
  const displayResult = deriveDisplayData(rawResult);

  const clearAssessmentStorage = () => {
    // Canonical key
    localStorage.removeItem('assessment-result');
    // Legacy keys (for migration)
    [
      'evaluation-answers',
      'currentAssessmentSection',
      'assessmentProgress',
      'assessment-completed',
      'assessment-score',
      'assessment-recommendations',
    ].forEach(key => localStorage.removeItem(key));
  };

  const refetch = () => {
    const result = getStoredAssessment();
    setRawResult(result);
    setHasProgress(hasExistingProgress());
  };

  useEffect(() => {
    refetch();
  }, []);

  return {
    assessmentResult: displayResult, // ✅ now AssessmentDisplayResult | null
    hasProgress,
    hasCompleted: displayResult?.completed ?? false,
    clearAssessmentStorage,
    refetch,
  };
};