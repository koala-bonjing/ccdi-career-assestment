import React, { useState, useEffect, useRef } from "react";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import {
  useAssessmentQuestions,
  type Question,
} from "../../hooks/useAssessmentQuestions";
import { useAssessmentValidation } from "../../hooks/useAssessmentValidation";
import { sections, categoryTitles } from "../../config/constants";
import AcademicAptitudeSection from "./question-sections/academic-aptitude";
import TechnicalSkillsSection from "./question-sections/technical-skills";
import CareerInterestSection from "./question-sections/career-interests";
import LearningStyleSection from "./question-sections/learning-style";
import ReviewSection from "./review-section";
import { type AssessmentAnswers, type User } from "../../types";
import { type ProgramScores } from "./types";
import { getRecommendedProgram as _getRecommendedProgram } from "./utils";
import { type SubmissionData } from "../EvaluationForm/EvaluationForm";
import { ToastContainer } from "react-toastify";
import "./AssessmentForm.css";
import { Info } from "lucide-react";
import { AssessmentInstructionsModal } from "../ui/modals/instruction-modal";
import FoundationalAssessmentSection from "./question-sections/foundational-assessment";
import { StorageEncryptor } from "../ResultPage/utils/encryption";

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

  // ✅ ALGORITHM PART 1: Safe State Initialization
  // This ensures that 'prerequisites' exists even if the user has old saved data.
  const [formData, setFormData] = useState<AssessmentAnswers>(() => {
    const baseStructure: AssessmentAnswers = {
      foundationalAssessment: {},
      academicAptitude: {},
      technicalSkills: {},
      careerInterest: {},
      learningWorkStyle: {},
    };

    if (restoredFormData) return { ...baseStructure, ...restoredFormData };

    try {
      const saved = StorageEncryptor.getItem("evaluation-answers");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merging ensures new keys (like foundationalAssessment) are never null
        return { ...baseStructure, ...parsed };
      }
    } catch (e) {
      console.error("LS error", e);
    }
    return baseStructure;
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

  // ✅ ALGORITHM PART 2: Scoring State
  const [programScores, setProgramScores] = useState<ProgramScores>({
    BSCS: 0,
    BSIT: 0,
    BSIS: 0,
    "BSET-E": 0,
    "BSET-EL": 0,
  });

  // Persist answers to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("evaluation-answers", JSON.stringify(formData));
    localStorage.setItem("currentAssessmentSection", currentSection.toString());
  }, [formData, currentSection]);

  // Show instructions on first load
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

  // ✅ ALGORITHM PART 3: The Mapping & Weighting Logic
  const handleChange = (
    sectionKey: keyof AssessmentAnswers,
    questionText: string,
    value: number | boolean | string,
    program?: string,
  ) => {
    // 1. Update UI State
    setFormData((prev) => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], [questionText]: value },
    }));

    // 2. Sync with Global Store
    updateAnswer(`${sectionKey}.${questionText}`, value);

    // 3. Weighting Algorithm: If it's a numeric Likert scale (1-5)
    if (typeof value === "number" && value >= 1 && value <= 5 && program) {
      setProgramScores((prev) => {
        const newScores = { ...prev };
        const key = program as keyof ProgramScores;
        // Transform 1-5 scale into points (e.g., (Score - 1) * 2)
        newScores[key] = (newScores[key] || 0) + (value - 1) * 2;
        return newScores;
      });
    }
  };

  const navigateToSection = (index: number) => {
    setCurrentSection(index);
    setShowReview(false);
  };

  const getCurrentQuestions = () => {
    if (!questions) return [];

    // Map section key to questions object property
    const questionMap: Record<string, Question[]> = {
      foundationalAssessment: questions.foundationalAssessment,
      academicAptitude: questions.academicAptitude,
      technicalSkills: questions.technicalSkills,
      careerInterest: questions.careerInterest,
      learningWorkStyle: questions.learningWorkStyle,
    };

    return questionMap[sectionKey] || [];
  };

  // ✅ ALGORITHM PART 4: Validation Logic
  const { validateSection } = useAssessmentValidation({
    formData,
    section: sectionKey,
    currentQuestions: getCurrentQuestions(),
    setCurrentQuestionIndex,
    categoryTitles,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const container = document.querySelector(".assessment-container");
    if (container) {
      container.scrollTop = 0;
    }
  }, [currentSection, showReview]);

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
      foundationalAssessment: {},
      academicAptitude: {},
      technicalSkills: {},
      careerInterest: {},
      learningWorkStyle: {},
    });
    setCurrentSection(0);
    setShowReview(false);
    setProgramScores({ BSCS: 0, BSIT: 0, BSIS: 0, "BSET-E": 0, "BSET-EL": 0 });
    StorageEncryptor.removeItem("evaluation-answers");
    StorageEncryptor.removeItem("currentAssessmentSection");
    clearAllAnswers();
    onStartNew?.();
  };

  if (questionsLoading)
    return <div className="p-5 text-center">Loading Questions...</div>;
  if (error)
    return <div className="p-5 text-danger text-center">Error: {error}</div>;
  if (!questions)
    return <div className="p-5 text-center">No questions available.</div>;

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

          {/* SECTION 0: foundationalAssessment */}
          {currentSection === 0 && (
            <FoundationalAssessmentSection
              questions={questions.foundationalAssessment}
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

          {/* SECTION 1: ACADEMIC */}
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

          {/* SECTION 2: TECHNICAL */}
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

          {/* SECTION 3: CAREER */}
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

          {/* SECTION 4: LEARNING STYLE */}
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

      {/* Instruction FAB */}
      <div className="assessment-instruction-fab">
        <button
          type="button"
          className="btn instruction-btn"
          onClick={() => setShowInstructions(true)}
        >
          <Info size={30} strokeWidth={2.5} color="white" />
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AssessmentForm;
