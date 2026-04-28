import React, { useState, useMemo, useEffect, useRef } from "react";
import { Card, Row, Col } from "react-bootstrap";
import {
  CheckCircle2,
  XCircle,
  BrainCircuit,
  BookOpen,
  Briefcase,
  Wallet,
  Target,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  type LucideIcon,
} from "lucide-react";
import SectionHeader from "../section-header";
import AssessmentActionFooter from "../assessment-action-footer";
import type { AssessmentSectionProps } from "../types";
import type { Question } from "../../../types";

interface QuestionGroup {
  category: string;
  icon: LucideIcon;
  color: string;
  description: string;
  questions: Question[];
}

const CATEGORY_MAP: Record<
  string,
  { icon: LucideIcon; color: string; description: string }
> = {
  "Learning Preferences": {
    icon: BookOpen,
    color: "#2B3176",
    description:
      "How you like to learn (hands-on, projects, self-study) and the program length you can commit to.",
  },
  "Work Style Preferences": {
    icon: Briefcase,
    color: "#EC2326",
    description:
      "Your preferred work environment: internships, part-time work, physical demands, transportation.",
  },
  "Financial & Time Resources": {
    icon: Wallet,
    color: "#1C6CB3",
    description:
      "What you can invest: tools, lab fees, certifications, computer access, study time.",
  },
  "Career Goals & Logistics": {
    icon: Target,
    color: "#A41D31",
    description:
      "Your long‑term plans: management roles, licensure, entry‑level work, or further education.",
  },
  "Program Commitment": {
    icon: Calendar,
    color: "#6c757d",
    description: "Your ability to commit to program duration and intensity.",
  },
};

