import { useState } from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import WelcomeScreenComponent from "./components/WelcomeScreen";
import ArrayBasedQuestion from "./components/Questions/ArrayBasedQuestion";
import type { EvaluationResult } from "./config/types";
import { BASE_URL, questions, categoryTitles } from "./config/constants";
import { useEvaluationStore } from "../store/useEvaluationStore";
import ObjectBasedQuestion from "./components/Questions/ObjectBasedQuestion";

const genAI = new GoogleGenerativeAI("AIzaSyAnzBdIYWGwBR4p7V1_tTrHQkUZDiYFXZw");

const EvaluationForm = () => {
  const {
    name,
    setName,
    answers,
    setAnswers,
    result,
    setResult,
    loading,
    setLoading,
    error,
    setError,
    updateAnswer,
  } = useEvaluationStore();

  // Organized questions with proper typing

  const formatAnswers = (obj: Record<string, boolean | number | string>) => {
    return Object.entries(obj)
      .map(([question, value]) => {
        if (typeof value === "boolean") {
          return value ? `- ${question}` : null;
        } else if (typeof value === "number") {
          return `- ${question}: ${value}/5`;
        } else {
          return `- ${question}: ${value}`;
        }
      })
      .filter(Boolean)
      .join("\n");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
You are a career/course evaluation assistant for the Computer Communication Development Institute of Sorsogon. 
Evaluate the following student's preferences and provide:
1) A brief summary of their strengths and interests,
2) A recommended course (choose from BSIT, BSCS, BSIS, or Technology Engineering Electrical), and
3) A clear, friendly explanation for your recommendation.

Consider their skills, academic performance, and career aspirations in your evaluation.

STUDENT NAME: ${name}

QUESTIONS AND ANSWERS:
${formatAnswers(answers)}

Respond ONLY with valid JSON in this format:
{
  "result": "<summary>",
  "recommendation": "<short paragraph including the recommended course>",
  "recommendedCourse": "<just the course name>",
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
      const cleaned = raw.replace(/```json\s*([\s\S]*?)```/, "$1").trim();
      const parsed: EvaluationResult = JSON.parse(cleaned);

      setResult(parsed);

      if (aiResponse) {
      }
      await axios.post(`${BASE_URL}}/api/save-evaluation`, {
        name,
        ...parsed,
      });
    } catch (err) {
      console.error("Evaluation error:", err);
      setError("Failed to generate evaluation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="evaluation-form">
      <h2>Course Evaluation Form</h2>
      <WelcomeScreenComponent />
      <form onSubmit={handleSubmit}>
        {Object.entries(questions).map(([section, sectionQuestions]) => (
          <div key={section} className="question-section">
            <h3>{categoryTitles[section] || section}</h3>
            <p>
              {section === "careerInterest"
                ? "Rate your interest (1 = Strongly Not Interested → 5 = Very Interested):"
                : section === "learningStyle"
                ? "Select one option for each question:"
                : "Check all that apply to you:"}
            </p>

            <div className="question-list pointer-label">
              {Array.isArray(sectionQuestions) ? (
                <ArrayBasedQuestion
                  data={sectionQuestions}
                  section={section}
                  answers={answers}
                  setAnswers={setAnswers}
                />
              ) : (
                <ObjectBasedQuestion
                  sectionQuestions={
                    sectionQuestions as Record<string, string[]>
                  }
                />
              )}
            </div>
          </div>
        ))}

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Get Recommendation"}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>

      {result && (
        <div className="result-container">
          <h3>Evaluation Result</h3>

          <div className="result-section">
            <h4>Summary:</h4>
            <p>{result.result}</p>
          </div>

          <div className="result-section">
            <h4>Recommendation:</h4>
            <p>{result.recommendation}</p>
          </div>

          <div className="result-section">
            <h4>Recommended Course:</h4>
            <p className="highlight">{result.recommendedCourse}</p>
          </div>

          <div className="result-section">
            <h4>Course Fit Percentages:</h4>
            <ul className="percentage-list">
              <li>BSIT: {result.percent.BSIT}%</li>
              <li>BSCS: {result.percent.BSCS}%</li>
              <li>BSIS: {result.percent.BSIS}%</li>
              <li>
                Technology Engineering Electrical: {result.percent.teElectrical}
                %
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationForm;
