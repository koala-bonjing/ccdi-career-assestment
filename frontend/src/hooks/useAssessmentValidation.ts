// src/hooks/useAssessmentValidation.ts
import { useCallback } from "react";
import { toast, Bounce } from "react-toastify";
import type { AssessmentAnswers, Question, SectionAnswers } from "../types";

interface UseAssessmentValidationProps {
  formData: AssessmentAnswers;
  section: string;
  currentQuestions: Question[];
  setCurrentQuestionIndex: (index: number) => void;
  categoryTitles: { [key: string]: string };
}

interface ValidationResult {
  isValid: boolean;
  message?: string;
  firstUnansweredIndex?: number;
}

// Type guards for different answer types
const isNumberAnswer = (value: unknown): value is number => {
  return typeof value === "number" && value >= 1 && value <= 5;
};

const isBooleanAnswer = (value: unknown): value is boolean => {
  return typeof value === "boolean";
};

const isStringAnswer = (value: unknown): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};

// Helper function to get answer from answers object
const getAnswerValue = (
  answers: SectionAnswers | undefined,
  question: Question,
): unknown => {
  if (!answers || typeof answers !== "object") {
    return undefined;
  }

  // Try multiple possible keys to find the answer
  const possibleKeys = [
    question._id,
    question.questionText,
    question.questionText?.trim(),
  ].filter((key): key is string => typeof key === "string" && key.length > 0);

  for (const key of possibleKeys) {
    if (key in answers) {
      return answers[key];
    }
  }

  return undefined;
};

