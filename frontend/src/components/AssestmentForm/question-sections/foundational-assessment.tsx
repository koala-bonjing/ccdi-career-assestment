import React, { useState, useMemo, useEffect, useRef } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import {
  CheckCircle2,
  Circle,
  GraduationCap,
  ClipboardList,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Eye,
  ChevronDown,
  ChevronUp,
  type LucideIcon,
} from "lucide-react";
import SectionHeader from "../section-header";
import AssessmentActionFooter from "../assessment-action-footer";
import type { AssessmentSectionProps } from "../types";
import { type Question } from "./../../../hooks/useAssessmentQuestions";
import "./FoundationalAssessment.css";

interface QuestionGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  description: string;
  questions: Question[];
}

interface CategoryConfig {
  label: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

const ICON_PROPS = {
  size: 24,
  strokeWidth: 2,
  "aria-hidden": true,
} as const;

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const FoundationalAssessmentSection: React.FC<AssessmentSectionProps> = ({
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
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [shuffledOptionsMap, setShuffledOptionsMap] = useState<
    Record<string, string[]>
  >({});
  const [sectionCompleted, setSectionCompleted] = useState(false);
  const [showGroupReview, setShowGroupReview] = useState(false);
  const [isReviewExpanded, setIsReviewExpanded] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mount & when category changes
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeGroup, currentSection]);

  // Shuffle options once per question
  useEffect(() => {
    const newShuffledOptionsMap: Record<string, string[]> = {};
    questions.forEach((q) => {
      const qKey = q._id || q.questionText;
      if (q.options && q.options.length > 0) {
        newShuffledOptionsMap[qKey] = shuffleArray(q.options);
      }
    });
    setShuffledOptionsMap(newShuffledOptionsMap);
  }, [questions]);

  // Reset question index & review state when switching categories
  useEffect(() => {
    setActiveQuestionIndex(0);
    setShowGroupReview(false);
    setIsReviewExpanded(false);
  }, [activeGroup]);

  const categoryConfig: Record<string, CategoryConfig> = {
    prerequisites: {
      label: "Basic Knowledge",
      icon: GraduationCap,
      color: "#2B3176",
      description: "Math, English, and Computer Literacy.",
    },
    studyHabits: {
      label: "Study Habits",
      icon: ClipboardList,
      color: "#EC2326",
      description: "Your approach to learning.",
    },
    problemSolving: {
      label: "Problem Solving",
      icon: BrainCircuit,
      color: "#1C6CB3",
      description: "Logical thinking challenges.",
    },
  };

  // 1️⃣ Define groups first
  const questionGroups: QuestionGroup[] = useMemo(() => {
    const groups: Record<string, Question[]> = {};
    questions.forEach((q) => {
      const sub = q.subCategory || "prerequisites";
      if (!groups[sub]) groups[sub] = [];
      groups[sub].push(q as Question);
    });
    return Object.keys(categoryConfig).map((key) => ({
      id: key,
      ...categoryConfig[key],
      questions: groups[key] || [],
    }));
  }, [questions]);

  // 2️⃣ Derive current state BEFORE using in other hooks
  const currentGroup = questionGroups[activeGroup];
  const currentQuestions = currentGroup?.questions || [];
  const currentQuestion = currentQuestions[activeQuestionIndex];
  const currentQId = currentQuestion?._id || currentQuestion?.questionText;
  const isLastGroup = activeGroup === questionGroups.length - 1;
  const isLastQuestionInGroup =
    activeQuestionIndex === currentQuestions.length - 1;

  // 3️⃣ Now safe to use in useMemo
  const allCurrentGroupAnswered = useMemo(() => {
    return currentQuestions.every((q) => {
      const qId = q._id || q.questionText;
      return !!formData.foundationalAssessment[qId];
    });
  }, [currentQuestions, formData.foundationalAssessment]);

  const allQuestionsAnswered = useMemo(() => {
    return questionGroups.every((group) =>
      group.questions.every((q) => {
        const qId = q._id || q.questionText;
        return !!formData.foundationalAssessment[qId];
      }),
    );
  }, [questionGroups, formData.foundationalAssessment]);

  // Count unanswered questions in current group
  const unansweredInGroup = useMemo(() => {
    return currentQuestions.filter((q) => {
      const qId = q._id || q.questionText;
      return !formData.foundationalAssessment[qId];
    }).length;
  }, [currentQuestions, formData.foundationalAssessment]);

  // Show review panel when current category is fully answered
  useEffect(() => {
    if (allCurrentGroupAnswered && !sectionCompleted) {
      setShowGroupReview(true);
    }
  }, [allCurrentGroupAnswered, sectionCompleted]);

  const calculateProgress = () => {
    if (!questions || questions.length === 0) return 0;
    const answeredCount = questions.filter((q) => {
      const qId = q._id || q.questionText;
      return !!formData.foundationalAssessment[qId];
    }).length;
    return Math.round((answeredCount / questions.length) * 100);
  };

