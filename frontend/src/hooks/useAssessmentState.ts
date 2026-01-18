// src/components/WelcomeScreen/hooks/useAssessmentState.ts
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../config/constants";

import type {
  AssessmentResult,
  AssessmentDisplayResult,
  ProgramType,
} from "../types";

// 🔹 Derive display-ready data (used by WelcomeScreen UI)
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

  const sortedPrograms = programLabels
    .map((prog) => ({
      program: prog,
      percent: result.percent[prog] ?? 0,
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
      Math.max(...programLabels.map((p) => result.percent[p] ?? 0)),
    ),
    totalQuestions: 50,
    recommendedPaths: topPaths,
    strengths: ["Analytical Thinking", "Problem Solving", "Technical Aptitude"],
  };
};

// 🔹 Check if user has unsaved progress
// 🔹 Check if user has unsaved progress
const hasExistingProgress = (): boolean => {
  try {
    const answers = localStorage.getItem("evaluation-answers");
    if (!answers) return false;
    const parsed = JSON.parse(answers);

    // Type guard to check if parsed is an object
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return false;
    }

    return Object.values(parsed).some((section) => {
      return (
        section &&
        typeof section === "object" &&
        !Array.isArray(section) &&
        Object.keys(section).length > 0
      );
    });
  } catch (error) {
    console.error("Error checking progress:", error);
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
    try {
      setLoading(true);

      // ✅ Check localStorage for in-progress answers
      setHasProgress(hasExistingProgress());

      // ✅ Fetch completed evaluations from backend
      if (user?._id) {
        console.log("🔍 Checking for saved evaluations for user:", user._id);

        const response = await axios.get(
          `${BASE_URL}/api/get-evaluations/${user._id}`,
        );

        if (response.data.success && response.data.data.length > 0) {
          const latest = response.data.data[0];
          console.log("✅ Found latest evaluation:", latest);

          const result: AssessmentResult = {
            success: true,
            summary: latest.summary || latest.evaluation || "",
            evaluation: latest.evaluation || "",
            recommendations: latest.recommendations || "",
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
            answers: latest.answers || "",
          };

          setRawResult(result);
          setHasCompleted(true);
        } else {
          console.log("ℹ️ No completed evaluations found");
          setRawResult(null);
          setHasCompleted(false);
        }
      } else {
        setRawResult(null);
        setHasCompleted(false);
      }
    } catch (error) {
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

  const clearAssessmentStorage = () => {
    localStorage.removeItem("evaluation-answers");
    localStorage.removeItem("currentAssessmentSection");
    setHasProgress(false);
  };

  const refetch = () => {
    checkAssessmentStatus();
  };

  // ✅ Derive display-ready object
  const assessmentResult = deriveDisplayData(rawResult);

  return {
    assessmentResult, // AssessmentDisplayResult | null
    hasProgress,
    hasCompleted,
    loading,
    clearAssessmentStorage,
    refetch,
  };
};
