// src/hooks/useAssessmentValidation.ts
import { useCallback } from 'react';
import { toast, Bounce } from 'react-toastify';
import type { AssessmentAnswers, Question } from '../types';

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
  return typeof value === 'number' && value >= 1 && value <= 5;
};

const isBooleanAnswer = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

export const useAssessmentValidation = ({
  formData,
  section,
  currentQuestions,
  setCurrentQuestionIndex,
  categoryTitles
}: UseAssessmentValidationProps) => {
  const validateSection = useCallback((): ValidationResult => {
    const answers = formData[section as keyof AssessmentAnswers];

    if (
      section === "academicAptitude" ||
      section === "careerInterest"
    ) {
      const firstUnansweredIndex = currentQuestions.findIndex(
        (q: Question) => {
          const answer = answers[q.questionText];
          return !isNumberAnswer(answer);
        }
      );

      if (firstUnansweredIndex !== -1) {
        return {
          isValid: false,
          message: `Please answer all ${categoryTitles[section]} questions.`,
          firstUnansweredIndex
        };
      }
    }

    if (section === "technicalSkills") {
      const answerValues = Object.values(answers);
      const hasAtLeastOne = answerValues.some((val: unknown) => 
        isBooleanAnswer(val) && val === true
      );
      
      if (!hasAtLeastOne) {
        return {
          isValid: false,
          message: "Please select at least one Technical Skill."
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

      // Define required categories
      const requiredCategories = [
        "Learning Preferences",
        "Work Style Preferences",
        "Financial & Time Resources",
        "Career Goals & Logistics"
      ];

      // Check each required category
      const incompleteCategories: string[] = [];
      
      requiredCategories.forEach((category) => {
        const questionsInCategory = questionsBySubCategory[category] || [];
        const hasAnswerInCategory = questionsInCategory.some(
          (q) => answers[q.questionText] === true
        );
        
        if (!hasAnswerInCategory && questionsInCategory.length > 0) {
          incompleteCategories.push(category);
        }
      });

      if (incompleteCategories.length > 0) {
        // Find the first unanswered question in the first incomplete category
        const firstIncompleteCategory = incompleteCategories[0];
        const questionsInCategory = questionsBySubCategory[firstIncompleteCategory] || [];
        const firstQuestionInCategory = questionsInCategory[0];
        const firstUnansweredIndex = firstQuestionInCategory 
          ? currentQuestions.findIndex(q => q._id === firstQuestionInCategory._id)
          : -1;

        // Create a more detailed message
        let message = "Please select at least one option from each category: ";
        if (incompleteCategories.length > 2) {
          message += `Missing ${incompleteCategories.length} categories`;
        } else {
          message += incompleteCategories.join(", ");
        }

        return {
          isValid: false,
          message,
          firstUnansweredIndex: firstUnansweredIndex !== -1 ? firstUnansweredIndex : 0
        };
      }
    }

    return { isValid: true };
  }, [formData, section, currentQuestions, categoryTitles]);

  const validateSectionWithToast = useCallback((): boolean => {
    const result = validateSection();
    
    if (!result.isValid && result.message) {
      const isLearningWorkStyleError = section === "learningWorkStyle";
      const isTechnicalSkillError = section === "technicalSkills";
      
      // Determine toast style based on section
      let toastStyle = {};
      if (isLearningWorkStyleError) {
        toastStyle = {
          backgroundColor: "rgba(255, 193, 7, 0.35)", // Yellow/orange for learning style
          color: "#856404",
          border: "2px solid rgba(255, 193, 7, 0.7)",
        };
      } else if (isTechnicalSkillError) {
        toastStyle = {
          backgroundColor: "rgba(255, 140, 0, 0.35)", // Orange for technical skills
          color: "#fff",
          border: "2px solid rgba(255, 120, 0, 0.7)",
        };
      } else {
        toastStyle = {
          backgroundColor: "rgba(33, 150, 243, 0.3)", // Blue for other sections
          color: "#fff",
          border: "2px solid #2196F3",
        };
      }

      toast.warning(result.message, {
        position: "top-right",
        autoClose: 4000, // Longer timeout for learning style errors
        style: {
          ...toastStyle,
          borderRadius: "10px",
          fontWeight: "500",
          fontFamily: "Poppins",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        },
        transition: Bounce,
      });

      if (result.firstUnansweredIndex !== undefined) {
        setCurrentQuestionIndex(result.firstUnansweredIndex);
      }
    }

    return result.isValid;
  }, [validateSection, setCurrentQuestionIndex, section]);

  return {
    validateSection: validateSectionWithToast,
    validateSectionDetailed: validateSection
  };
};