export const useAssessmentValidation = ({
  formData,
  section,
  currentQuestions,
  setCurrentQuestionIndex,
  categoryTitles,
}: UseAssessmentValidationProps) => {
  const validateSection = useCallback((): ValidationResult => {
    const answers = formData[section as keyof AssessmentAnswers];

    // If no answers object exists for this section
    if (!answers || typeof answers !== "object") {
      return {
        isValid: false,
        message: `Please answer all ${categoryTitles[section] || section} questions.`,
        firstUnansweredIndex: 0,
      };
    }

    // COMMON VALIDATION FOR ALL SECTIONS (except technicalSkills which has different rules)
    if (section !== "technicalSkills" && section !== "learningWorkStyle") {
      const firstUnansweredIndex = currentQuestions.findIndex((q: Question) => {
        const answer = getAnswerValue(answers, q);

        // Check if answer is undefined/null/empty string
        if (answer === undefined || answer === null || answer === "") {
          return true;
        }

        // Additional type-specific validation based on section
        if (section === "academicAptitude" || section === "careerInterest") {
          return !isNumberAnswer(answer);
        }

        if (section === "learningWorkStyle") {
          return !isBooleanAnswer(answer);
        }

        if (section === "foundationalAssessment") {
          return !isStringAnswer(answer);
        }

        // For prerequisites and other sections, just check if it exists
        return false;
      });

      if (firstUnansweredIndex !== -1) {
        const categoryName = categoryTitles[section] || section;

        let specificMessage = "";

        // Provide more specific guidance based on section
        if (section === "academicAptitude" || section === "careerInterest") {
          specificMessage = `Please rate question ${firstUnansweredIndex + 1} on a scale of 1-5`;
        } else if (section === "learningWorkStyle") {
          specificMessage = `Please select Yes or No for question ${firstUnansweredIndex + 1}`;
        } else if (section === "foundationalAssessment") {
          specificMessage = `Please select an option for question ${firstUnansweredIndex + 1}`;
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          specificMessage = `Please answer question ${firstUnansweredIndex + 1}`;
        }

        return {
          isValid: false,
          message: `Please answer all ${categoryName} questions.`,
          firstUnansweredIndex,
        };
      }
    }

    // SECTION-SPECIFIC ADDITIONAL VALIDATION

    if (section === "foundationalAssessment") {
      // Group questions by subCategory to check each category separately
      const questionsBySubCategory: Record<string, Question[]> = {};
      currentQuestions.forEach((question) => {
        const subCategory = question.subCategory || "prerequisites";
        if (!questionsBySubCategory[subCategory]) {
          questionsBySubCategory[subCategory] = [];
        }
        questionsBySubCategory[subCategory].push(question);
      });

      // Check each category for completeness
      for (const [, questionsInCategory] of Object.entries(
        questionsBySubCategory,
      )) {
        const firstUnanswered = questionsInCategory.findIndex((q) => {
          const answer = getAnswerValue(answers, q);
          return !isStringAnswer(answer);
        });

        if (firstUnanswered !== -1) {
          const globalIndex = currentQuestions.findIndex(
            (q) => q._id === questionsInCategory[firstUnanswered]._id,
          );

          return {
            isValid: false,
            message: `Please complete all questions in the ${categoryTitles[section] || section} section.`,
            firstUnansweredIndex: globalIndex !== -1 ? globalIndex : 0,
          };
        }
      }
    }

    if (section === "technicalSkills") {
      // Get all boolean answers
      const booleanAnswers = currentQuestions
        .map((q) => getAnswerValue(answers, q))
        .filter((val): val is boolean => isBooleanAnswer(val));

      // Check if we have at least one true value
      const hasAtLeastOneTrue = booleanAnswers.some((val) => val === true);

      if (!hasAtLeastOneTrue) {
        return {
          isValid: false,
          message: "Please select at least one Technical Skill.",
        };
      }
    }

    if (section === "learningWorkStyle") {
      // Group questions by subCategory
      const questionsBySubCategory: Record<string, Question[]> = {};
      currentQuestions.forEach((question) => {
        const subCategory = question.subCategory || "Uncategorized";
        if (!questionsBySubCategory[subCategory]) {
          questionsBySubCategory[subCategory] = [];
        }
        questionsBySubCategory[subCategory].push(question);
      });

      // Define required categories (these should match your actual subCategory values)
      const requiredCategories = [
        "Learning Preferences",
        "Work Style Preferences",
        "Financial & Time Resources",
        "Career Goals & Logistics",
      ];

      // Check each required category has at least one "Yes" answer
      const incompleteCategories: string[] = [];

      for (const category of requiredCategories) {
        const questionsInCategory = questionsBySubCategory[category] || [];

        // Check if at least one answer is true in this category
        const hasTrueAnswer = questionsInCategory.some((q) => {
          const answer = getAnswerValue(answers, q);
          return isBooleanAnswer(answer) && answer === true;
        });

        if (!hasTrueAnswer && questionsInCategory.length > 0) {
          incompleteCategories.push(category);
        }
      }

      if (incompleteCategories.length > 0) {
        // Find the first question in the first incomplete category
        const firstIncompleteCategory = incompleteCategories[0];
        const questionsInCategory =
          questionsBySubCategory[firstIncompleteCategory] || [];
        const firstQuestionInCategory = questionsInCategory[0];
        const firstUnansweredIndex = firstQuestionInCategory
          ? currentQuestions.findIndex(
              (q) => q._id === firstQuestionInCategory._id,
            )
          : 0;

        // Create a user-friendly message
        let message = "Please select at least one option from each category. ";

        if (incompleteCategories.length > 2) {
          message += `${incompleteCategories.length} categories need at least one selection`;
        } else {
          const formattedCategories = incompleteCategories.map((cat) =>
            cat.replace(/ & /g, " and "),
          );
          message += `Please check: ${formattedCategories.join(", ")}`;
        }

        return {
          isValid: false,
          message,
          firstUnansweredIndex:
            firstUnansweredIndex !== -1 ? firstUnansweredIndex : 0,
        };
      }
    }

    return { isValid: true };
  }, [formData, section, currentQuestions, categoryTitles]);

  const validateSectionWithToast = useCallback((): boolean => {
    const result = validateSection();

    if (!result.isValid && result.message) {
      // Clean, professional toast styling without neon effects
      const toastStyle = {
        backgroundColor: "#ffffff",
        color: "#333333",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: "14px",
        fontWeight: "500",
        padding: "12px 16px",
      };

      toast.warning(result.message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: toastStyle,
        transition: Bounce,
      });

      if (result.firstUnansweredIndex !== undefined) {
        setCurrentQuestionIndex(result.firstUnansweredIndex);
      }
    }

    return result.isValid;
  }, [validateSection, setCurrentQuestionIndex]);

  return {
    validateSection: validateSectionWithToast,
    validateSectionDetailed: validateSection,
  };
};
