import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../config/constants";
import { useEvaluationStore } from "../../store/useEvaluationStore";
import { StorageEncryptor } from "../components/ResultPage/utils/encryption";
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

/**
 * Checks if the user has ongoing assessment progress in storage.
 */
const hasExistingProgress = (): boolean => {
  try {
    const answers = StorageEncryptor.getItem("evaluation-answers");
    if (!answers) {
      console.log("ℹ️ No evaluation-answers found in storage");
      return false;
    }
    
    const parsed = JSON.parse(answers);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      console.log("ℹ️ Invalid evaluation-answers format");
      return false;
    }

    const hasAnswers = Object.values(parsed).some((section) => {
      return (
        section &&
        typeof section === "object" &&
        Object.keys(section).length > 0
      );
    });
    
    console.log("📝 Has existing progress:", hasAnswers);
    return hasAnswers;
  } catch (error) {
    console.error("❌ Error checking progress:", error);
    return false;
  }
};

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
    console.error("❌ Error accessing evaluation store:", error);
  }
  return null;
};

const checkStorageForResult = (): AssessmentResult | null => {
  try {
    const storageKeys = [
      "assessment-result",
      "evaluation-storage",
      "evaluation-result",
    ];

    for (const key of storageKeys) {
      const data = StorageEncryptor.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);

        if (parsed?.state?.result) {
          console.log(`✅ Found completed result in ${key} (Zustand format)`);
          return parsed.state.result;
        }

        if (parsed?.recommendedProgram || parsed?.success) {
          console.log(`✅ Found completed result in ${key} (direct format)`);
          return parsed;
        }
      }
    }
    
    console.log("ℹ️ No completed result found in storage");
  } catch (error) {
    console.error("❌ Error reading storage:", error);
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

    /* Determine assessment status through a fallback sequence */
    const progress = hasExistingProgress();
    setHasProgress(progress);

    const storeResult = checkEvaluationStore();
    if (storeResult) {
      console.log("📦 Using completed result from evaluation store");
      setRawResult(storeResult);
      setHasCompleted(true);
      setDataSource("store");
      setLoading(false);
      return;
    }

    const storageResult = checkStorageForResult();
    if (storageResult) {
      console.log("💾 Using completed result from storage");
      setRawResult(storageResult);
      setHasCompleted(true);
      setDataSource("local");
      setLoading(false);
      return;
    }

    if (user?._id) {
      try {
        console.log(
          `📡 Fetching from API: ${BASE_URL}/api/get-evaluations/${user._id}`,
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

          console.log("✅ Loaded completed result from API");
          setRawResult(result);
          setHasCompleted(true);
          setDataSource("api");

          StorageEncryptor.setItem("assessment-result", JSON.stringify(result));
        } else {
          console.log("ℹ️ No completed assessment found in API");
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
      console.log("🗑️ Clearing assessment storage...");
      
      StorageEncryptor.removeItem("evaluation-answers");
      StorageEncryptor.removeItem("currentAssessmentSection");
      
      setHasProgress(false);
      
      useEvaluationStore.getState().clearAllAnswers?.();
      
      console.log("✅ Cleared in-progress assessment data");
    },
    refetch: checkAssessmentStatus,
    dataSource,
  };
};