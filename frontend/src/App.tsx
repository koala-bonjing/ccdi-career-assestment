import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import WelcomeScreenComponent from "./components/WelcomeScreen";
import { useEvaluationStore } from "../store/useEvaluationStore";
import { useWelcomeScreen } from "../store/useWelcomeScreenStore";
import AssessmentForm from "./components/AssestmentForm";
import { useUserStore } from "../store/useUserStore";
import type { Evaluation } from "../src/types";
import { BASE_URL } from "./config/constants";

// Initialize Gemini AI (move API key to environment variables in production)
const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY || "your-api-key"
);

const EvaluationForm = () => {
  const navigate = useNavigate();
  const { showWelcome } = useWelcomeScreen();
  const { currentUser, setCurrentUser } = useUserStore();
  const {
    name,
    answers,
    result,
    setResult,
    loading,
    setLoading,
    error,
    setError,
  } = useEvaluationStore();

  const formatAnswers = (
    answers: Record<string, boolean | number | string>
  ): string => {
    return Object.entries(answers)
      .map(([question, value]) => {
        if (typeof value === "boolean") {
          return value ? `- ${question}` : null;
        } else if (typeof value === "number") {
          return `- ${question}: ${value}/5`;
        }
        return `- ${question}: ${value}`;
      })
      .filter(Boolean)
      .join("\n");
  };

  const generateEvaluation = async (): Promise<Evaluation> => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
You are a career/course evaluation assistant. Evaluate the following student's preferences and provide:
1) A summary of strengths/interests
2) Recommended course (BSIT, BSCS, BSIS, or Technology Engineering Electrical)
3) Explanation for recommendation

STUDENT NAME: ${name}

QUESTIONS AND ANSWERS:
${formatAnswers(answers)}

Respond ONLY with valid JSON in this format:
{
  "result": "<summary>",
  "recommendation": "<explanation>",
  "recommendedProgram": "<course>",
  "percent": {
    "BSIT": <0-100>,
    "BSCS": <0-100>,
    "BSIS": <0-100>,
    "teElectrical": <0-100>
  }
}
`;

    try {
      const aiResponse = await model.generateContent(prompt);
      const raw = aiResponse.response.text();
      const cleaned = raw.replace(/```json\s*([\s\S]*?)```/, "$1").trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("AI generation error:", err);
      throw new Error("Failed to generate evaluation");
    }
  };

  const handleSubmitEvaluation = async (answers: Record<string, any>) => {
    setLoading(true);
    setError(null);

    try {
      // Generate AI evaluation
      const aiEvaluation = await generateEvaluation();

      // Save to backend
      await axios.post(`${BASE_URL}/api/save-evaluation`, {
        userId: currentUser?._id,
        name,
        ...aiEvaluation,
        answers,
      });

      // Set results and navigate
      setResult({
        ...aiEvaluation,
        date: new Date(),
        answers,
      });
      navigate("/results");
    } catch (err) {
      console.error("Evaluation error:", err);
      setError(err instanceof Error ? err.message : "Evaluation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="evaluation-form">
      {showWelcome ? (
        <WelcomeScreenComponent />
      ) : (
        <AssessmentForm
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          setEvaluationResult={(result) => {
            setResult(result); // from store
            navigate("/results");
          }}
        />
      )}
    </div>
  );
};

export default EvaluationForm;
