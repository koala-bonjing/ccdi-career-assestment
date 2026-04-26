import React, { useState, useMemo, useEffect, useRef } from "react";
import { Card, Row, Col } from "react-bootstrap";
import {
  CheckCircle2,
  Circle,
  GraduationCap,
  ClipboardList,
  BrainCircuit,
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

// const SMALL_ICON_PROPS = {
//   size: 16,
//   strokeWidth: 2,
//   "aria-hidden": true,
// } as const;

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
  const [shuffledOptionsMap, setShuffledOptionsMap] = useState<
    Record<string, string[]>
  >({});
  const [sectionCompleted, setSectionCompleted] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (topRef.current) {
        topRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [activeGroup, currentSection]);

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

  // Check if section was already completed (for back navigation)
  useEffect(() => {
    const progress = calculateProgress();
    if (progress === 100) {
      setSectionCompleted(true);
    }
  }, []);

  const calculateProgress = () => {
    if (!questions || questions.length === 0) return 0;
    const answeredCount = questions.filter((q) => {
      const qId = q._id || q.questionText;
      return !!formData.foundationalAssessment[qId];
    }).length;
    return Math.round((answeredCount / questions.length) * 100);
  };

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

  // Auto-advance to next group when current group is complete
  const handleAnswerChange = (qId: string, option: string) => {
    onChange("foundationalAssessment", qId, option);

    // Check if current group is now complete after this answer
    const currentGroupQuestions = questionGroups[activeGroup].questions;
    const willBeComplete = currentGroupQuestions.every((q) => {
      const id = q._id || q.questionText;
      if (id === qId) return true; // This one is being answered now
      return !!formData.foundationalAssessment[id];
    });

    if (willBeComplete && activeGroup < questionGroups.length - 1) {
      // Auto-advance to next group after a short delay
      setTimeout(() => {
        setActiveGroup((prev) => prev + 1);
      }, 500);
    }

    // Check if entire section is now complete
    const totalAnswered =
      Object.values(formData.foundationalAssessment).filter(
        (v) => typeof v === "string" && v.trim() !== "",
      ).length + 1; // +1 for the current answer

    if (totalAnswered >= questions.length) {
      setSectionCompleted(true);
    }
  };

  const currentGroup = questionGroups[activeGroup];
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
                  {questionGroups.length}
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
              <span
                style={{
                  color: sectionCompleted ? "#1C6CB3" : "#2B3176",
                }}
              >
                {progressPercent}% Complete
              </span>
            </div>
          </div>
          {/* Progress bar */}
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
                  : "linear-gradient(135deg, #2B3176, #1C6CB3)",
                transition: "width 0.4s ease",
                boxShadow: sectionCompleted
                  ? "0 0 8px rgba(28, 108, 179, 0.3)"
                  : "none",
              }}
            />
          </div>
        </div>

        {/* Completion message */}
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
              <span
                style={{
                  color: "#166534",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                }}
              >
                Section Complete!
              </span>
            </div>
          </div>
        )}

        {/* Category Navigation Tabs */}
        <Row className="mb-4 g-2">
          {questionGroups.map((group, idx) => {
            const IconComponent = group.icon;
            const isComplete = isGroupComplete(idx);
            const isActive = activeGroup === idx;

            return (
              <Col key={group.id} xs={4}>
                <button
                  onClick={() => setActiveGroup(idx)}
                  style={{
                    width: "100%",
                    padding: "12px 8px",
                    border: `2px solid ${
                      isActive
                        ? group.color
                        : isComplete
                          ? `${group.color}60`
                          : "#e0e0e0"
                    }`,
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

        {/* Current Category Content */}
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

          <Row className="g-4">
            {currentGroup.questions.map((q, qIdx) => {
              const qId = q._id || q.questionText;
              const selectedValue = formData.foundationalAssessment[qId];
              const randomizedOptions =
                shuffledOptionsMap[qId] || q.options || [];

              return (
                <Col key={qId} xs={12}>
                  <div className="mb-3">
                    <span
                      className="d-inline-flex align-items-center justify-content-center me-2 rounded-circle"
                      style={{
                        width: "28px",
                        height: "28px",
                        background: "linear-gradient(135deg, #2B3176, #1C6CB3)",
                        color: "white",
                        fontSize: "0.8rem",
                        fontWeight: "700",
                        flexShrink: 0,
                      }}
                    >
                      {qIdx + 1}
                    </span>
                    <span
                      style={{
                        color: "#2B3176",
                        fontWeight: "600",
                        fontSize: "0.95rem",
                        lineHeight: "1.4",
                      }}
                    >
                      {q.questionText}
                    </span>
                  </div>

                  <Row className="g-2 g-md-3">
                    {randomizedOptions.map((option, optIdx) => {
                      const isSelected = selectedValue === option;
                      return (
                        <Col key={`${qId}-${optIdx}`} xs={12} md={6}>
                          <div
                            onClick={() => handleAnswerChange(qId, option)}
                            className="d-flex align-items-center p-3 rounded-3"
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleAnswerChange(qId, option);
                              }
                            }}
                            style={{
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              backgroundColor: isSelected
                                ? `${currentGroup.color}10`
                                : "white",
                              border: `1.5px solid ${
                                isSelected ? currentGroup.color : "#D1D5DB"
                              }`,
                              boxShadow: isSelected
                                ? `0 2px 8px ${currentGroup.color}20`
                                : "none",
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.backgroundColor =
                                  "#f8f9fa";
                                e.currentTarget.style.borderColor =
                                  currentGroup.color;
                                e.currentTarget.style.boxShadow =
                                  "0 2px 8px rgba(0,0,0,0.06)";
                                e.currentTarget.style.transform =
                                  "translateY(-1px)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.backgroundColor =
                                  "white";
                                e.currentTarget.style.borderColor = "#D1D5DB";
                                e.currentTarget.style.boxShadow = "none";
                                e.currentTarget.style.transform =
                                  "translateY(0)";
                              }
                            }}
                          >
                            <div
                              className="d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                              style={{
                                width: "24px",
                                height: "24px",
                              }}
                            >
                              {isSelected ? (
                                <CheckCircle2
                                  size={22}
                                  style={{ color: currentGroup.color }}
                                />
                              ) : (
                                <Circle
                                  size={22}
                                  style={{ color: "#D1D5DB" }}
                                />
                              )}
                            </div>
                            <span
                              style={{
                                fontSize: "0.9rem",
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
                </Col>
              );
            })}
          </Row>
        </div>

        {/* Tip */}
        {!sectionCompleted && (
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
              Complete each category to unlock the next one.
            </p>
          </div>
        )}
      </Card.Body>

      {/* Assessment Action Footer - only shows when complete */}
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
    </Card>
  );
};

export default FoundationalAssessmentSection;