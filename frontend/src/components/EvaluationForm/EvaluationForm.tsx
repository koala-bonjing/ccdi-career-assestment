import { GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect, useState } from "react";
import type { EvaluationResult } from "../../types";
import { BASE_URL } from "../../config/constants";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { useWelcomeScreen } from "../../../store/useWelcomeScreenStore";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer } from "react-toastify";
import AssessmentForm from "../AssestmentForm/AssessmentForm";
import ResultsPage from "../ResultPage/ResultPage";
import WelcomeScreenComponent from "../WelcomeScreen/WelcomePage";
import AuthComponent from "../Auth/AuthComponent/AuthComponent";
import type {
  AssessmentResult,
  ProgramType,
  AssessmentAnswers,
} from "../../types";
import LoadingSpinner from "../LoadingSpinner/index";
import axios from "axios";

const genAI = new GoogleGenerativeAI(
  import.meta.env.REACT_APP_GEMINI_API_KEY ||
    "AIzaSyAnzBdIYWGwBR4p7V1_tTrHQkUZDiYFXZw"
);

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

  // Simple state management - no complex hooks
  const [restoredFormData, setRestoredFormData] =
    useState<AssessmentAnswers | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Simple data loading on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadSavedData();
    }
  }, [isAuthenticated]);

  const loadSavedData = () => {
    try {
      const savedAnswers = localStorage.getItem("evaluation-answers");
      if (savedAnswers) {
        const parsed = JSON.parse(savedAnswers);
        console.log("📥 Loaded saved answers:", parsed);

        // Convert to form data structure
        const formData: AssessmentAnswers = {
          academicAptitude: parsed.academicAptitude || {},
          technicalSkills: parsed.technicalSkills || {},
          careerInterest: parsed.careerInterest || {},
          learningStyle: parsed.learningStyle || {},
        };

        setRestoredFormData(formData);

        // Also update the store
        const flatData = flattenAnswers(formData);
        setStoreAnswer(flatData);
      }
      setHasLoaded(true);
    } catch (error) {
      console.error("Error loading saved data:", error);
      setHasLoaded(true);
    }
  };

  const flattenAnswers = (nested: AssessmentAnswers): Record<string, any> => {
    const flat: Record<string, any> = {};

    Object.entries(nested).forEach(([section, questions]) => {
      Object.entries(questions).forEach(([question, value]) => {
        flat[`${section}.${question}`] = value;
      });
    });

    return flat;
  };

  // Handle starting new assessment
  const handleStartNew = () => {
    // Clear all data
    localStorage.removeItem("evaluation-answers");
    localStorage.removeItem("currentAssessmentSection");
    clearAllAnswers();
    setRestoredFormData({
      academicAptitude: {},
      technicalSkills: {},
      careerInterest: {},
      learningStyle: {},
    });

    console.log("🆕 Started new assessment");
  };

  // Simple conditional renders
  if (!isAuthenticated) {
    return (
      <div className="evaluation-form">
        <ToastContainer />
        <AuthComponent />
      </div>
    );
  }

  if (showWelcome) {
    return <WelcomeScreenComponent onStartNew={handleStartNew} />;
  }

  if (result) {
    return (
      <div className="evaluation-form">
        <ToastContainer />
        <ResultsPage />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="evaluation-form">
        <ToastContainer />
        <LoadingSpinner />
      </div>
    );
  }

  // Format answers for AI (keep your existing formatAnswers function)
  const formatAnswers = (answers: Record<string, any>) => {
    return Object.entries(answers)
      .map(([question, value]) => {
        if (typeof value === "number") {
          return `- ${question}: ${value}/5`;
        }
        if (typeof value === "boolean") {
          return value ? `- ${question}: Yes` : null;
        }
        return `- ${question}: ${value}`;
      })
      .filter(Boolean)
      .join("\n");
  };

  const handleSubmitAnswers = async (submissionData: any) => {
    console.log("🚀 Submitting assessment...");

    const { answers, programScores, recommendedProgram } = submissionData;
    setLoading(true);
    setError(null);

    try {
      // Auto-save the answers before submission
      localStorage.setItem("evaluation-answers", JSON.stringify(answers));

      const flatAnswers = flattenAnswers(answers);
      const formatted = formatAnswers(flatAnswers);

      if (!formatted || formatted.trim() === "") {
        throw new Error("No answers available to evaluate.");
      }

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
      });

      const prompt = `
        You are a career/course evaluation assistant. 
        Evaluate the following student's preferences carefully.

        STUDENT INFORMATION:
        - Name: ${authUser?.fullName || "Student"}
        - Preferred Course Interest: ${
          authUser?.preferredCourse || "Not specified"
        }

        STUDENT ANSWERS:
        ${formatted}

        For your response, provide:

        1) A detailed evaluation summary
        2) A recommended course (choose from BSIT, BSCS, BSIS, or EE)
        3) A clear explanation of why this recommendation is best
        4) A confidence percentage breakdown for each course

        Respond ONLY with valid JSON in this format:
        {
          "summary": "<short summary>",
          "result": "<detailed evaluation>",
          "recommendation": "<why the recommended program fits best>",
          "recommendedCourse": "<BSCS|BSIT|BSIS|EE>",
          "percent": {
            "BSIT": <0-100>,
            "BSCS": <0-100>,
            "BSIS": <0-100>,
            "EE": <0-100>
          }
        }
      `;

      console.log("🤖 Sending request to AI...");
      const aiResponse = await model.generateContent(prompt);
      const raw = aiResponse.response.text();

      let cleanedResponse = raw.replace(/```json|```/g, "").trim();
      const parsed: EvaluationResult = JSON.parse(cleanedResponse);

      const transformed: AssessmentResult = {
        success: true,
        summary: parsed.summary,
        evaluation: parsed.result,
        recommendations: parsed.recommendation,
        recommendedProgram: parsed.recommendedCourse as ProgramType,
        user: {
          _id: authUser?.id || "temp-id",
          name: authUser?.fullName || "Student",
          email: authUser?.email || "",
          preferredCourse: authUser?.preferredCourse || "Undecided",
        },
        percent: parsed.percent,
        programScores: programScores,
        submissionDate: new Date().toISOString(),
      };

      setResult(transformed);

      // Clear saved data after successful submission
      localStorage.removeItem("evaluation-answers");
      localStorage.removeItem("currentAssessmentSection");

      // Try to save to backend (optional)
      try {
        await axios.post(`${BASE_URL}/api/save-evaluation`, {
          userId: authUser?.id,
          userName: authUser?.fullName,
          userEmail: authUser?.email,
          evaluation: parsed.result,
          recommendations: parsed.recommendation,
          recommendedCourse: parsed.recommendedCourse,
          percent: parsed.percent,
          programScores: programScores,
        });
      } catch (saveError) {
        console.warn("⚠️ Failed to save to backend, but continuing...");
      }
    } catch (err: any) {
      console.error("❌ Evaluation error:", err);
      setError(
        `Failed to generate evaluation: ${err.message || "Please try again."}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="evaluation-form">

      <AssessmentForm
        currentUser={{
          _id: authUser?.id || "temp-id",
          name: authUser?.fullName || "Student",
          email: authUser?.email || "",
          preferredCourse: authUser?.preferredCourse || "Undecided",
        }}
        setCurrentUser={() => {}} // You can remove this if not needed
        onSubmit={handleSubmitAnswers}
        loading={loading}
        restoredFormData={restoredFormData}
        onStartNew={handleStartNew} // Add this prop
      />
    </div>
  );
};

export default EvaluationForm;
