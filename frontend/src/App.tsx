import { GoogleGenerativeAI } from "@google/generative-ai";
import type { EvaluationResult } from "./config/types";
import { BASE_URL, categoryTitles } from "./config/constants";
import { useEvaluationStore } from "../store/useEvaluationStore";
import { useWelcomeScreen } from "../store/useWelcomeScreenStore";
import { notifySectionWarning } from "./utils/toastService";
import {useUserStore} from "../store/useUserStore"
import { ToastContainer } from "react-toastify";
import AssessmentForm from "./components/AssestmentForm";
import ResultsPage from "./components/ResultPage";
import WelcomeScreenComponent from "./components/WelcomeScreen/index";
import type { AssessmentResult, ProgramType } from "./types";

import axios from "axios";
import { parse } from "dotenv";

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
    setAnswers, // Make sure this is available in your store
  } = useEvaluationStore();

  const { currentUser } = useUserStore.getState();

  if (showWelcome) {
    return <WelcomeScreenComponent />;
  }
  const currentSectionKey = sectionKeys[currentSectionIndex];

  // Transform the answers format for AI processing
  const formatAnswers = () => {
    return Object.entries(answers)
      .map(([question, value]) => {
        if (typeof value === "number") {
          return `- ${question}: ${value}/5`;
        }
        return `- ${question}: ${value}`;
      })
      .filter(Boolean)
      .join("\n");
  };

  const validateSection = (index: number) => {
    const sectionKey = sectionKeys[index];
    const sectionAnswers = Object.entries(answers)
      .filter(([q]) => q.startsWith(sectionKey))
      .map(([, value]) => value);

    if (sectionAnswers.length === 0) {
      notifySectionWarning(sectionKey);
      return false;
    }

    const hasAnyAnswer = sectionAnswers.some(
      (value) => value !== undefined && value !== "" && value !== false
    );

    if (!hasAnyAnswer) {
      notifySectionWarning(sectionKey);
      return false;
    }

    return true;
  };

  const handleNextSection = () => {
    const currentKey = sectionKeys[currentSectionIndex];

    // Check if section has at least one answered question
    const sectionAnswers = Object.entries(answers).filter(([q]) =>
      q.startsWith(currentKey)
    );

    const hasAnswer = sectionAnswers.some(
      ([, value]) => value !== "" && value !== null && value !== false
    );

    if (!hasAnswer) {
      notifySectionWarning(currentKey); // 🚀 show toast with section name + color
      return; // stop navigation
    }

    nextSection();
  };
  const handlePrevSection = () => {
    setError(null);
    prevSection();
  };

  const handleSubmitAnswers = async (answers: Record<string, any>) => {
    setLoading(true);
    setError(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
      You are a career/course evaluation assistant. 
      Evaluate the following student's preferences and provide:
      1) A brief summary of their strengths and interests,
      2) A recommended course (choose from BSIT, BSCS, BSIS, or Technology Engineering Electrical), and
      3) A clear, friendly explanation for your recommendation.

      STUDENT NAME: ${name}

      QUESTIONS AND ANSWERS:
      ${formatAnswers()}

      Respond ONLY with valid JSON in this format:
      {
        "result": "${name} <summary>",
        "recommendation": "<recommendation>",
        "recommendedCourse": "<course>",
        "percent": {
          "BSIT": <0-100>,
          "BSCS": <0-100>,
          "BSIS": <0-100>,
          "teElectrical": <0-100>
        }
      }
      `;

      const aiResponse = await model.generateContent(prompt);
      const raw = aiResponse.response.text();
      const parsed: EvaluationResult = JSON.parse(
        raw.replace(/```json|```/g, "")
      );

      // 🔄 Transform EvaluationResult → AssessmentResult
      const transformed: AssessmentResult = {
        success: true,
        evaluation: parsed.result,
        recommendations: parsed.recommendation,
        recommendedProgram: parsed.recommendedCourse as ProgramType,
        user: currentUser ??   { name, _id: "temp-id" },
        percent: parsed.percent,
      };

      setResult(transformed);
      await axios.post(`${BASE_URL}/api/save-evaluation`, { name, ...transformed });
    } catch (err) {
      console.error("Evaluation error:", err);
      setError("Failed to generate evaluation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="evaluation-form">
      <ToastContainer />
      {!result ? (
        <AssessmentForm
          currentUser={{ name, _id: "temp-id" }}
          setCurrentUser={() => {}}
          onSubmit={handleSubmitAnswers}
          onNextSection={handleNextSection}
          onPrevSection={handlePrevSection}
          currentSectionIndex={currentSectionIndex}
          totalSections={sectionKeys.length}
        />
      ) : (
        <ResultsPage result={result} currentUser={{ name, _id: "temp-id" }} />
      )}
    </div>
  );
};

export default EvaluationForm;