const LearningStyleSection: React.FC<AssessmentSectionProps> = ({
  questions,
  formData,
  onChange,
  onNext,
  onPrevious,
  onReset,
  currentSection,
  totalSections,
}) => {
  const [activeGroup, setActiveGroup] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showCategoryIntro, setShowCategoryIntro] = useState(true);
  const [showGroupReview, setShowGroupReview] = useState(false);
  const [isReviewExpanded, setIsReviewExpanded] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const autoAdvanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setShowCategoryIntro(true);
    setQuizIndex(0);
    const timer = setTimeout(() => setShowCategoryIntro(false), 1500);
    return () => clearTimeout(timer);
  }, [activeGroup]);

  const questionGroups: QuestionGroup[] = useMemo(() => {
    const groupsMap = new Map<string, Question[]>();
    questions.forEach((question) => {
      const subCat = question.subCategory || "Uncategorized";
      if (!groupsMap.has(subCat)) groupsMap.set(subCat, []);
      groupsMap.get(subCat)!.push(question as Question);
    });

    const groups: QuestionGroup[] = [];
    for (const [category, questionsList] of groupsMap.entries()) {
      const config = CATEGORY_MAP[category] || {
        icon: BookOpen,
        color: "#6c757d",
        description: `Questions about ${category.toLowerCase()}`,
      };
      groups.push({
        category,
        icon: config.icon,
        color: config.color,
        description: config.description,
        questions: questionsList,
      });
    }
    return groups;
  }, [questions]);

  const currentGroup = questionGroups[activeGroup];
  const currentQuestion = currentGroup?.questions[quizIndex];
  const totalQuestionsInGroup = currentGroup?.questions.length || 0;
  const totalGroups = questionGroups.length;

  const globalQuestionNumber = useMemo(() => {
    let count = 0;
    for (let i = 0; i < activeGroup; i++) {
      count += questionGroups[i].questions.length;
    }
    return count + quizIndex + 1;
  }, [activeGroup, quizIndex, questionGroups]);

  const calculateProgress = () => {
    const answered = questions.filter(
      (q) => typeof formData.learningWorkStyle[q.questionText] === "boolean",
    ).length;
    return Math.round((answered / questions.length) * 100);
  };

  const yesCountInGroup =
    currentGroup?.questions.filter(
      (q) => formData.learningWorkStyle[q.questionText] === true,
    ).length || 0;

  const isGroupComplete = (group: QuestionGroup) => {
    return group.questions.every(
      (q) => typeof formData.learningWorkStyle[q.questionText] === "boolean",
    );
  };

  const isSectionComplete = questionGroups.every(isGroupComplete);

  const isGroupFullyAnswered =
    currentGroup?.questions.every(
      (q) => typeof formData.learningWorkStyle[q.questionText] === "boolean",
    ) || false;

  useEffect(() => {
    if (isGroupFullyAnswered && !showGroupReview) {
      setShowGroupReview(true);

      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }

      if (activeGroup < totalGroups - 1) {
        autoAdvanceTimeoutRef.current = setTimeout(() => {
          setActiveGroup((prev) => prev + 1);
        }, 2000);
      }
    }

    return () => {
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, [isGroupFullyAnswered, activeGroup, totalGroups]);

  const handleAnswer = (value: boolean) => {
    if (!currentQuestion) return;
    onChange(
      "learningWorkStyle",
      currentQuestion.questionText,
      value,
      currentQuestion.program,
    );
    setShowValidationError(false);

    if (quizIndex < totalQuestionsInGroup - 1) {
      setTimeout(() => {
        setQuizIndex((i) => i + 1);
      }, 200);
    }
  };

  const handleNext = () => {
    if (
      typeof formData.learningWorkStyle[currentQuestion?.questionText] !==
      "boolean"
    ) {
      setShowValidationError(true);
      setTimeout(() => setShowValidationError(false), 2500);
      return;
    }

    if (quizIndex < totalQuestionsInGroup - 1) {
      setQuizIndex((i) => i + 1);
    }
  };

  const handlePrevious = () => {
    if (quizIndex > 0) {
      setQuizIndex((i) => i - 1);
    }
  };

  const toggleReviewAccordion = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsReviewExpanded(!isReviewExpanded);
  };

  const currentAnswer = currentQuestion
    ? formData.learningWorkStyle[currentQuestion.questionText]
    : undefined;

  const unansweredInGroup =
    currentGroup?.questions.filter(
      (q) => typeof formData.learningWorkStyle[q.questionText] !== "boolean",
    ).length || 0;

  if (questionGroups.length === 0) {
    return (
      <Card className="border-0 shadow-lg w-100 p-5 text-center">
        <p>No questions available for this section.</p>
      </Card>
    );
  }

  return (
    <Card
      className="border-0 shadow-lg w-100"
      style={{
        maxWidth: "1300px",
        borderRadius: "16px",
        overflow: "hidden",
        marginTop: isMobile ? "20px" : "50px",
        marginBottom: isMobile ? "20px" : "50px",
      }}
    >
      <SectionHeader
        icon={<BrainCircuit size={40} aria-hidden="true" />}
        sectionType="learningWorkStyle"
        title="Learning & Commitments"
        variant="warning"
      />

      <Card.Body className="p-3 p-md-5">
        {showCategoryIntro && (
          <div
            className="text-center mb-4"
            style={{ animation: "fadeInScale 0.4s ease-out" }}
          >
            <div
              className="d-inline-flex align-items-center gap-3 px-4 py-3 rounded-4"
              style={{
                background: `linear-gradient(135deg, ${currentGroup.color}15, ${currentGroup.color}08)`,
                border: `2px solid ${currentGroup.color}30`,
                boxShadow: `0 4px 16px ${currentGroup.color}20`,
              }}
            >
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "48px",
                  height: "48px",
                  background: `linear-gradient(135deg, ${currentGroup.color}, ${currentGroup.color}dd)`,
                  boxShadow: `0 4px 12px ${currentGroup.color}40`,
                  animation: "pulse 2s infinite",
                }}
              >
                <currentGroup.icon size={24} color="white" />
              </div>
              <div className="text-start">
                <div
                  style={{
                    color: currentGroup.color,
                    fontWeight: "800",
                    fontSize: "1.1rem",
                    textTransform: "uppercase",
                  }}
                >
                  {currentGroup.category}
                </div>
                <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                  {currentGroup.description.substring(0, 60)}...
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted small">
              Question <strong>{globalQuestionNumber}</strong> of{" "}
              {questions.length}
            </span>
            <div className="d-flex gap-3">
              <span className="small fw-bold" style={{ color: "#EC2326" }}>
                {yesCountInGroup} Yes{" "}
              </span>
              <span className="small fw-bold" style={{ color: "#1C6CB3" }}>
                {activeGroup + 1}/{totalGroups} Categories
              </span>
            </div>
          </div>
          <div
            className="w-100 rounded-pill overflow-hidden"
            style={{ height: "8px", background: "#e5e7eb" }}
          >
            <div
              className="h-100 rounded-pill"
              style={{
                width: `${calculateProgress()}%`,
                background: isSectionComplete
                  ? "#1C6CB3"
                  : "linear-gradient(135deg, #2B3176, #1C6CB3)",
                transition: "width 0.3s ease",
                boxShadow: isSectionComplete
                  ? "0 0 8px rgba(28, 108, 179, 0.3)"
                  : "none",
              }}
            />
          </div>
        </div>

        <Row className="mb-4 g-2">
          {questionGroups.map((group, idx) => {
            const IconComponent = group.icon;
            const isComplete = isGroupComplete(group);
            const isActive = activeGroup === idx;

            return (
              <Col key={idx} xs={6} lg={Math.floor(12 / questionGroups.length)}>
                <button
                  onClick={() => {
                    setActiveGroup(idx);
                    setShowGroupReview(false);
                    if (autoAdvanceTimeoutRef.current) {
                      clearTimeout(autoAdvanceTimeoutRef.current);
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: isMobile ? "8px 4px" : "12px 8px",
                    border: `2px solid ${isActive ? group.color : isComplete ? `${group.color}60` : "#e0e0e0"}`,
                    borderRadius: "12px",
                    background: isActive ? `${group.color}10` : "white",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                  aria-pressed={isActive}
                >
                  <div
                    style={{
                      marginBottom: "2px",
                      color: isActive ? group.color : "#666",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <IconComponent size={isMobile ? 20 : 28} strokeWidth={2} />
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? "0.6rem" : "0.75rem",
                      fontWeight: "700",
                      color: isActive ? group.color : "#666",
                      textTransform: "uppercase",
                      lineHeight: "1.2",
                    }}
                  >
                    {group.category.split(" & ")[0]}
                  </div>
                  {isComplete && (
                    <CheckCircle2
                      size={14}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        color: "#22c55e",
                      }}
                    />
                  )}
                </button>
              </Col>
            );
          })}
        </Row>

        <div
          className="text-center mx-auto"
          style={{ maxWidth: "650px", minHeight: "300px" }}
        >
          <div
            key={`${activeGroup}-${quizIndex}`}
            className="mb-4 p-4 rounded-4"
            style={{
              background: `linear-gradient(135deg, ${currentGroup.color}08, #ffffff)`,
              border: `1.5px solid ${currentGroup.color}30`,
              overflow: "hidden",
              transition: "all 0.1s ease",
            }}
          >
            <div
              className="d-inline-flex align-items-center justify-content-center mb-3 rounded-circle"
              style={{
                width: "56px",
                height: "56px",
                background: `linear-gradient(135deg, ${currentGroup.color}, ${currentGroup.color}dd)`,
                boxShadow: `0 4px 12px ${currentGroup.color}40`,
              }}
            >
              <currentGroup.icon size={24} color="white" />
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

          <p className="text-muted small mb-3">
            <span style={{ color: currentGroup.color, fontWeight: "600" }}>
              {currentGroup.category}
            </span>{" "}
            — Does this apply to you?
          </p>

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
                border:
                  currentAnswer === false
                    ? "2px solid #1C6CB3"
                    : "2px solid #D1D5DB",
                transition: "all 0.15s ease",
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
                background:
                  currentAnswer === true ? currentGroup.color : "white",
                color: currentAnswer === true ? "white" : "#374151",
                border:
                  currentAnswer === true
                    ? `2px solid ${currentGroup.color}`
                    : "2px solid #D1D5DB",
                transition: "all 0.15s ease",
                boxShadow:
                  currentAnswer === true
                    ? `0 4px 16px ${currentGroup.color}40`
                    : "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <CheckCircle2 size={18} /> Yes
            </button>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
            <button
              onClick={handlePrevious}
              disabled={quizIndex === 0}
              className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
              style={{
                background: "white",
                border: "1.5px solid #D1D5DB",
                color: quizIndex === 0 ? "#9CA3AF" : "#374151",
                fontWeight: "600",
                fontSize: "0.9rem",
                cursor: quizIndex === 0 ? "not-allowed" : "pointer",
                transition: "all 0.15s ease",
                opacity: quizIndex === 0 ? 0.6 : 1,
              }}
            >
              <ChevronLeft size={18} /> Previous
            </button>

            <span className="text-muted small">
              {quizIndex + 1} / {totalQuestionsInGroup}
            </span>

            <button
              onClick={handleNext}
              disabled={
                quizIndex === totalQuestionsInGroup - 1 ||
                typeof currentAnswer !== "boolean"
              }
              className="d-flex align-items-center gap-2 px-4 py-2 rounded-3"
              style={{
                background:
                  quizIndex < totalQuestionsInGroup - 1 &&
                  typeof currentAnswer === "boolean"
                    ? `linear-gradient(135deg, ${currentGroup.color}, ${currentGroup.color}dd)`
                    : "#E5E7EB",
                border: "none",
                color:
                  quizIndex < totalQuestionsInGroup - 1 &&
                  typeof currentAnswer === "boolean"
                    ? "white"
                    : "#9CA3AF",
                fontWeight: "600",
                fontSize: "0.9rem",
                cursor:
                  quizIndex < totalQuestionsInGroup - 1 &&
                  typeof currentAnswer === "boolean"
                    ? "pointer"
                    : "not-allowed",
                boxShadow:
                  quizIndex < totalQuestionsInGroup - 1 &&
                  typeof currentAnswer === "boolean"
                    ? `0 4px 12px ${currentGroup.color}40`
                    : "none",
                transition: "all 0.15s ease",
              }}
            >
              Next <ChevronRight size={18} />
            </button>
          </div>

          {showValidationError && (
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3 mb-3 animate-fade-in"
              style={{
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <AlertCircle size={16} style={{ color: "#EF4444" }} />
              <span
                style={{
                  color: "#B91C1C",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                }}
              >
                Please select Yes or No before continuing.
              </span>
            </div>
          )}

          {/* Accordion Review Panel - Fixed */}
          {showGroupReview && (
            <div className="mt-3 mb-3 animate-fade-in">
              <button
                onClick={toggleReviewAccordion}
                className="w-100 d-flex align-items-center justify-content-between p-3 rounded-3"
                style={{
                  background: isReviewExpanded
                    ? `${currentGroup.color}08`
                    : "#f8f9fa",
                  border: `1.5px solid ${
                    isReviewExpanded ? currentGroup.color : "#e5e7eb"
                  }40`,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <Eye size={18} style={{ color: currentGroup.color }} />
                  <div className="text-start">
                    <span
                      className="fw-bold"
                      style={{
                        color: currentGroup.color,
                        fontSize: "0.9rem",
                      }}
                    >
                      Review: {currentGroup.category}
                    </span>
                    <div className="d-flex gap-2 mt-1">
                      <span
                        className="small"
                        style={{ color: "#6b7280", fontSize: "0.75rem" }}
                      >
                        {totalQuestionsInGroup - unansweredInGroup}/
                        {totalQuestionsInGroup} answered
                      </span>
                      {unansweredInGroup > 0 && (
                        <span
                          className="small"
                          style={{ color: "#EF4444", fontSize: "0.75rem" }}
                        >
                          • {unansweredInGroup} unanswered
                        </span>
                      )}
                      {unansweredInGroup === 0 && (
                        <span
                          className="small"
                          style={{ color: "#22c55e", fontSize: "0.75rem" }}
                        >
                          • Complete
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {isReviewExpanded ? (
                  <ChevronUp size={20} style={{ color: currentGroup.color }} />
                ) : (
                  <ChevronDown
                    size={20}
                    style={{ color: currentGroup.color }}
                  />
                )}
              </button>

              <div
                style={{
                  maxHeight: isReviewExpanded ? "300px" : "0",
                  overflowY: isReviewExpanded ? "auto" : "hidden",
                  overflowX: "hidden",
                  transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
                  {currentGroup.questions.map((q, idx) => {
                    const ans = formData.learningWorkStyle[q.questionText];
                    const isAnswered = typeof ans === "boolean";
                    const isCurrentQuestion = idx === quizIndex;

                    return (
                      <div
                        key={q.questionText}
                        className="d-flex justify-content-between align-items-center py-2 px-3 rounded-2 mb-1"
                        style={{
                          border: isCurrentQuestion
                            ? `1px solid ${currentGroup.color}40`
                            : "1px solid transparent",
                          background: isCurrentQuestion
                            ? `${currentGroup.color}08`
                            : "transparent",
                          cursor: "pointer",
                          transition: "all 0.1s ease",
                        }}
                        onClick={() => {
                          setQuizIndex(idx);
                        }}
                        onMouseEnter={(e) => {
                          if (!isCurrentQuestion) {
                            e.currentTarget.style.background = "#f3f4f6";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isCurrentQuestion) {
                            e.currentTarget.style.background = "transparent";
                          }
                        }}
                      >
                        <div
                          className="d-flex align-items-center gap-2"
                          style={{ maxWidth: "70%" }}
                        >
                          <span
                            className="small fw-bold"
                            style={{
                              color: isCurrentQuestion
                                ? currentGroup.color
                                : "#9CA3AF",
                              minWidth: "20px",
                            }}
                          >
                            {idx + 1}.
                          </span>
                          <span
                            className="small"
                            style={{
                              color: isAnswered ? "#374151" : "#9CA3AF",
                              fontWeight: isCurrentQuestion ? "600" : "400",
                              textAlign: "left",
                              lineHeight: "1.4",
                            }}
                          >
                            {q.questionText}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          {isAnswered ? (
                            <span
                              className="badge px-2 py-1"
                              style={{
                                backgroundColor:
                                  ans === true ? "#22c55e15" : "#1C6CB315",
                                color: ans === true ? "#16a34a" : "#1C6CB3",
                                fontWeight: "600",
                                fontSize: "0.75rem",
                                borderRadius: "6px",
                              }}
                            >
                              {ans === true ? "Yes" : "No"}
                            </span>
                          ) : (
                            <span
                              className="badge px-2 py-1"
                              style={{
                                backgroundColor: "#f3f4f6",
                                color: "#9CA3AF",
                                fontWeight: "500",
                                fontSize: "0.75rem",
                                borderRadius: "6px",
                              }}
                            >
                              —
                            </span>
                          )}
                          {isCurrentQuestion && (
                            <span
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: currentGroup.color,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {unansweredInGroup === 0 && activeGroup < totalGroups - 1 && (
                    <div className="text-center mt-2 pt-2 border-top">
                      <span className="small text-muted">
                        ✨ Automatically moving to next category in 2 seconds...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card.Body>

      {isSectionComplete && (
        <AssessmentActionFooter
          currentSection={currentSection}
          totalSections={totalSections}
          onPrevious={onPrevious}
          onNext={onNext}
          onReset={onReset}
          isLastSection={currentSection === totalSections - 1}
          isComplete={isSectionComplete}
          nextLabel={
            currentSection === totalSections - 1
              ? "Finish Assessment →"
              : "Next Section →"
          }
        />
      )}

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </Card>
  );
};

export default LearningStyleSection;
