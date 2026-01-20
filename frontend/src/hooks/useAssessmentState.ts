// src/components/WelcomeScreen/hooks/useAssessmentState.ts
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Fixed path
import axios from "axios";
import { BASE_URL } from "../config/constants"; // Fixed path

import type {
  AssessmentResult,
  AssessmentDisplayResult,
  ProgramType,
  AssessmentAnswers,
} from "../types";

export const deriveDisplayData = (
  result: AssessmentResult | null,
): AssessmentDisplayResult | null => {
  if (!result) return null;

  const programLabels = [
    "BSIT",
    "BSCS",
    "BSIS",
    "BSET Electronics Technology",
    "BSET Electrical Technology",
  ] as const;

  // Defensive check: Ensure result.percent exists before mapping
  const percentData = result.percent || {};

  const sortedPrograms = programLabels
    .map((prog) => ({
      program: prog,
      percent: percentData[prog] ?? 0,
    }))
    .sort((a, b) => b.percent - a.percent);

  const topPaths = sortedPrograms
    .filter((p) => p.percent > 0)
    .slice(0, 3)
    .map((p) => p.program);

  return {
    ...result,
    completed: result.success,
    completionDate: result.submissionDate
      ? new Date(result.submissionDate).toLocaleDateString()
      : new Date().toLocaleDateString(),
    score: Math.round(
      Math.max(...programLabels.map((p) => percentData[p] ?? 0), 0),
    ),
    totalQuestions: 50,
    recommendedPaths: topPaths,
    strengths: ["Analytical Thinking", "Problem Solving", "Technical Aptitude"],
  };
};

const hasExistingProgress = (): boolean => {
  try {
    const answers = localStorage.getItem("evaluation-answers");
    if (!answers) return false;
    const parsed = JSON.parse(answers);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return false;

    return Object.values(parsed).some((section) => {
      return (
        section &&
        typeof section === "object" &&
        Object.keys(section).length > 0
      );
    });
  } catch {
    return false;
  }
};

export const useAssessmentState = () => {
  const { user } = useAuth();
  const [rawResult, setRawResult] = useState<AssessmentResult | null>(null);
  const [hasProgress, setHasProgress] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAssessmentStatus = async () => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setHasProgress(hasExistingProgress());

      const response = await axios.get(
        `${BASE_URL}/api/get-evaluations/${user._id}`,
      );

      if (response.data.success && response.data.data.length > 0) {
        const latest = response.data.data[0];

        // ✅ FIXED: Mapping logic with fallback objects instead of strings
        const result: AssessmentResult = {
          success: true,
          summary:
            latest.summary || latest.evaluation || "No summary available",
          evaluation: latest.evaluation || "",
          detailedEvaluation: latest.detailedEvaluation || "",
          recommendedProgram: latest.recommendedCourse as ProgramType,
          user: {
            _id: user._id,
            name: user.fullName || user.name || "Student",
            email: user.email || "",
            preferredCourse: user.preferredCourse || "Undecided",
          },
          percent: latest.percent || {},
          programScores: latest.programScores || {},
          submissionDate: latest.submissionDate || new Date().toISOString(),
          // ✅ FIX: answers must be an object, not a string ""
          answers: (latest.answers ||
            latest.rawAnswers ||
            {}) as AssessmentAnswers,
          categoryScores: latest.categoryScores || {
            academic: 0,
            technical: 0,
            career: 0,
            logistics: 0,
          },
        };

        setRawResult(result);
        setHasCompleted(true);
      } else {
        setRawResult(null);
        setHasCompleted(false);
      }
    } catch (error) {
      // This is where your 500 error is caught
      console.error("❌ Error fetching assessment status:", error);
      setRawResult(null);
      setHasCompleted(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAssessmentStatus();
  }, [user?._id]);

  const assessmentResult = deriveDisplayData(rawResult);

  return {
    assessmentResult,
    hasProgress,
    hasCompleted,
    loading,
    clearAssessmentStorage: () => {
      localStorage.removeItem("evaluation-answers");
      setHasProgress(false);
    },
    refetch: checkAssessmentStatus,
  };
};
