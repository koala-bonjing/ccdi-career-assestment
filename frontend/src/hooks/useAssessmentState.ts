// src/components/WelcomeScreen/hooks/useAssessmentState.ts
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../config/constants";
import { useEvaluationStore } from "../../store/useEvaluationStore";
import type {
  AssessmentResult,
  AssessmentDisplayResult,
  ProgramType,
  AssessmentAnswers,
  CategoryExplanations,
  PrereqAnalysis,
} from "../types";

export const deriveDisplayData = (
  result: AssessmentResult | null,
): AssessmentDisplayResult | null => {
  if (!result) return null;

  return {
    ...result,
    completed: result.success,
    completionDate: result.submissionDate
      ? new Date(result.submissionDate).toLocaleDateString()
      : new Date().toLocaleDateString(),
    score: Math.round(
      Math.max(...(Object.values(result.percent || {}) as number[]), 0),
    ),
    totalQuestions: 50,
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

// Helper to check Zustand store
const checkEvaluationStore = (): AssessmentResult | null => {
  try {
    const storeState = useEvaluationStore.getState();

    if (
      storeState.result &&
      (storeState.result.recommendedProgram || storeState.result.success)
    ) {
      console.log("✅ Found assessment data in evaluation store");
      return storeState.result;
    }
  } catch (error) {
    console.error("Error accessing evaluation store:", error);
  }
  return null;
};

// Helper to check localStorage for completed results
const checkLocalStorageForResult = (): AssessmentResult | null => {
  try {
    const storageKeys = [
      "assessment-result",
      "evaluation-storage",
      "evaluation-result",
    ];

    for (const key of storageKeys) {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);

        // Check if it's the result object
        if (parsed?.state?.result) {
          console.log(`✅ Found in ${key} (Zustand format)`);
          return parsed.state.result;
        }

        // Check if it's the direct result
        if (parsed?.recommendedProgram || parsed?.success) {
          console.log(`✅ Found in ${key} (direct result)`);
          return parsed;
        }
      }
    }
  } catch (error) {
    console.error("Error reading localStorage:", error);
  }
  return null;
};

export const useAssessmentState = () => {
  const { user } = useAuth();
  const [rawResult, setRawResult] = useState<AssessmentResult | null>(null);
  const [hasProgress, setHasProgress] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<
    "store" | "local" | "api" | "none"
  >("none");

  const checkAssessmentStatus = async () => {
    setLoading(true);

    console.log("🔍 Starting assessment status check...");

    // ✅ FIX: ALWAYS check for progress first, regardless of completed status
    const progress = hasExistingProgress();
    setHasProgress(progress);
    console.log("📝 Progress check:", progress);

    // 1. FIRST: Check Zustand evaluation store (fastest)
    const storeResult = checkEvaluationStore();
    if (storeResult) {
      console.log("📦 Using data from evaluation store");
      setRawResult(storeResult);
      setHasCompleted(true);
      setDataSource("store");
      setLoading(false);
      return;
    }

    // 2. SECOND: Check localStorage for saved results
    const localResult = checkLocalStorageForResult();
    if (localResult) {
      console.log("💾 Using data from localStorage");
      setRawResult(localResult);
      setHasCompleted(true);
      setDataSource("local");
      setLoading(false);
      return;
    }

    // 3. THIRD: Check API for user's assessments (only if we have user ID)
    if (user?._id) {
      try {
        console.log(
          `📡 Calling API: ${BASE_URL}/api/get-evaluations/${user._id}`,
        );

        const response = await axios.get(
          `${BASE_URL}/api/get-evaluations/${user._id}`,
          { timeout: 5000 },
        );

        if (response.data.success && response.data.data.length > 0) {
          const latest = response.data.data[0];

          const result: AssessmentResult = {
            success: true,
            summary:
              latest.summary || latest.evaluation || "No summary available",
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
            answers: (latest.answers ||
              latest.rawAnswers ||
              {}) as AssessmentAnswers,
            categoryScores: latest.categoryScores || {
              academic: 0,
              technical: 0,
              career: 0,
              logistics: 0,
            },
            categoryExplanations:
              latest.categoryExplanations as CategoryExplanations,
            preparationNeeded: latest.preparationNeeded || "",
            examAnalysis: latest.examAnalysis || "",
            prereqAnalysis: latest.prereqAnalysis as PrereqAnalysis,
            successRoadmap: latest.successRoadmap || "",
            foundationalScore: latest.foundationalScore || 0,
            foundationalDetails: latest.foundationalDetails,
            weaknesses: latest.weaknesses,
          };

          setRawResult(result);
          setHasCompleted(true);
          setDataSource("api");

          // Save to localStorage for future use
          localStorage.setItem("assessment-result", JSON.stringify(result));
        } else {
          console.log("ℹ️ No assessment data found in API");
          setDataSource("none");
        }
      } catch (error) {
        console.error("❌ API call failed:", error);
        setDataSource("none");
      }
    } else {
      console.log("👤 No user ID, skipping API check");
      setDataSource("none");
    }

    setLoading(false);
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
      localStorage.removeItem("assessment-result");
      localStorage.removeItem("evaluation-storage");
      setHasProgress(false);
      setHasCompleted(false);
      setRawResult(null);

      // Also clear from evaluation store
      useEvaluationStore.getState().clearAllAnswers?.();
    },
    refetch: checkAssessmentStatus,
    dataSource,
  };
};