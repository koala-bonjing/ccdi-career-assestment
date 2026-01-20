// src/components/AssessmentForm/AssessmentForm.tsx
import React, { useState, useEffect, useRef } from "react";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { useAssessmentQuestions } from "../../hooks/useAssessmentQuestions";
import { useAssessmentValidation } from "../../hooks/useAssessmentValidation";
import { sections, categoryTitles } from "../../config/constants";
import AcademicAptitudeSection from "./question-sections/academic-aptitude";
import TechnicalSkillsSection from "./question-sections/technical-skills";
import CareerInterestSection from "./question-sections/career-interests";
import LearningStyleSection from "./question-sections/learning-style";
import ReviewSection from "./review-section";
import {
  type AssessmentAnswers,
  type AssessmentQuestions,
  type User,
} from "../../types";
import { type ProgramScores } from "./types";
import { getRecommendedProgram as _getRecommendedProgram } from "./utils";
import { type SubmissionData } from "../EvaluationForm/EvaluationForm";
import { ToastContainer } from "react-toastify";
import "./AssessmentForm.css";
import { Info  } from "lucide-react";
import { AssessmentInstructionsModal } from "../ui/modals/instruction-modal";
import { PrerequisitesSection } from "./question-sections/prerequisites";

interface AssessmentFormProps {
  currentUser?: User;
  onSubmit?: (data: SubmissionData) => void;
  loading?: boolean;
  restoredFormData?: AssessmentAnswers;
  onStartNew?: () => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({
  currentUser,
  onSubmit,
  loading = false,
  restoredFormData,
  onStartNew,
}) => {
  const { updateAnswer, clearAllAnswers } = useEvaluationStore();
  const {
    questions,
    loading: questionsLoading,
    error,
  } = useAssessmentQuestions();

  const [showInstructions, setShowInstructions] = useState(false);
  const hasShownInstructionsRef = useRef(false);

  const [formData, setFormData] = useState<AssessmentAnswers>(() => {
    if (restoredFormData) return restoredFormData;
    try {
      const saved = localStorage.getItem("evaluation-answers");
      return saved
        ? JSON.parse(saved)
        : {
            academicAptitude: {},
            technicalSkills: {},
            careerInterest: {},
            learningWorkStyle: {},
          };
    } catch (e) {
      console.error("LS error", e);
      return {
        academicAptitude: {},
        technicalSkills: {},
        careerInterest: {},
        learningWorkStyle: {},
      };
    }
  });

  const [currentSection, setCurrentSection] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem("currentAssessmentSection") || "0");
    } catch {
      return 0;
    }
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [programScores, setProgramScores] = useState<ProgramScores>({
    BSCS: 0,
    BSIT: 0,
    BSIS: 0,
    "BSET-E": 0,
    "BSET-EL": 0,
  });

  useEffect(() => {
    localStorage.setItem("evaluation-answers", JSON.stringify(formData));
    localStorage.setItem("currentAssessmentSection", currentSection.toString());
  }, [formData, currentSection]);

  useEffect(() => {
    if (
      questions &&
      !hasShownInstructionsRef.current &&
      !loading &&
      currentSection === 0
    ) {
      const hasSeenBefore = localStorage.getItem(
        "hasSeenAssessmentInstructions",
      );
      if (!hasSeenBefore) {
        setShowInstructions(true);
        hasShownInstructionsRef.current = true;
      }
    }
  }, [questions, loading, currentSection]);

  const sectionKey = sections[currentSection];

  const handleChange = (
    sectionKey: keyof AssessmentAnswers,
    questionText: string,
    value: number | boolean | string,
    program?: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], [questionText]: value },
    }));
    updateAnswer(`${sectionKey}.${questionText}`, value);

    if (typeof value === "number" && value >= 1 && value <= 5 && program) {
      setProgramScores((prev) => {
        const newScores = { ...prev };
        newScores[program as keyof ProgramScores] += (value - 1) * 2;
        return newScores;
      });
    }
  };

  const navigateToSection = (index: number) => {
    setCurrentSection(index);
    setShowReview(false);
  };

  const { validateSection } = useAssessmentValidation({
    formData,
    section: sectionKey,
    currentQuestions:
      (questions as unknown as AssessmentQuestions)[sectionKey] || [],
    setCurrentQuestionIndex,
    categoryTitles,
  });

  const handleNext = (): void => {
    if (validateSection()) {
      if (currentSection < sections.length - 1) {
        setCurrentSection((p) => p + 1);
        setCurrentQuestionIndex(0);
      } else {
        setShowReview(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) setCurrentSection((p) => p - 1);
  };

  const handleSubmit = () => {
    if (onSubmit && validateSection()) {
      onSubmit({
        answers: formData,
        programScores,
        recommendedProgram: _getRecommendedProgram(programScores),
      });
    }
  };

  const handleStartNew = () => {
    setFormData({
      prerequisites: {},
      academicAptitude: {},
      technicalSkills: {},
      careerInterest: {},
      learningWorkStyle: {},
    });
    setCurrentSection(0);
    setShowReview(false);
    setProgramScores({ BSCS: 0, BSIT: 0, BSIS: 0, "BSET-E": 0, "BSET-EL": 0 });
    localStorage.removeItem("evaluation-answers");
    localStorage.removeItem("currentAssessmentSection");
    clearAllAnswers();
    onStartNew?.();
  };

  if (questionsLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!questions) return <div>No questions loaded</div>;

  return (
    <div className="assessment-container">
      {showReview ? (
        <ReviewSection
          formData={formData}
          questions={questions}
          programScores={programScores}
          onEditSection={navigateToSection}
          onSubmit={handleSubmit}
          loading={loading}
          currentUser={currentUser}
        />
      ) : (
        <>
          <AssessmentInstructionsModal
            onHide={() => setShowInstructions(false)}
            show={showInstructions}
          />
          {currentSection === 0 && (
            <PrerequisitesSection
              currentQuestionIndex={currentQuestionIndex}
              currentSection={currentSection}
              formData={formData}
              onChange={handleChange}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onReset={handleStartNew}
              questions={questions.prerequisites}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
              totalSections={sections.length}
            />
          )}
          {currentSection === 1 && (
            <AcademicAptitudeSection
              questions={questions.academicAptitude}
              formData={formData}
              onChange={handleChange}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onReset={handleStartNew}
              currentSection={currentSection}
              totalSections={sections.length}
              currentQuestionIndex={currentQuestionIndex}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
            />
          )}
          {currentSection === 2 && (
            <TechnicalSkillsSection
              questions={questions.technicalSkills}
              formData={formData}
              onChange={handleChange}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onReset={handleStartNew}
              currentSection={currentSection}
              totalSections={sections.length}
            />
          )}
          {currentSection === 3 && (
            <CareerInterestSection
              questions={questions.careerInterest}
              formData={formData}
              onChange={handleChange}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onReset={handleStartNew}
              currentSection={currentSection}
              totalSections={sections.length}
              currentQuestionIndex={currentQuestionIndex}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
            />
          )}
          {currentSection === 4 && (
            <LearningStyleSection
              questions={questions.learningWorkStyle}
              formData={formData}
              onChange={handleChange}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onReset={handleStartNew}
              currentSection={currentSection}
              totalSections={sections.length}
              currentQuestionIndex={currentQuestionIndex}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
            />
          )}
        </>
      )}
      {/* Fixed instruction button in lower-right */}
      {/* Fixed instruction button */}
      <div className="assessment-instruction-fab">
        <button
          type="button"
          className="btn instruction-btn"
          onClick={() => setShowInstructions(true)}
          aria-label="Show assessment instructions"
        >
          <Info size={30} strokeWidth={2.5} color="white" />
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AssessmentForm;
