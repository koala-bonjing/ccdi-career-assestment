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
      section === "careerInterest" ||
      section === "learningWorkStyle" // Added learningStyle to the validation
    ) {
      const firstUnansweredIndex = currentQuestions.findIndex(
        (q: Question) => {
          const answer = answers[q.questionText];
          
          // All three sections now use number answers (1-5 Likert scale)
          if (
            section === "academicAptitude" || 
            section === "careerInterest" ||
            section === "learningWorkStyle"
          ) {
            return !isNumberAnswer(answer);
          }
          
          return true;
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

    return { isValid: true };
  }, [formData, section, currentQuestions, categoryTitles]);

  const validateSectionWithToast = useCallback((): boolean => {
    const result = validateSection();
    
    if (!result.isValid && result.message) {
      const isTechnicalSkillError = result.message.includes('Technical Skill');
      
      toast.warning(result.message, {
        position: "top-right",
        autoClose: 3000,
        style: {
          backgroundColor: isTechnicalSkillError 
            ? "rgba(255, 140, 0, 0.35)"
            : "rgba(33, 150, 243, 0.3)",
          color: "#fff",
          border: isTechnicalSkillError
            ? "2px solid rgba(255, 120, 0, 0.7)"
            : "2px solid #2196F3",
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
  }, [validateSection, setCurrentQuestionIndex]);

  return {
    validateSection: validateSectionWithToast,
    validateSectionDetailed: validateSection
  };
};