  const isGroupComplete = (groupIndex: number) => {
    const group = questionGroups[groupIndex];
    return (
      group.questions.length > 0 &&
      group.questions.every((q) => {
        const qId = q._id || q.questionText;
        return !!formData.foundationalAssessment[qId];
      })
    );
  };

  // Handle answer change with auto-advance (stops at category boundary)
  const handleAnswerChange = (qId: string, option: string) => {
    onChange("foundationalAssessment", qId, option);

    // Auto-advance only within the category, stops at last question
    if (!showGroupReview && !isLastQuestionInGroup) {
      setTimeout(() => {
        setActiveQuestionIndex((prev) => prev + 1);
      }, 400);
    }
  };

  // 🟢 Seamless Question & Category Navigation
  const handleNext = () => {
    if (activeQuestionIndex < currentQuestions.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
    } else if (activeGroup < questionGroups.length - 1) {
      // Last question in current group → move to next category
      setActiveGroup((prev) => prev + 1);
      setActiveQuestionIndex(0);
      setShowGroupReview(false);
    } else {
      // Last question in last group → complete section
      setSectionCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex((prev) => prev - 1);
    } else if (activeGroup > 0) {
      // First question in current group → jump to last question of previous group
      const prevGroup = questionGroups[activeGroup - 1];
      setActiveGroup((prev) => prev - 1);
      setActiveQuestionIndex(prevGroup.questions.length - 1);
      setShowGroupReview(isGroupComplete(activeGroup - 1));
    }
  };

  const toggleReviewAccordion = () => {
    setIsReviewExpanded(!isReviewExpanded);
  };

  const progressPercent = calculateProgress();

