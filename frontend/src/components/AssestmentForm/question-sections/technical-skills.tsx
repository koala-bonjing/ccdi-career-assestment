import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { Wrench, CheckCircle2, XCircle } from "lucide-react";
import SectionHeader from "../section-header";
import AssessmentActionFooter from "../assessment-action-footer";
import type { AssessmentAnswers } from "../../../types";

interface TechnicalSkillsSectionProps {
  questions: { _id: string; questionText: string; program?: string }[];
  formData: AssessmentAnswers;
  onChange: (
    section: keyof AssessmentAnswers,
    q: string,
    val: number | boolean,
    prog?: string,
  ) => void;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  currentSection: number;
  totalSections: number;
}

const TechnicalSkillsSection: React.FC<TechnicalSkillsSectionProps> = ({
  questions,
  formData,
  onChange,
  onNext,
  onPrevious,
  onReset,
  currentSection,
  totalSections,
}) => {
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [sectionCompleted, setSectionCompleted] = useState<boolean>(() => {
    // Check if all questions were already answered when returning to this section
    return questions.every((q) => typeof formData.technicalSkills[q.questionText] === "boolean");
  });

  const [answers, setAnswers] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    questions.forEach((q) => {
      const existing = formData.technicalSkills[q.questionText];
      if (typeof existing === "boolean") {
        initial[q.questionText] = existing;
      }
    });
    return initial;
  });

  const currentQuestion = questions[quizIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const yesCount = Object.values(answers).filter(Boolean).length;

  // Calculate progress percentage
  const calculateProgress = () => {
    return Math.round((answeredCount / totalQuestions) * 100);
  };

  // Check if all questions are answered
  const allQuestionsAnswered = answeredCount === totalQuestions;

  // ── Answer handler ──────────────────────────────────────────────────────
  const handleAnswer = (value: boolean) => {
    const q = currentQuestion;

    const updatedAnswers = { ...answers, [q.questionText]: value };
    setAnswers(updatedAnswers);

    if (value) {
      onChange("technicalSkills", q.questionText, true, q.program);
    } else {
      if (formData.technicalSkills[q.questionText] === true) {
        onChange("technicalSkills", q.questionText, false, q.program);
      }
    }

    // Check if this was the last question
    const newAnsweredCount = Object.keys(updatedAnswers).length;
    if (newAnsweredCount === totalQuestions) {
      setSectionCompleted(true);
    }

    // Auto-advance to next question only if section isn't completed
    if (!sectionCompleted) {
      setTimeout(() => {
        if (quizIndex < totalQuestions - 1) {
          setQuizIndex((i) => i + 1);
        }
      }, 300);
    }
  };

  const handleNext = () => {
    // Only allow next if all questions are answered
    if (allQuestionsAnswered) {
      onNext();
    }
  };

  // ── Progress ────────────────────────────────────────────────────────────
  const progressPercent = sectionCompleted 
    ? 100 
    : Math.round((quizIndex / totalQuestions) * 100);

  // ── QUIZ SCREEN ────────────────────────────────────────────────────────
  const currentAnswer = answers[currentQuestion?.questionText];

  return (
    <Card
      className="border-0 shadow-lg w-100 mt-3 mt-md-5 mb-3 mb-md-5 mx-auto"
      style={{ maxWidth: "1300px", borderRadius: "16px" }}
    >
      <SectionHeader
        title="Technical Interests"
        icon={<Wrench size={window.innerWidth < 768 ? 28 : 40} />}
        variant="warning"
        sectionType="technicalSkills"
      />

      <Card.Body className="p-3 p-md-5">
        {/* Progress bar */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted small">
              {sectionCompleted ? (
                <span>All <strong>{totalQuestions}</strong> questions answered ✓</span>
              ) : (
                <span>Question <strong>{quizIndex + 1}</strong> of {totalQuestions}</span>
              )}
            </span>
            <span className="small fw-bold" style={{ color: "#EC2326" }}>
              {yesCount} interested so far
            </span>
          </div>
          <div
            className="w-100 rounded-pill overflow-hidden"
            style={{ height: "8px", background: "#e5e7eb" }}
          >
            <div
              className="h-100 rounded-pill"
              style={{
                width: `${progressPercent}%`,
                background: sectionCompleted 
                  ? "linear-gradient(135deg, #22c55e, #16a34a)" // Green when complete
                  : "linear-gradient(135deg, #A41D31, #EC2326)",
                transition: "width 0.4s ease",
                boxShadow: sectionCompleted
                  ? "0 0 8px rgba(34, 197, 94, 0.3)"
                  : "0 0 8px rgba(236, 35, 38, 0.3)",
              }}
            />
          </div>
        </div>

        {/* Completion message when all answered */}
        {sectionCompleted && (
          <div className="text-center mb-4">
            <div 
              className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill"
              style={{
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
              }}
            >
              <CheckCircle2 size={18} style={{ color: "#22c55e" }} />
              <span style={{ color: "#166534", fontWeight: "600", fontSize: "0.9rem" }}>
                Section Complete!
              </span>
            </div>
          </div>
        )}

        {/* Question card */}
        <div
          className="text-center mx-auto"
          style={{ maxWidth: "600px", minHeight: "280px" }}
        >
          {/* Question bubble */}
          <div
            className="mb-4 p-4 rounded-4"
            style={{
              background: "rgba(43, 49, 118, 0.03)",
              border: "1.5px solid rgba(43, 49, 118, 0.15)",
            }}
          >
            <div
              className="d-inline-flex align-items-center justify-content-center mb-3 rounded-circle"
              style={{
                width: "56px",
                height: "56px",
                background: "linear-gradient(135deg, #2B3176, #1C6CB3)",
                boxShadow: "0 4px 12px rgba(43, 49, 118, 0.25)",
              }}
            >
              <Wrench size={24} color="white" />
            </div>
            <h5
              className="fw-bold mb-0"
              style={{
                fontSize: "1.15rem",
                lineHeight: "1.6",
                color: "#2B3176",
              }}
            >
              {currentQuestion?.questionText}
            </h5>
          </div>

          {!sectionCompleted && (
            <p className="text-muted small mb-4">
              Are you interested in learning about this?
            </p>
          )}

          {/* Yes / No buttons */}
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button
              onClick={() => handleAnswer(false)}
              style={{
                minWidth: "140px",
                borderRadius: "50px",
                fontWeight: "600",
                fontSize: "0.95rem",
                padding: "12px 28px",
                background: currentAnswer === false ? "#1C6CB3" : "white",
                color: currentAnswer === false ? "white" : "#374151",
                border:
                  currentAnswer === false
                    ? "2px solid #1C6CB3"
                    : "2px solid #D1D5DB",
                transition: "all 0.2s ease",
                boxShadow:
                  currentAnswer === false
                    ? "0 4px 16px rgba(28, 108, 179, 0.35)"
                    : "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              className="hover-lift"
            >
              <XCircle size={18} />
              No
            </button>

            <button
              onClick={() => handleAnswer(true)}
              style={{
                minWidth: "140px",
                borderRadius: "50px",
                fontWeight: "600",
                fontSize: "0.95rem",
                padding: "12px 28px",
                background: currentAnswer === true ? "#EC2326" : "white",
                color: currentAnswer === true ? "white" : "#374151",
                border:
                  currentAnswer === true
                    ? "2px solid #EC2326"
                    : "2px solid #D1D5DB",
                transition: "all 0.2s ease",
                boxShadow:
                  currentAnswer === true
                    ? "0 4px 16px rgba(236, 35, 38, 0.35)"
                    : "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              className="hover-lift"
            >
              <CheckCircle2 size={18} />
              Yes
            </button>
          </div>

        </div>

        {/* Tip - only show when not completed */}
        {!sectionCompleted && (
          <div
            className="mt-5 p-3 rounded-3 text-center"
            style={{
              background: "rgba(28, 108, 179, 0.05)",
              border: "1px solid rgba(28, 108, 179, 0.15)",
            }}
          >
            <p
              className="small mb-0"
              style={{ fontSize: "0.82rem", color: "#2B3176" }}
            >
              💡 <strong>Tip:</strong> Answer based on genuine interest — even if
              you've never tried it before.
            </p>
          </div>
        )}
      </Card.Body>

      {/* Assessment Action Footer - shows permanently once all questions are answered */}
      {sectionCompleted && (
        <AssessmentActionFooter
          currentSection={currentSection}
          totalSections={totalSections}
          onPrevious={onPrevious}
          onNext={handleNext}
          onReset={onReset}
          isLastSection={currentSection === totalSections - 1}
          isComplete={calculateProgress() === 100}
          nextLabel="Career Interests →"
        />
      )}
    </Card>
  );
};

export default TechnicalSkillsSection;