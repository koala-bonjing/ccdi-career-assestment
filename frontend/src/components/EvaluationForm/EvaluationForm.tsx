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
        model: "gemini-3-flash-preview",
      });

      const prompt = `
        You are a career guidance assistant for CCDI Sorsogon, helping students identify the most suitable technology program based on their aptitudes, interests, and circumstances.

        AVAILABLE PROGRAMS:
        1. BSCS (Computer Science) — Focuses on software development, algorithms, theoretical computing, and mathematics. Prepares students for software engineering, AI/ML, and research roles.
        2. BSIT (Information Technology) — Focuses on IT infrastructure, networking, system administration, and cybersecurity. Prepares students for network admin, IT support, and security roles.
        3. BSIS (Information Systems) — Bridges business and technology through data analysis, systems analysis, and IT project management. Prepares students for business analyst and IT consulting roles.
        4. BSET Electronics Technology — Focuses on electronic systems, circuits, microcontrollers, robotics, automation, and embedded systems. Prepares students for electronics technician and design roles.
        5. BSET Electrical Technology — Focuses on electrical power systems, motors, transformers, industrial control, PLC programming, and electrical installation. Prepares students for electrical technician and industrial roles.

        STUDENT PROFILE:
        - Name: ${authUser.fullName || authUser.name || "Student"}
        - Initially Interested In: ${authUser.preferredCourse || "Not specified"}

        STUDENT ASSESSMENT RESPONSES:
        ${formatted}

        EVALUATION CRITERIA:
        Analyze the student's responses across these dimensions:
        - Academic Aptitude: Math skills, theoretical vs. practical preference, learning style
        - Technical Interests: Software vs. hardware, systems vs. applications, business vs. pure tech
        - Career Goals: Desired work environment, job type, industry preferences
        - Logistics & Resources: Financial capacity, time availability, equipment access, physical requirements

        RESPONSE REQUIREMENTS:
        1. **recommendedCourse**: Must be EXACTLY one of: "BSCS", "BSIT", "BSIS", "BSET Electronics Technology", "BSET Electrical Technology"
        2. **summary**: 2-3 sentences highlighting the student's strongest aptitudes and interests
        3. **result**: A clear statement of your primary recommendation and why it's the best fit (3-4 sentences)
        4. **detailedEvaluation**: A comprehensive analysis (4-6 sentences) covering:
          - How their academic strengths align with the recommended program
          - How their technical interests match the program's focus
          - How their career goals fit the typical career paths
          - Any logistical considerations (resources, time, financial factors)
          - Brief mention of why other programs were less suitable
        5. **percent**: Confidence distribution across ALL five programs that sums to exactly 100

        IMPORTANT GUIDELINES:
        - Base your recommendation on the ASSESSMENT DATA, not just their initial preference
        - If their answers strongly indicate a different program than their preference, recommend the better fit and explain why
        - Be specific about program names — never use generic terms like "BSET" alone
        - Ensure percentages are realistic (top choice typically 40-70%, not 95%+)
        - Consider the whole student profile, not just one dimension

        Respond ONLY with valid JSON (no markdown, no explanation):
        {
          "summary": "string",
          "result": "string",
          "detailedEvaluation": "string",
          "recommendedCourse": "BSCS|BSIT|BSIS|BSET Electronics Technology|BSET Electrical Technology",
          "percent": {
            "BSCS": number,
            "BSIT": number,
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
        detailedEvaluation: parsed.detailedEvaluation,
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
