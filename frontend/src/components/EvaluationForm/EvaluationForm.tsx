import { useEffect, useState } from "react";
import type {
  AssessmentResult,
  ProgramType,
  AssessmentAnswers,
  User,
  ProgramScores,
} from "../../types";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { useWelcomeScreen } from "../../../store/useWelcomeScreenStore";
import { useAuth } from "../../context/AuthContext";
import AssessmentForm from "../AssestmentForm//assessment-form";
import ResultsPage from "../../components/ResultPage/result-page";
import WelcomeScreenComponent from "../../components/WelcomeScreen/WelcomePage";
import AuthComponent from "../Auth/AuthComponent/AuthComponent";
import LoadingSpinner from "../ui/LoadingSpinner/index";
import axios from "axios";
import { ToastContainer } from "react-bootstrap";

export interface SubmissionData {
  answers: AssessmentAnswers;
  programScores: ProgramScores;
  recommendedProgram: ProgramType;
}

// ✅ Use the correct environment variable
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

console.log("🔗 API Base URL:", API_BASE_URL);

const EvaluationForm = () => {
  const { showWelcome } = useWelcomeScreen();
  const {
    result,
    setError,
    setLoading,
    setResult,
    loading,
    setAnswers: setStoreAnswer,
    clearAllAnswers,
  } = useEvaluationStore();

  const { isAuthenticated, user: authUser } = useAuth();

  const [restoredFormData, setRestoredFormData] = useState<
    AssessmentAnswers | undefined
  >(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadSavedData();
    }
  }, [isAuthenticated]);

  const loadSavedData = (): void => {
    try {
      const savedAnswers = localStorage.getItem("evaluation-answers");
      if (savedAnswers) {
        const parsed: AssessmentAnswers = JSON.parse(savedAnswers);
        console.log("📥 Loaded saved answers:", parsed);

        const formData: AssessmentAnswers = {
          academicAptitude: parsed.academicAptitude || {},
          technicalSkills: parsed.technicalSkills || {},
          careerInterest: parsed.careerInterest || {},
          learningWorkStyle: parsed.learningWorkStyle || {},
        };

        setRestoredFormData(formData);

        const flatData = flattenAnswers(formData);
        setStoreAnswer(flatData);
      }
      setHasLoaded(true);
    } catch (error) {
      console.error("Error loading saved data:", error);
      setHasLoaded(true);
    }
  };

  const flattenAnswers = (
    nested: AssessmentAnswers,
  ): Record<string, string | number | boolean> => {
    const flat: Record<string, string | number | boolean> = {};

    // Academic Aptitude (numbers)
    Object.entries(nested.academicAptitude).forEach(([question, value]) => {
      flat[`academicAptitude.${question}`] = value;
    });

    // Technical Skills (booleans)
    Object.entries(nested.technicalSkills).forEach(([question, value]) => {
      flat[`technicalSkills.${question}`] = value;
    });

    // Career Interest (numbers)
    Object.entries(nested.careerInterest).forEach(([question, value]) => {
      flat[`careerInterest.${question}`] = value;
    });

    // Learning Style (numbers)
    Object.entries(nested.learningWorkStyle).forEach(([question, value]) => {
      flat[`learningStyle.${question}`] = value;
    });

    return flat;
  };

  const handleStartNew = (): void => {
    localStorage.removeItem("evaluation-answers");
    localStorage.removeItem("currentAssessmentSection");
    clearAllAnswers();
    setRestoredFormData({
      academicAptitude: {},
      technicalSkills: {},
      careerInterest: {},
      learningWorkStyle: {},
    });

    console.log("🆕 Started new assessment");
  };

  const handleSubmitAnswers = async (
    submissionData: SubmissionData,
  ): Promise<void> => {
    console.log("🚀 Submitting assessment...");
    console.log("👤 Current authUser:", authUser);

    const { answers, programScores } = submissionData;

    // CRITICAL: Validate user authentication FIRST
    if (!authUser) {
      console.error("❌ No authenticated user found");
      setError(
        "You must be logged in to submit assessment. Please refresh and login again.",
      );
      return;
    }

    if (!authUser._id) {
      console.error("❌ User ID is missing from authUser:", authUser);
      setError("User authentication error. Please logout and login again.");
      return;
    }

    console.log("✅ User authenticated:", authUser._id);

    setLoading(true);
    setError(null);

    try {
      // Save to localStorage (optional, for recovery)
      localStorage.setItem("evaluation-answers", JSON.stringify(answers));

      // ✅ SEND TO YOUR EXPRESS BACKEND INSTEAD OF CALLING AI HERE
      console.log(
        "📡 Sending request to:",
        `${API_BASE_URL}/api/evaluate-assessment`,
      );

      const response = await axios.post(
        `${API_BASE_URL}/api/evaluate-assessment`,
        {
          userId: authUser._id,
          fullName: authUser.fullName || authUser.name,
          email: authUser.email,
          preferredCourse: authUser.preferredCourse,
          answers: answers,
          programScores: programScores,
        },
      );

      console.log("✅ Backend response:", response.data);

      // The backend returns the full AssessmentResult
      const backendResult = response.data;

      // Transform backend response to match your AssessmentResult type
      const transformed: AssessmentResult = {
        success: backendResult.success,
        summary: backendResult.summary,
        evaluation: backendResult.evaluation,
        recommendations: backendResult.recommendations || "",
        detailedEvaluation: backendResult.detailedEvaluation,
        recommendedProgram: backendResult.recommendedProgram as ProgramType,
        user: backendResult.user,
        percent: backendResult.percent,
        programScores: backendResult.programScores || programScores,
        submissionDate: backendResult.submissionDate,
        answers: backendResult.answers || answers,
        aiAnswer: backendResult.aiAnswer,
        categoryExplanations: backendResult.categoryExplanations,
      };

      // Store result in Zustand
      setResult(transformed);

      // Clear localStorage
      localStorage.removeItem("evaluation-answers");
      localStorage.removeItem("currentAssessmentSection");

      console.log("✅ Evaluation complete and stored");
    } catch (err: unknown) {
      console.error("❌ Evaluation error:", err);

      if (axios.isAxiosError(err)) {
        console.error("Response data:", err.response?.data);
        console.error("Response status:", err.response?.status);

        const errorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to process assessment";

        setError(`Failed to generate evaluation: ${errorMessage}`);
      } else if (err instanceof Error) {
        setError(`Failed to generate evaluation: ${err.message}`);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="evaluation-form">
        <AuthComponent initialMode={"login"} />
      </div>
    );
  }

  if (showWelcome) {
    return <WelcomeScreenComponent onStartNew={handleStartNew} />;
  }

  if (result) {
    return (
      <div className="evaluation-form">
        <ResultsPage result={result} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="evaluation-form">
        <LoadingSpinner />
      </div>
    );
  }

  const currentUser: User = {
    _id: authUser?._id || "temp-id",
    name: authUser?.fullName || "Student",
    email: authUser?.email || "",
    preferredCourse: authUser?.preferredCourse || "Undecided",
  };

  return (
    <div className="evaluation-form">
      <ToastContainer />
      <AssessmentForm
        currentUser={currentUser}
        onSubmit={handleSubmitAnswers}
        loading={loading}
        restoredFormData={restoredFormData}
        onStartNew={handleStartNew}
      />
    </div>
  );
};

export default EvaluationForm;
