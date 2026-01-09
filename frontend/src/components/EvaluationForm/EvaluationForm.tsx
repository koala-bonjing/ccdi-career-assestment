import { GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect, useState } from "react";
import type {
  EvaluationResult,
  AssessmentResult,
  ProgramType,
  AssessmentAnswers,
  User,
  ProgramScores,
} from "../../types";
import { BASE_URL } from "../../config/constants";
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

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

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
          learningStyle: parsed.learningStyle || {},
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
    nested: AssessmentAnswers
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
    Object.entries(nested.learningStyle).forEach(([question, value]) => {
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
      learningStyle: {},
    });

    console.log("🆕 Started new assessment");
  };

  const formatAnswers = (
    answers: Record<string, string | number | boolean>
  ): string => {
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
      .filter((line): line is string => line !== null)
      .join("\n");
  };

  const handleSubmitAnswers = async (
    submissionData: SubmissionData
  ): Promise<void> => {
    console.log("🚀 Submitting assessment...");
    console.log("👤 Current authUser:", authUser);

    const { answers, programScores } = submissionData;

    // CRITICAL: Validate user authentication FIRST
    if (!authUser) {
      console.error("❌ No authenticated user found");
      setError(
        "You must be logged in to submit assessment. Please refresh and login again."
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
      // Save to localStorage
      localStorage.setItem("evaluation-answers", JSON.stringify(answers));

      // Format and validate answers
      const flatAnswers = flattenAnswers(answers);
      const formatted = formatAnswers(flatAnswers);

      if (!formatted || formatted.trim() === "") {
        throw new Error("No answers available to evaluate.");
      }

      // AI Evaluation
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
      });

      const prompt = `
      You are a career/course evaluation assistant for CCDI Sorsogon.

      AVAILABLE PROGRAMS (with descriptions):
      - BSIT: Information Technology — focuses on IT infrastructure, networking, and system administration.
      - BSCS: Computer Science — emphasizes algorithms, software development, and theoretical computing.
      - BSIS: Information Systems — bridges business and technology through data, systems analysis, and project management.
      - BSET Electronics Technology: Electronics Technology — teaches design, development, operation, and maintenance of electronic systems and devices (e.g., robotics, automation, embedded systems, communications).
      - BSET Electrical Technology: Electrical Technology — teaches design, operation, and maintenance of electrical systems and equipment (e.g., power systems, industrial control, motors, electrical installation).

      STUDENT INFORMATION:
      - Name: ${authUser.fullName || authUser.name || "Student"}
      - Preferred Course Interest: ${
        authUser.preferredCourse || "Not specified"
      }

      STUDENT ANSWERS:
      ${formatted}

      INSTRUCTIONS:
      - Recommend **exactly one** program from: 
        ["BSIT", "BSCS", "BSIS", "BSET Electronics Technology", "BSET Electrical Technology"]
      - Avoid generic terms like "BSET" — always use the full program name.
      - Your confidence percentages must sum to ~100%.

      Respond ONLY with valid JSON in this format:
      {
        "summary": "string",
        "result": "string",
        "recommendation": "string",
        "recommendedCourse": "BSCS|BSIT|BSIS|BSET Electronics Technology|BSET Electrical Technology",
        "percent": {
          "BSIT": number,
          "BSCS": number,
          "BSIS": number,
          "BSET Electronics Technology": number,
          "BSET Electrical Technology": number
        }
      }
    `;

      console.log("🤖 Sending request to AI...");
      const aiResponse = await model.generateContent(prompt);
      const raw = aiResponse.response.text();

      const cleanedResponse = raw.replace(/```json|```/g, "").trim();
      const parsed: EvaluationResult = JSON.parse(cleanedResponse);

      console.log("🤖 AI Response parsed:", parsed);

      // Validate AI response
      if (!parsed.recommendedCourse || !parsed.percent) {
        console.error("❌ Invalid AI response:", parsed);
        throw new Error("AI returned incomplete results");
      }

      const transformed: AssessmentResult = {
        success: true,
        summary: parsed.summary,
        evaluation: parsed.result,
        recommendations: parsed.recommendation,
        recommendedProgram: parsed.recommendedCourse as ProgramType,
        user: {
          _id: authUser._id,
          name: authUser.fullName || authUser.name || "Student",
          email: authUser.email || "",
          preferredCourse: authUser.preferredCourse || "Undecided",
        },
        percent: parsed.percent,
        programScores: programScores,
        submissionDate: new Date().toISOString(),
      };

      setResult(transformed);

      // Clear localStorage
      localStorage.removeItem("evaluation-answers");
      localStorage.removeItem("currentAssessmentSection");

      // Save to backend
      try {
        const payload = {
          userId: authUser._id,
          userName: authUser.fullName || authUser.name || "Anonymous",
          userEmail: authUser.email || "",
          evaluation: parsed.result || "",
          recommendations: parsed.recommendation || "",
          recommendedCourse: parsed.recommendedCourse,
          percent: parsed.percent,
          programScores: programScores || {},
        };

        console.log("📤 Saving to backend:", payload);

        const response = await axios.post(
          `${BASE_URL}/api/save-evaluation`,
          payload
        );

        console.log("✅ Backend save successful:", response.data);
      } catch (saveError) {
        console.error("⚠️ Backend save failed:", saveError);
        if (axios.isAxiosError(saveError)) {
          console.error("Response data:", saveError.response?.data);
          console.error("Response status:", saveError.response?.status);
        }
        // Continue anyway since we have the result
      }
    } catch (err: unknown) {
      console.error("❌ Evaluation error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Please try again.";
      setError(`Failed to generate evaluation: ${errorMessage}`);
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
