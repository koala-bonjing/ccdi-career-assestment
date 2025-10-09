import { GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect, useState } from "react";
import type { EvaluationResult } from "../../types";
import { BASE_URL } from "../../config/constants";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { useWelcomeScreen } from "../../../store/useWelcomeScreenStore";
import { notifySectionWarning } from "../../utils/toastService";
import { useUserStore } from "../../../store/useUserStore";
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
import { useAutoSave } from "../../hooks/useAutoSave";
import { useLoadSavedData } from "../../hooks/useLoadSavedData";
import { useOfflineSave } from "../../hooks/useOfflineSave";
import LoadingSpinner from "../LoadingSpinner/index";
import axios from "axios";

const genAI = new GoogleGenerativeAI(
  import.meta.env.REACT_APP_GEMINI_API_KEY ||
    "AIzaSyAnzBdIYWGwBR4p7V1_tTrHQkUZDiYFXZw"
);

// Convert flat store format to nested form format
const convertStoreToFormData = (
  flatData: Record<string, any>
): AssessmentAnswers => {
  const formData: AssessmentAnswers = {
    academicAptitude: {},
    technicalSkills: {},
    careerInterest: {},
    learningStyle: {},
  };

  Object.entries(flatData).forEach(([key, value]) => {
    const [section, ...questionParts] = key.split(".");
    const question = questionParts.join(".");

    if (section in formData) {
      formData[section as keyof AssessmentAnswers][question] = value;
    }
  });

  console.log("🔄 Converted flat data to form data:", formData);
  return formData;
};

