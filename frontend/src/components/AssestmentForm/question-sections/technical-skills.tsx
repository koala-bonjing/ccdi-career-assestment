import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { 
  Wrench, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  ChevronDown,
  ChevronUp 
} from "lucide-react";
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
  const [isReviewExpanded, setIsReviewExpanded] = useState(false);

  // Always derive answers from formData as source of truth
  const answers: Record<string, boolean> = {};
  questions.forEach((q) => {
    const existing = formData.technicalSkills[q.questionText];
    if (typeof existing === "boolean") {
      answers[q.questionText] = existing;
    }
  });

  const currentQuestion = questions[quizIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const yesCount = Object.values(answers).filter(Boolean).length;

  // Derived — never out of sync
  const sectionCompleted = answeredCount === totalQuestions;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);
  const currentAnswer = answers[currentQuestion?.questionText];
  const isLastQuestion = quizIndex === totalQuestions - 1;
  const isFirstQuestion = quizIndex === 0;

  // ── Answer handler ──────────────────────────────────────────────────────
  const handleAnswer = (value: boolean) => {
    const q = currentQuestion;
    // Always persist both Yes AND No so answeredCount reaches totalQuestions
    onChange("technicalSkills", q.questionText, value, q.program);

    // Auto-advance if this question was previously unanswered and not last
    const isNewAnswer = answers[q.questionText] === undefined;
    const willBeCompleted = answeredCount + (isNewAnswer ? 1 : 0) === totalQuestions;
    if (!willBeCompleted && quizIndex < totalQuestions - 1) {
      setTimeout(() => {
        setQuizIndex((i) => i + 1);
      }, 300);
    }
  };

  // ── Navigation handlers ─────────────────────────────────────────────────
  const handleNext = () => {
    if (quizIndex < totalQuestions - 1) {
      setQuizIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (quizIndex > 0) {
      setQuizIndex((prev) => prev - 1);
    }
  };

  const toggleReviewAccordion = () => {
    setIsReviewExpanded((prev) => !prev);
  };

  const handleSectionNext = () => {
    if (sectionCompleted) onNext();
  };

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
                  ? "linear-gradient(135deg, #22c55e, #16a34a)"
                  : "linear-gradient(135deg, #A41D31, #EC2326)",
                transition: "width 0.4s ease",
                boxShadow: sectionCompleted
                  ? "0 0 8px rgba(34, 197, 94, 0.3)"
                  : "0 0 8px rgba(236, 35, 38, 0.3)",
              }}
            />
          </div>
        </div>

        {/* Completion badge */}
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
          <div className="d-flex gap-3 justify-content-center flex-wrap mb-4">
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
                border: currentAnswer === false ? "2px solid #1C6CB3" : "2px solid #D1D5DB",
                transition: "all 0.2s ease",
                boxShadow: currentAnswer === false ? "0 4px 16px rgba(28, 108, 179, 0.35)" : "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              className="hover-lift"
            >
              <XCircle size={18} /> No
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
                border: currentAnswer === true ? "2px solid #EC2326" : "2px solid #D1D5DB",
                transition: "all 0.2s ease",
                boxShadow: currentAnswer === true ? "0 4px 16px rgba(236, 35, 38, 0.35)" : "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              className="hover-lift"
            >
              <CheckCircle2 size={18} /> Yes
            </button>
          </div>

          {/* ── Question Navigation ─────────────────────────────────────── */}
          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
            <button
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
              style={{
                background: "white",
                border: "1.5px solid #D1D5DB",
                color: isFirstQuestion ? "#9CA3AF" : "#374151",
                fontWeight: "600",
                fontSize: "0.9rem",
                cursor: isFirstQuestion ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                opacity: isFirstQuestion ? 0.6 : 1,
              }}
            >
              <ChevronLeft size={18} /> Previous
            </button>

            <span className="text-muted small">
              {quizIndex + 1} / {totalQuestions}
            </span>

            <button
              onClick={handleNext}
              disabled={isLastQuestion}
              className="d-flex align-items-center gap-2 px-4 py-2 rounded-3"
              style={{
                background: !isLastQuestion
                  ? "linear-gradient(135deg, #EC2326, #A41D31)"
                  : "#E5E7EB",
                border: "none",
                color: !isLastQuestion ? "white" : "#9CA3AF",
                fontWeight: "600",
                fontSize: "0.9rem",
                cursor: !isLastQuestion ? "pointer" : "not-allowed",
                boxShadow: !isLastQuestion
                  ? "0 4px 12px rgba(236, 35, 38, 0.35)"
                  : "none",
                transition: "all 0.2s ease",
              }}
            >
              Next <ChevronRight size={18} />
            </button>
          </div>

          {/* ── Accordion Review Panel ──────────────────────────────────── */}
          {sectionCompleted && (
            <div className="mt-4 animate-fade-in">
              <button
                onClick={toggleReviewAccordion}
                className="w-100 d-flex align-items-center justify-content-between p-3 rounded-3"
                style={{
                  background: isReviewExpanded ? "rgba(164, 29, 49, 0.05)" : "#f8f9fa",
                  border: `1.5px solid ${isReviewExpanded ? "rgba(164, 29, 49, 0.3)" : "#e5e7eb"}`,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <Eye size={18} style={{ color: "#A41D31" }} />
                  <div className="text-start">
                    <span className="fw-bold" style={{ color: "#A41D31", fontSize: "0.9rem" }}>
                      Review Your Answers
                    </span>
                    <div className="d-flex gap-2 mt-1">
                      <span className="small" style={{ color: "#6b7280", fontSize: "0.75rem" }}>
                        {answeredCount}/{totalQuestions} answered
                      </span>
                      {yesCount > 0 && (
                        <span className="small" style={{ color: "#EC2326", fontSize: "0.75rem" }}>
                          • {yesCount} interested
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {isReviewExpanded ? (
                  <ChevronUp size={20} style={{ color: "#A41D31" }} />
                ) : (
                  <ChevronDown size={20} style={{ color: "#A41D31" }} />
                )}
              </button>

              <div
                style={{
                  maxHeight: isReviewExpanded ? "300px" : "0",
                  overflowY: isReviewExpanded ? "auto" : "hidden",
                  overflowX: "hidden",
                  transition: "max-height 0.3s ease-in-out",
                  opacity: isReviewExpanded ? 1 : 0,
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <div
                  className="p-3 rounded-bottom-3"
                  style={{
                    background: "#fafbfc",
                    border: "1px solid #e5e7eb",
                    borderTop: "none",
                  }}
                >
                  {questions.map((q, idx) => {
                    const ans = answers[q.questionText];
                    const isAnswered = typeof ans === "boolean";
                    const isCurrent = idx === quizIndex;

                    return (
                      <div
                        key={q._id || q.questionText}
                        className="py-2 px-3 rounded-2 mb-2"
                        style={{
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          background: isCurrent ? "rgba(164, 29, 49, 0.05)" : "transparent",
                          border: isCurrent
                            ? "1px solid rgba(164, 29, 49, 0.3)"
                            : "1px solid #f0f0f0",
                        }}
                        onClick={() => setQuizIndex(idx)}
                        onMouseEnter={(e) => {
                          if (!isCurrent) {
                            e.currentTarget.style.background = "rgba(164, 29, 49, 0.03)";
                            e.currentTarget.style.borderColor = "rgba(164, 29, 49, 0.15)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isCurrent) {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.borderColor = "#f0f0f0";
                          }
                        }}
                      >
                        {/* Question row */}
                        <div className="d-flex align-items-start gap-2">
                          <span
                            style={{
                              fontSize: "0.8rem",
                              fontWeight: "700",
                              color: isCurrent ? "#A41D31" : "#9CA3AF",
                              minWidth: "22px",
                              paddingTop: "1px",
                              flexShrink: 0,
                            }}
                          >
                            {idx + 1}.)
                          </span>
                          <span
                            style={{
                              fontSize: "0.82rem",
                              color: isAnswered ? "#374151" : "#9CA3AF",
                              fontWeight: isCurrent ? "600" : "500",
                              lineHeight: "1.4",
                              textAlign: "left",
                            }}
                          >
                            {q.questionText}
                          </span>
                        </div>
                        {/* Answer row */}
                        <div style={{ paddingLeft: "30px", marginTop: "4px" }}>
                          {isAnswered ? (
                            <span
                              style={{
                                fontSize: "0.8rem",
                                fontWeight: "600",
                                color: ans === true ? "#EC2326" : "#1C6CB3",
                              }}
                            >
                              {ans === true ? "Yes" : "No"}
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: "0.8rem",
                                color: "#D1D5DB",
                                fontStyle: "italic",
                              }}
                            >
                              Not answered
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tip */}
        {!sectionCompleted && (
          <div
            className="mt-5 p-3 rounded-3 text-center"
            style={{
              background: "rgba(28, 108, 179, 0.05)",
              border: "1px solid rgba(28, 108, 179, 0.15)",
            }}
          >
            <p className="small mb-0" style={{ fontSize: "0.82rem", color: "#2B3176" }}>
              💡 <strong>Tip:</strong> Answer based on genuine interest — even if
              you've never tried it before.
            </p>
          </div>
        )}
      </Card.Body>

      {sectionCompleted && (
        <AssessmentActionFooter
          currentSection={currentSection}
          totalSections={totalSections}
          onPrevious={onPrevious}
          onNext={handleSectionNext}
          onReset={onReset}
          isLastSection={currentSection === totalSections - 1}
          isComplete={sectionCompleted}
          nextLabel="Career Interests →"
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.25s ease-out; }
        .hover-lift:hover { transform: translateY(-2px); }
      `}</style>
    </Card>
  );
};

export default TechnicalSkillsSection;