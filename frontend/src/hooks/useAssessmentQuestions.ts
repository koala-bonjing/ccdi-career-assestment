// hooks/useAssessmentQuestions.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config/constants";
export interface Question {
  id: string;
  _id: string;
  questionText: string;
  program: string;
  weight?: number;
  correctAnswer: string;
  options?: string[];
  category?: string; // Add this
  subCategory?: string; // ADD THIS LINE - This is what's missing!
  order?: number;
  isActive?: boolean;
  helperText?: string;
}

export interface BackendQuestions {
  foundationalAssessment: Question[];
  academicAptitude: Question[];
  technicalSkills: Question[];
  careerInterest: Question[];
  learningWorkStyle: Question[];
}

interface ApiQuestion {
  _id: string;
  questionText: string;
  program: string;
  correctAnswer: string;
  weight: number;
  options?: string[];
  category?: string;
  subCategory?: string;
  order?: number;
  isActive?: boolean;
  helperText?: string;
}

interface ApiResponse {
  foundationalAssessment?: Question[];
  academicAptitude?: Question[];
  technicalSkills?: Question[];
  careerInterest?: Question[];
  learningWorkStyle?: Question[];
}

export const useAssessmentQuestions = () => {
  const [questions, setQuestions] = useState<BackendQuestions | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async (): Promise<void> => {
      try {
        console.log("🔄 Fetching questions from API...");
        const response = await axios.get<ApiResponse | ApiQuestion[]>(
          `${BASE_URL}/api/questions`,
        );

        // Add debug logging
        console.log("📥 Raw API response:", response.data);

        // Check if response is already grouped by category
        const responseData = response.data;
        const hasGroupedStructure =
          "foundationalAssessment" in responseData ||
          "academicAptitude" in responseData ||
          "technicalSkills" in responseData ||
          "careerInterest" in responseData ||
          "learningWorkStyle" in responseData;

        if (
          hasGroupedStructure &&
          typeof responseData === "object" &&
          !Array.isArray(responseData)
        ) {
          // It's already in the grouped format
          const groupedData = responseData as ApiResponse;

          const normalizeQuestion = (q: Question): Question => {
            const id = q._id || q.id || q.questionText;
            return {
              ...q,
              _id: String(id), // Ensure it's a string for the backend key
              id: String(id),
            };
          };
          // Debug: Check what fields are in learningWorkStyle questions
          if (
            groupedData.learningWorkStyle &&
            groupedData.learningWorkStyle.length > 0
          ) {
            console.log(
              "🔍 First learningWorkStyle question from grouped data:",
              {
                text: groupedData.learningWorkStyle[0].questionText?.substring(
                  0,
                  50,
                ),
                hasSubCategory:
                  "subCategory" in groupedData.learningWorkStyle[0],
                subCategory: groupedData.learningWorkStyle[0].subCategory,
                allKeys: Object.keys(groupedData.learningWorkStyle[0]),
              },
            );
          }

          const normalizeGroup = (qList: Question[] = []) =>
            qList.map(normalizeQuestion);

          setQuestions({
            foundationalAssessment: normalizeGroup(
              groupedData.foundationalAssessment,
            ),
            academicAptitude: normalizeGroup(groupedData.academicAptitude),
            technicalSkills: normalizeGroup(groupedData.technicalSkills),
            careerInterest: normalizeGroup(groupedData.careerInterest),
            learningWorkStyle: normalizeGroup(groupedData.learningWorkStyle),
          });
        } else if (Array.isArray(responseData)) {
          // Transform flat array to grouped structure
          const transformedQuestions: BackendQuestions = {
            foundationalAssessment: [],
            academicAptitude: [],
            technicalSkills: [],
            careerInterest: [],
            learningWorkStyle: [],
          };

          responseData.forEach((question: ApiQuestion) => {
            const questionData: Question = {
              id: question._id,
              _id: question._id,
              correctAnswer: question.correctAnswer,
              questionText: question.questionText,
              program: question.program,
              weight: question.weight,
              options: question.options || undefined,
              category: question.category, // Include category
              subCategory: question.subCategory, // ADD THIS - THIS IS THE FIX
              order: question.order,
              isActive: question.isActive,
              helperText: question.helperText,
            };

            switch (question.category) {
              case "foundationalAssessment":
                transformedQuestions.foundationalAssessment.push(questionData);
                break;
              case "academicAptitude":
                transformedQuestions.academicAptitude.push(questionData);
                break;
              case "technicalSkills":
                transformedQuestions.technicalSkills.push(questionData);
                break;
              case "careerInterest":
                transformedQuestions.careerInterest.push(questionData);
                break;
              case "learningWorkStyle":
                transformedQuestions.learningWorkStyle.push(questionData);
                break;
              default:
                console.warn(`Unknown category: ${question.category}`);
            }
          });

          // Debug: Check final structure
          console.log("📊 Final transformed questions:", {
            learningWorkStyleCount:
              transformedQuestions.learningWorkStyle.length,
            firstQuestion: transformedQuestions.learningWorkStyle[0],
          });

          setQuestions(transformedQuestions);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err: unknown) {
        console.error("❌ Failed to load questions:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load questions";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return { questions, loading, error };
};
