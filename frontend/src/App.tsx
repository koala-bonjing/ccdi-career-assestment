import { GoogleGenerativeAI } from "@google/generative-ai";
import type { EvaluationResult } from "./types";
import { BASE_URL } from "./config/constants";
import { useEvaluationStore } from "../store/useEvaluationStore";
import { useWelcomeScreen } from "../store/useWelcomeScreenStore";
import { notifySectionWarning } from "./utils/toastService";
import { useUserStore } from "../store/useUserStore";
import { ToastContainer } from "react-toastify";
import AssessmentForm from "./components/AssestmentForm/AssestmentForm";
import ResultsPage from "./components/ResultPage";
import WelcomeScreenComponent from "./components/WelcomeScreen/WelcomePage";
import type { AssessmentResult, ProgramType } from "./types";
import LoadingSpinner from "./components/LoadingSpinner";
import axios from "axios";

const genAI = new GoogleGenerativeAI("AIzaSyAnzBdIYWGwBR4p7V1_tTrHQkUZDiYFXZw");

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
  } = useEvaluationStore();

  const { currentUser } = useUserStore.getState();

  // Debug logs to see what's happening
  console.log("🔍 Current state - showWelcome:", showWelcome);
  console.log("🔍 Current state - result:", result);
  console.log("🔍 Current state - loading:", loading);

  if (showWelcome) {
    return <WelcomeScreenComponent />;
  }

  // If we have results, show ResultsPage
  if (result) {
    console.log("✅ Showing ResultsPage");
    return (
      <div className="evaluation-form">
        <ToastContainer />
        <ResultsPage />
      </div>
    );
  }

  const currentSectionKey = sectionKeys[currentSectionIndex];

  // Transform the answers format for AI processing
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

  // Flatten nested answers
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

  const handleSubmitAnswers = async (answers: Record<string, any>) => {
    console.log("🚀 Submit button clicked - starting evaluation");
    console.log("📊 Received answers:", answers);

    setLoading(true);
    setError(null);

    try {
      // Flatten the answers structure
      const flatAnswers = flattenAnswers(answers);
      console.log("📊 Flattened answers:", flatAnswers);

      const formatted = formatAnswers(flatAnswers);
      console.log("📝 Formatted answers:", formatted);

      if (!formatted || formatted.trim() === "") {
        throw new Error("No answers available to evaluate.");
      }

      // Use a working model
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
You are a career/course evaluation assistant. 
Evaluate the following student's preferences carefully.

For your response, provide:

1) A detailed evaluation summary that explains HOW the student's answers influenced your reasoning (e.g., "Because you preferred X, this indicates strong Y skills, which aligns with Z course"). 
2) A recommended course (choose from BSIT, BSCS, BSIS, or Technology Engineering Electrical).
3) A clear, friendly explanation of why this recommendation is best for them, showing the decision-making process.
4) A confidence percentage breakdown for each course.

STUDENT NAME: ${name}

QUESTIONS AND ANSWERS:
${formatted}

Respond ONLY with valid JSON in this format:
{
  "result": "<detailed evaluation with reasoning>",
  "recommendation": "<final explanation in friendly tone>",
  "recommendedCourse": "<course>",
  "percent": {
    "BSIT": <0-100>,
    "BSCS": <0-100>,
    "BSIS": <0-100>,
    "teElectrical": <0-100>
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

        // Create user data
        const userData = currentUser
          ? currentUser
          : {
              name,
              _id: "temp-id",
              email: "",
            };

        // Transform to AssessmentResult
        const transformed: AssessmentResult = {
          success: true,
          evaluation: parsed.result,
          recommendations: parsed.recommendation,
          recommendedProgram: parsed.recommendedCourse as ProgramType,
          user: userData,
          percent: parsed.percent,
        };

        console.log("💾 Setting result in store:", transformed);
        console.log("💾 Result keys:", Object.keys(transformed));
        console.log("💾 Recommended program:", transformed.recommendedProgram);

        // Set the result - this should trigger a re-render
        setResult(transformed);

        console.log("✅ setResult() called");

        // Verify it was set
        const storeCheck = useEvaluationStore.getState();
        console.log("🔍 Store result after setResult:", storeCheck.result);
        console.log("🔍 Store loading after setResult:", storeCheck.loading);

        // Optional: Save to backend
        try {
          await axios.post(`${BASE_URL}/api/save-evaluation`, {
            name,
            ...transformed,
          });
          console.log("💾 Saved to backend");
        } catch (saveError) {
          console.warn("Failed to save evaluation:", saveError);
        }
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError);
        console.error("❌ Cleaned response was:", cleanedResponse);
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

  // Show loading spinner while processing
  if (loading) {
    console.log("⏳ Showing LoadingSpinner");
    return (
      <div className="evaluation-form">
        <ToastContainer />
        <LoadingSpinner />
      </div>
    );
  }

  // Show assessment form if no results and not loading
  console.log("📝 Showing AssessmentForm");
  return (
    <div className="evaluation-form">
      <ToastContainer />
      <AssessmentForm
        currentUser={
          currentUser
            ? currentUser
            : {
                name,
                _id: "temp-id",
                email: "",
              }
        }
        setCurrentUser={() => {}}
        onSubmit={handleSubmitAnswers}
        onNextSection={handleNextSection}
        onPrevSection={handlePrevSection}
        currentSectionIndex={currentSectionIndex}
        totalSections={sectionKeys.length}
        loading={loading}
      />
    </div>
  );
};

export default EvaluationForm;