  return (
    <Card
      ref={topRef}
      className="border-0 shadow-lg w-100 mx-auto"
      style={{
        maxWidth: "1300px",
        borderRadius: "16px",
        overflow: "hidden",
        marginTop: "20px",
        marginBottom: "20px",
      }}
    >
      <SectionHeader
        icon={<BrainCircuit {...ICON_PROPS} />}
        sectionType="foundationalAssessment"
        title="Foundational Assessment"
        variant="primary"
      />

      <Card.Body className="p-3 p-md-5">
        {/* Progress Section */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted small">
              {sectionCompleted ? (
                <span>
                  All <strong>{questions.length}</strong> questions answered ✓
                </span>
              ) : (
                <span>
                  Category <strong>{activeGroup + 1}</strong> of{" "}
                  {questionGroups.length} • Question{" "}
                  <strong>{activeQuestionIndex + 1}</strong> of{" "}
                  {currentQuestions.length}
                </span>
              )}
            </span>
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill"
              style={{
                background: sectionCompleted
                  ? "rgba(28, 108, 179, 0.1)"
                  : "rgba(43, 49, 118, 0.04)",
                border: sectionCompleted
                  ? "1px solid rgba(28, 108, 179, 0.3)"
                  : "1px solid rgba(43, 49, 118, 0.15)",
                fontWeight: "600",
                fontSize: "0.85rem",
              }}
            >
              {sectionCompleted && (
                <CheckCircle2 size={14} style={{ color: "#1C6CB3" }} />
              )}
              <span style={{ color: sectionCompleted ? "#1C6CB3" : "#2B3176" }}>
                {progressPercent}% Complete
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
                width: `${progressPercent}%`,
                background: sectionCompleted
                  ? "#1C6CB3"
                  : allQuestionsAnswered
                    ? "linear-gradient(135deg, #22c55e, #16a34a)"
                    : "linear-gradient(135deg, #2B3176, #1C6CB3)",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <Row className="mb-4 g-2">
          {questionGroups.map((group, idx) => {
            const IconComponent = group.icon;
            const isComplete = isGroupComplete(idx);
            const isActive = activeGroup === idx;

            return (
              <Col key={group.id} xs={4}>
                <button
                  onClick={() => {
                    setActiveGroup(idx);
                    setShowGroupReview(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 8px",
                    border: `2px solid ${isActive ? group.color : isComplete ? `${group.color}60` : "#e0e0e0"}`,
                    borderRadius: "12px",
                    background: isActive ? `${group.color}10` : "white",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    position: "relative",
                  }}
                  aria-pressed={isActive}
                >
                  <div
                    style={{
                      marginBottom: "4px",
                      color: isActive ? group.color : "#666",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <IconComponent size={24} strokeWidth={2} />
                  </div>
                  <div
                    className="d-none d-md-block"
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      color: isActive ? group.color : "#666",
                      textTransform: "uppercase",
                    }}
                  >
                    {group.label}
                  </div>
                  {isComplete && (
                    <CheckCircle2
                      size={16}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        color: "#22c55e",
                      }}
                    />
                  )}
                </button>
              </Col>
            );
          })}
        </Row>

        {/* Current Question */}
        {!sectionCompleted && currentQuestion && (
          <div
            className="p-3 p-md-4 rounded-4"
            style={{
              background: `linear-gradient(135deg, ${currentGroup.color}08 0%, #ffffff 100%)`,
              border: `2px solid ${currentGroup.color}20`,
            }}
          >
            <div className="text-center mb-4">
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
              <h4
                className="fw-bold"
                style={{
                  color: currentGroup.color,
                  textTransform: "uppercase",
                  fontSize: "1.2rem",
                }}
              >
                {currentGroup.label}
              </h4>
              <p className="text-muted small">{currentGroup.description}</p>
            </div>

            <div className="mb-4">
              {/* Question progress dots */}
              <div className="d-flex justify-content-center gap-1 mb-4">
                {currentQuestions.map((q, idx) => {
                  const qId = q._id || q.questionText;
                  const isAnswered = !!formData.foundationalAssessment[qId];
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveQuestionIndex(idx);
                        setShowGroupReview(false);
                      }}
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        backgroundColor:
                          idx === activeQuestionIndex
                            ? currentGroup.color
                            : isAnswered
                              ? "#22c55e"
                              : "#e5e7eb",
                        transition: "all 0.3s ease",
                        transform:
                          idx === activeQuestionIndex
                            ? "scale(1.3)"
                            : "scale(1)",
                      }}
                      aria-label={`Go to question ${idx + 1}`}
                    />
                  );
                })}
              </div>

              {/* Question */}
              <div
                className="p-3 mb-4 rounded-3"
                style={{
                  background: "rgba(43, 49, 118, 0.03)",
                  border: "1px solid rgba(43, 49, 118, 0.08)",
                }}
              >
                <div className="d-flex align-items-start">
                  <span
                    className="d-inline-flex align-items-center justify-content-center me-3 rounded-circle flex-shrink-0"
                    style={{
                      width: "32px",
                      height: "32px",
                      background: "linear-gradient(135deg, #2B3176, #1C6CB3)",
                      color: "white",
                      fontSize: "0.9rem",
                      fontWeight: "700",
                    }}
                  >
                    {activeQuestionIndex + 1}
                  </span>
                  <span
                    style={{
                      color: "#2B3176",
                      fontWeight: "600",
                      fontSize: "1.05rem",
                      lineHeight: "1.5",
                    }}
                  >
                    {currentQuestion.questionText}
                  </span>
                </div>
              </div>

              {/* Options */}
              <Row className="g-2 g-md-3 mb-4">
                {(
                  shuffledOptionsMap[currentQId] ||
                  currentQuestion.options ||
                  []
                ).map((option, optIdx) => {
                  const selectedValue =
                    formData.foundationalAssessment[currentQId];
                  const isSelected = selectedValue === option;

                  return (
                    <Col key={`${currentQId}-${optIdx}`} xs={12}>
                      <div
                        onClick={() => handleAnswerChange(currentQId, option)}
                        className="d-flex align-items-center p-3 p-md-4 rounded-3"
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleAnswerChange(currentQId, option);
                          }
                        }}
                        style={{
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          backgroundColor: isSelected
                            ? `${currentGroup.color}10`
                            : "white",
                          border: `1.5px solid ${isSelected ? currentGroup.color : "#D1D5DB"}`,
                          boxShadow: isSelected
                            ? `0 2px 8px ${currentGroup.color}20`
                            : "none",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = isSelected
                            ? `${currentGroup.color}15`
                            : "#f8f9fa";
                          e.currentTarget.style.borderColor =
                            currentGroup.color;
                          e.currentTarget.style.boxShadow =
                            "0 2px 8px rgba(0,0,0,0.06)";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = isSelected
                            ? `${currentGroup.color}10`
                            : "white";
                          e.currentTarget.style.borderColor = isSelected
                            ? currentGroup.color
                            : "#D1D5DB";
                          e.currentTarget.style.boxShadow = isSelected
                            ? `0 2px 8px ${currentGroup.color}20`
                            : "none";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <div
                          className="d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                          style={{ width: "24px", height: "24px" }}
                        >
                          {isSelected ? (
                            <CheckCircle2
                              size={22}
                              style={{ color: currentGroup.color }}
                            />
                          ) : (
                            <Circle size={22} style={{ color: "#D1D5DB" }} />
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: "0.95rem",
                            color: isSelected ? "#2B3176" : "#374151",
                            fontWeight: isSelected ? "600" : "400",
                            lineHeight: "1.3",
                          }}
                        >
                          {option}
                        </span>
                      </div>
                    </Col>
                  );
                })}
              </Row>
              {/* 🟢 Persistent Prev/Next Navigation */}
              <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                <Button
                  variant="outline-secondary"
                  onClick={handlePrevious}
                  disabled={activeGroup === 0 && activeQuestionIndex === 0}
                  className="d-flex align-items-center gap-2"
                  style={{
                    padding: "10px 20px",
                    borderRadius: "10px",
                    fontWeight: "600",
                    borderColor: "#D1D5DB",
                    color: "#6B7280",
                  }}
                >
                  <ChevronLeft size={18} />
                  Previous
                </Button>

                <Button
                  onClick={handleNext}
                  className="d-flex align-items-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${currentGroup.color}, ${currentGroup.color}dd)`,
                    border: "none",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "10px",
                    fontWeight: "600",
                    boxShadow: `0 4px 12px ${currentGroup.color}40`,
                  }}
                >
                  {isLastQuestionInGroup
                    ? isLastGroup
                      ? "Complete Section ✓"
                      : "Next Category →"
                    : "Next Question →"}
                  <ChevronRight size={18} />
                </Button>
              </div>

              {/* 📋 Accordion Review Panel */}
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
                      transition: "all 0.2s ease",
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
                          Review: {currentGroup.label}
                        </span>
                        <div className="d-flex gap-2 mt-1">
                          <span
                            className="small"
                            style={{ color: "#6b7280", fontSize: "0.75rem" }}
                          >
                            {currentQuestions.length - unansweredInGroup}/
                            {currentQuestions.length} answered
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
                              • Complete ✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {isReviewExpanded ? (
                      <ChevronUp
                        size={20}
                        style={{ color: currentGroup.color }}
                      />
                    ) : (
                      <ChevronDown
                        size={20}
                        style={{ color: currentGroup.color }}
                      />
                    )}
                  </button>

                  <div
                    style={{
                      maxHeight: isReviewExpanded ? "600px" : "0",
                      overflow: "hidden",
                      transition: "max-height 0.3s ease-in-out",
                      opacity: isReviewExpanded ? 1 : 0,
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
                      {currentQuestions.map((q, idx) => {
                        const qId = q._id || q.questionText;
                        const selectedAnswer =
                          formData.foundationalAssessment[qId];
                        const isAnswered = !!selectedAnswer;
                        const isCurrent = idx === activeQuestionIndex;

                        return (
                          <div
                            key={qId}
                            className="d-flex justify-content-between align-items-center py-2 px-3 rounded-2 mb-1"
                            style={{
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                              background: isCurrent
                                ? `${currentGroup.color}08`
                                : "transparent",
                              border: isCurrent
                                ? `1px solid ${currentGroup.color}40`
                                : "1px solid transparent",
                            }}
                            onClick={() => {
                              setActiveQuestionIndex(idx);
                              setShowGroupReview(false);
                              setIsReviewExpanded(false);
                            }}
                            onMouseEnter={(e) => {
                              if (!isCurrent) {
                                e.currentTarget.style.background = `${currentGroup.color}05`;
                                e.currentTarget.style.borderColor = `${currentGroup.color}20`;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isCurrent) {
                                e.currentTarget.style.background =
                                  "transparent";
                                e.currentTarget.style.borderColor =
                                  "transparent";
                              }
                            }}
                          >
                            <div
                              className="d-flex align-items-center gap-2"
                              style={{ maxWidth: "65%" }}
                            >
                              <span
                                className="small fw-bold"
                                style={{
                                  color: isCurrent
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
                                  fontWeight: isCurrent ? "600" : "400",
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
                                    backgroundColor: `${currentGroup.color}15`,
                                    color: currentGroup.color,
                                    fontWeight: "600",
                                    fontSize: "0.75rem",
                                    borderRadius: "6px",
                                  }}
                                >
                                  {selectedAnswer}
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
                              {isCurrent && (
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
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tip */}
        {!sectionCompleted && !showGroupReview && (
          <div
            className="mt-4 p-3 rounded-3 text-center"
            style={{
              background: "rgba(28, 108, 179, 0.05)",
              border: "1px solid rgba(28, 108, 179, 0.15)",
            }}
          >
            <p
              className="small mb-0"
              style={{ fontSize: "0.82rem", color: "#2B3176" }}
            >
              💡 <strong>Tip:</strong> Select the best answer for each question.
              You'll review your answers before moving to the next category.
            </p>
          </div>
        )}
      </Card.Body>

      {/* Assessment Action Footer - only shows when entire section is complete */}
      {sectionCompleted && (
        <AssessmentActionFooter
          currentSection={currentSection}
          totalSections={totalSections}
          onPrevious={onPrevious}
          onNext={onNext}
          onReset={onReset}
          isLastSection={false}
          isComplete={sectionCompleted}
          nextLabel="Academic Aptitude →"
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.25s ease-out; }
      `}</style>
    </Card>
  );
};

export default FoundationalAssessmentSection;
