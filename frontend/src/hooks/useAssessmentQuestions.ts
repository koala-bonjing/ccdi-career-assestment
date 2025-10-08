// hooks/useAssessmentQuestions.ts
import { useState, useEffect } from "react";
import axios from "axios";

export interface BackendQuestions {
  academicAptitude: Array<{
    _id: string;
    questionText: string;
    program: string;
    weight: number;
    options: string[];
  }>;
  technicalSkills: Array<{
    _id: string;
    questionText: string;
    program: string;
    weight: number;
    options: string[];
  }>;
  careerInterest: Array<{
    _id: string;
    questionText: string;
    program: string;
    weight: number;
    options: string[];
  }>;
  learningStyle: Array<{
    _id: string;
    questionText: string;
    program: string;
    weight: number;
    options: string[];
  }>;
}

export const useAssessmentQuestions = () => {
  const [questions, setQuestions] = useState<BackendQuestions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log("Fetching questions from API...");
        const response = await axios.get(
          "http://localhost:4000/api/questions" // Changed from /api/allQuestions to /api/questions
        );
        console.log("API Response:", response.data);

        // Check if response is already grouped by category (from your existing /api/questions endpoint)
        if (response.data.academicAptitude) {
          // If it's already in the grouped format, use it directly
          console.log("Questions already grouped by category:", response.data);
          setQuestions(response.data);
        } else {
          // If it's a flat array, transform it
          console.log("Transforming flat array to grouped structure...");
          const transformedQuestions: BackendQuestions = {
            academicAptitude: [],
            technicalSkills: [],
            careerInterest: [],
            learningStyle: [],
          };

          response.data.forEach((question: any) => {
            const questionData = {
              _id: question._id,
              questionText: question.questionText,
              program: question.program,
              weight: question.weight,
              options: question.options || [
                // Add default options if not provided
                "Strongly Disagree",
                "Disagree",
                "Neutral",
                "Agree",
                "Strongly Agree",
              ],
            };

            switch (question.category) {
              case "academicAptitude":
                transformedQuestions.academicAptitude.push(questionData);
                break;
              case "technicalSkills":
                transformedQuestions.technicalSkills.push(questionData);
                break;
              case "careerInterest":
                transformedQuestions.careerInterest.push(questionData);
                break;
              case "learningStyle":
                transformedQuestions.learningStyle.push(questionData);
                break;
              default:
                console.warn(`Unknown category: ${question.category}`);
            }
          });

          console.log("Transformed Questions:", transformedQuestions);
          setQuestions(transformedQuestions);
        }
      } catch (err: any) {
        console.error("Failed to load questions:", err);
        setError(err.message || "Failed to load questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return { questions, loading, error };
};