const EvaluationForm = () => {
  const { showWelcome } = useWelcomeScreen();
  const {
    name,
    answers,
    result,
    nextSection,
    prevSection,
    currentSectionIndex,
    sectionKeys,
    setError,
    setLoading,
    setResult,
    loading,
    setAnswers: setStoreAnswer,
  } = useEvaluationStore();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { currentUser, setCurrentUser } = useUserStore();
  const { isAuthenticated, user: authUser } = useAuth();

  const savedData = useLoadSavedData("evaluation-answers");
  const { isSaving } = useAutoSave("evaluation-answers", answers);
  const { isOnline } = useOfflineSave("evaluation-answers", answers);

  // Convert flat answers to form data for the AssessmentForm
  const [restoredFormData, setRestoredFormData] =
    useState<AssessmentAnswers | null>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [hasShownRestoreModal, setHasShownRestoreModal] = useState(false);

  useEffect(() => {
    if (authUser && !currentUser) {
      setCurrentUser({
        _id: authUser.id,
        name: authUser.fullName,
        email: authUser.email,
        preferredCourse: authUser.preferredCourse,
      });
    }
  }, [authUser, currentUser, setCurrentUser]);

  useEffect(() => {
    if (!sessionStorage.getItem("sessionId")) {
      sessionStorage.setItem("sessionId", `session_${Date.now()}`);
    }
  }, []);

  // Enhanced restoration logic with one-time modal
  useEffect(() => {
    if (
      savedData &&
      Object.keys(savedData).length > 0 &&
      !hasShownRestoreModal
    ) {
      console.log("📥 Recovery data available:", savedData);

      // Check if we already have answers to avoid overwriting current progress
      const currentAnswersCount = Object.keys(answers).length;
      const savedAnswersCount = Object.keys(savedData).length;

      if (savedAnswersCount > currentAnswersCount) {
        console.log("🔄 Showing restore modal - saved answers are more recent");

        // Update the store with the flat data
        setStoreAnswer(savedData);

        // Convert and store the form data for the AssessmentForm
        const convertedFormData = convertStoreToFormData(savedData);
        setRestoredFormData(convertedFormData);

        // Show modal only once
        setShowRestoreModal(true);
        setHasShownRestoreModal(true);

        console.log(
          "✅ Prepared restoration data - Form data:",
          convertedFormData
        );
      } else {
        console.log(
          "⏩ Skipping restoration - current progress is more recent"
        );
      }
    }
  }, [savedData, setStoreAnswer, answers, hasShownRestoreModal]);

  const handleCloseRestoreModal = () => {
    setShowRestoreModal(false);
  };

  const handleAcceptRestoration = () => {
    setShowRestoreModal(false);
    console.log("✅ User accepted restoration");
  };

  const handleDeclineRestoration = () => {
    setShowRestoreModal(false);
    // Clear the restored data if user declines
    setRestoredFormData(null);
    // Also clear from store
    setStoreAnswer({});
    console.log("❌ User declined restoration - cleared restored data");
  };

  // Conditional renders
  if (!isAuthenticated) {
    return (
      <div className="evaluation-form">
        <ToastContainer />
        <AuthComponent />
      </div>
    );
  }

  if (showWelcome) {
    return <WelcomeScreenComponent />;
  }

  if (result) {
    console.log("✅ Showing ResultsPage");
    return (
      <div className="evaluation-form">
        <ToastContainer />
        <ResultsPage />
      </div>
    );
  }

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

  const flattenAnswers = (
    nested: Record<string, any>,
    parentKey = ""
  ): Record<string, any> => {
    return Object.entries(nested).reduce((acc, [key, value]) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (value && typeof value === "object" && !Array.isArray(value)) {
        Object.assign(acc, flattenAnswers(value, newKey));
      } else {
        acc[newKey] = value;
      }
      return acc;
    }, {} as Record<string, any>);
  };

  const handleNextSection = () => {
    const currentKey = sectionKeys[currentSectionIndex];
    const sectionAnswers = Object.entries(answers).filter(([q]) =>
      q.startsWith(currentKey)
    );

    const hasAnswer = sectionAnswers.some(
      ([, value]) => value !== "" && value !== null && value !== false
    );

    if (!hasAnswer) {
      notifySectionWarning(currentKey);
      return;
    }

    nextSection();
  };

  const handlePrevSection = () => {
    setError(null);
    prevSection();
  };

  const handleSubmitAnswers = async (submissionData: any) => {
    console.log("🚀 Submit button clicked - starting evaluation");

    const { answers, programScores, recommendedProgram } = submissionData;
    setLoading(true);
    setError(null);

    try {
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
        - Name: ${authUser?.fullName || name}
        - Email: ${authUser?.email || "Not provided"}
        - Preferred Course Interest: ${
          authUser?.preferredCourse || "Not specified"
        }

        PROGRAM COMPATIBILITY SCORES (based on answers):
        - Computer Science (BSCS): ${programScores?.BSCS || 0}
        - Information Technology (BSIT): ${programScores?.BSIT || 0}
        - Information Systems (BSIS): ${programScores?.BSIS || 0} 
        - Electrical Engineering (EE): ${programScores?.EE || 0}

        STUDENT ANSWERS:
        ${formatted}

        For your response, provide:

        1) A detailed evaluation summary that considers BOTH the quantitative scores AND qualitative answers.
        2) A recommended course (choose from BSIT, BSCS, BSIS, or EE).
        3) A clear, friendly explanation of why this recommendation is best for them.
        4) A confidence percentage breakdown for each course that aligns with the provided scores.

        IMPORTANT: Consider their preferred course interest (${
          authUser?.preferredCourse || "Not specified"
        }) but make an objective recommendation based on their actual answers and scores.

        Respond ONLY with valid JSON in this format:
        {
          "summary": <a short summary of the 'result' and 'recommendation'>
          "result": "<detailed evaluation comparing all programs based on scores and answers>",
          "recommendation": "<why the recommended program fits best considering both scores and answers>",
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
      console.log("📨 Raw AI response:", raw);

      let cleanedResponse;
      try {
        cleanedResponse = raw.replace(/```json|```/g, "").trim();
        const parsed: EvaluationResult = JSON.parse(cleanedResponse);
        console.log("✅ Parsed AI response:", parsed);

        const userData = {
          _id: authUser?.id || "temp-id",
          name: authUser?.fullName || name,
          email: authUser?.email || "",
          preferredCourse: authUser?.preferredCourse || "Undecided",
        };

        const transformed: AssessmentResult = {
          success: true,
          summary: parsed.summary,
          evaluation: parsed.result,
          recommendations: parsed.recommendation,
          recommendedProgram: parsed.recommendedCourse as ProgramType,
          user: userData,
          percent: parsed.percent,
          programScores: programScores,
          submissionDate: new Date().toISOString(),
        };
        console.log(parsed.summary);
        console.log("💾 Setting result in store:", transformed);
        setResult(transformed);

        // Clear saved data after successful submission
        if (authUser?.id) {
          localStorage.removeItem(`evaluation-answers_${authUser.id}`);
        }
        localStorage.removeItem("evaluation-answers_session");

        // Enhanced backend save with better error handling
        try {
          const saveResponse = await axios.post(
            `${BASE_URL}/api/save-evaluation`,
            {
              userId: authUser?.id,
              userName: authUser?.fullName || name,
              userEmail: authUser?.email || "",
              evaluation: parsed.result,
              recommendations: parsed.recommendation,
              recommendedCourse: parsed.recommendedCourse,
              percent: parsed.percent,
              programScores: programScores,
            }
          );

          if (saveResponse.data.success) {
            console.log(
              "💾 Successfully saved evaluation to backend:",
              saveResponse.data.evaluationId
            );
          } else {
            console.warn(
              "⚠️ Backend save reported failure:",
              saveResponse.data.message
            );
          }
        } catch (saveError: any) {
          console.warn(
            "⚠️ Failed to save evaluation to backend, but continuing:",
            saveError.message
          );
          // Don't throw here - let the user see their results even if save fails
        }
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        throw new Error("Failed to parse AI response. Please try again.");
      }
    } catch (err: any) {
      console.error("❌ Evaluation error:", err);
      setError(
        `Failed to generate evaluation: ${err.message || "Please try again."}`
      );
    } finally {
      setLoading(false);
      console.log("🏁 Evaluation process completed");
    }
  };

  if (loading) {
    console.log("⏳ Showing LoadingSpinner");
    return (
      <div className="evaluation-form">
        <ToastContainer />
        <LoadingSpinner />
      </div>
    );
  }

  console.log("📝 Showing AssessmentForm");
  return (
    <div className="evaluation-form">
      {/* Status Indicator  */}
      {isSaving && (
        <div
          style={{
            position: "fixed",
            top: 10,
            right: 10,
            zIndex: 1000,
            background: "white",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              padding: "5px 10px",
              borderRadius: "4px",
              fontSize: "12px",
              backgroundColor: "#ffd700", // Yellow for saving
              color: "#000",
            }}
          >
            Saving...
          </div>
        </div>
      )}

      {/* One-Time Restore Confirmation Modal */}
      <div className="restore-modal-container">
        <div
          className={`modal fade ${showRestoreModal ? "show" : ""}`}
          style={{
            display: showRestoreModal ? "block" : "none",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title w-100 text-center">
                  <span className="me-2">✅</span>
                  Continue Your Progress?
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseRestoreModal}
                ></button>
              </div>
              <div className="modal-body text-center py-4">
                <p className="fs-5 mb-3">
                  We found your previous assessment progress!
                </p>
                <p className="text-muted">
                  You have unanswered questions from your last session. Would
                  you like to continue where you left off?
                </p>
                <div className="mt-4">
                  <span className="badge bg-info fs-6">
                    {Object.keys(savedData || {}).length} answers saved
                  </span>
                </div>
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleDeclineRestoration}
                >
                  Start New
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleAcceptRestoration}
                >
                  Continue Progress
                </button>
              </div>
            </div>
          </div>
        </div>
        {showRestoreModal && <div className="modal-backdrop fade show"></div>}
      </div>

      <AssessmentForm
        currentUser={{
          _id: authUser?.id || "temp-id",
          name: authUser?.fullName || name,
          email: authUser?.email || "",
          preferredCourse: authUser?.preferredCourse || "Undecided",
        }}
        setCurrentUser={setCurrentUser}
        onSubmit={handleSubmitAnswers}
        onNextSection={handleNextSection}
        onPrevSection={handlePrevSection}
        currentSectionIndex={currentSectionIndex}
        totalSections={sectionKeys.length}
        loading={loading}
        restoredFormData={restoredFormData} 
      />

      
    </div>
  );
};

export default EvaluationForm;
