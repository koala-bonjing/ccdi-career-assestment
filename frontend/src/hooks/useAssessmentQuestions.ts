// hooks/useAssessmentQuestions.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config/constants";

export interface Question {
  _id: string;
  questionText: string;
  program: string;
  weight: number;
  options?: string[];
}

export interface BackendQuestions {
  academicAptitude: Question[];
  technicalSkills: Question[];
  careerInterest: Question[];
  learningStyle: Question[];
}

interface ApiQuestion {
  _id: string;
  questionText: string;
  program: string;
  weight: number;
  options?: string[];
  category?: string;
}

interface ApiResponse {
  academicAptitude?: Question[];
  technicalSkills?: Question[];
  careerInterest?: Question[];
  learningStyle?: Question[];
}

export const useAssessmentQuestions = () => {
  const [questions, setQuestions] = useState<BackendQuestions | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async (): Promise<void> => {
      try {
        console.log("Fetching questions from API...");
        const response = await axios.get<ApiResponse | ApiQuestion[]>(`${BASE_URL}/api/questions`);

        // Check if response is already grouped by category
        const responseData = response.data;
        const hasGroupedStructure = 
          'academicAptitude' in responseData ||
          'technicalSkills' in responseData ||
          'careerInterest' in responseData ||
          'learningStyle' in responseData;

        if (hasGroupedStructure && typeof responseData === 'object' && !Array.isArray(responseData)) {
          // It's already in the grouped format
          const groupedData = responseData as ApiResponse;
          setQuestions({
            academicAptitude: groupedData.academicAptitude || [],
            technicalSkills: groupedData.technicalSkills || [],
            careerInterest: groupedData.careerInterest || [],
            learningStyle: groupedData.learningStyle || [],
          });
        } else if (Array.isArray(responseData)) {
          // Transform flat array to grouped structure
          const transformedQuestions: BackendQuestions = {
            academicAptitude: [],
            technicalSkills: [],
            careerInterest: [],
            learningStyle: [],
          };

          responseData.forEach((question: ApiQuestion) => {
            const questionData: Question = {
              _id: question._id,
              questionText: question.questionText,
              program: question.program,
              weight: question.weight,
              options: question.options || undefined,
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

          setQuestions(transformedQuestions);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err: unknown) {
        console.error("Failed to load questions:", err);
        const errorMessage = err instanceof Error 
          ? err.message 
          : "Failed to load questions";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return { questions, loading, error };
};