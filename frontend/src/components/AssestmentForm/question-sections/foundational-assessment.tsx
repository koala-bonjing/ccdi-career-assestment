import React, { useState, useMemo, useEffect } from "react";
import { Card, Row, Col, ProgressBar } from "react-bootstrap";
import {
  CheckCircle2,
  Circle,
  GraduationCap,
  ClipboardList,
  BrainCircuit,
  Info,
} from "lucide-react";
import SectionHeader from "../section-header";
import AssessmentActionFooter from "../assessment-action-footer";
import { useAssessmentValidation } from "../../../hooks/useAssessmentValidation";
import type { AssessmentSectionProps } from "../types";
import { type Question } from "./../../../hooks/useAssessmentQuestions";
import "./FoundationalAssessment.css";

interface QuestionGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  questions: Question[];
}

interface chartConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

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
  setCurrentQuestionIndex,
}) => {
  const [activeGroup, setActiveGroup] = useState(0);
  const [shuffledOptionsMap, setShuffledOptionsMap] = useState<
    Record<string, string[]>
  >({});

  // 1. Initialize Shuffled Options - use the same ID logic as below
  useEffect(() => {
    const newShuffledOptionsMap: Record<string, string[]> = {};
    questions.forEach((q) => {
      // ✅ Crucial: Use fallback if _id is missing
      const qKey = q._id || q.questionText;
      if (q.options && q.options.length > 0) {
        newShuffledOptionsMap[qKey] = shuffleArray(q.options);
      }
    });
    setShuffledOptionsMap(newShuffledOptionsMap);
  }, [questions]);

  // 2. Progress Calculation - use fallback ID
  const calculateProgress = () => {
    if (!questions || questions.length === 0) return 0;
    const answeredCount = questions.filter((q) => {
      const qId = q._id || q.questionText;
      return !!formData.foundationalAssessment[qId];
    }).length;
    return Math.round((answeredCount / questions.length) * 100);
  };

  const categoryConfig: Record<string, chartConfig> = {
    prerequisites: {
      label: "Basic Skills",
      icon: <GraduationCap size={24} />,
      color: "#2B3176",
      description: "Math, English, and Computer Literacy.",
    },
    studyHabits: {
      label: "Habits",
      icon: <ClipboardList size={24} />,
      color: "#EC2326",
      description: "Your approach to learning.",
    },
    problemSolving: {
      label: "Logic",
      icon: <BrainCircuit size={24} />,
      color: "#28a745",
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

  const { validateSection } = useAssessmentValidation({
    formData,
    section: "foundationalAssessment",
    currentQuestions: questions as Question[],
    categoryTitles: { foundationalAssessment: "Foundational Assessment" },
    setCurrentQuestionIndex: (index) => {
      const question = questions[index];
      const subCategory = (question as Question).subCategory || "prerequisites";
      const groupIndex = questionGroups.findIndex((g) => g.id === subCategory);
      if (groupIndex !== -1) setActiveGroup(groupIndex);
      setCurrentQuestionIndex?.(index);
    },
  });

  // 3. Group completion - use fallback ID
  const isGroupComplete = (groupIndex: number) => {
    const group = questionGroups[groupIndex];
    return (
      group.questions.length > 0 &&
      group.questions.every((q) => {
        const qId = q._id || q.id || q.questionText;
        return !!formData.foundationalAssessment[qId];
      })
    );
  };

  const currentGroup = questionGroups[activeGroup];
  const progressPercent = calculateProgress();
  const isSectionComplete = progressPercent === 100;

  useEffect(() => {
    console.log(
      "Current foundational answers:",
      formData.foundationalAssessment,
    );
  }, [formData]);

  return (
    <Card className="assessment-card shadow-lg mx-auto">
      <SectionHeader
        icon={<BrainCircuit size={40} />}
        sectionType="foundationalAssessment"
        title="Foundational Assessment"
        variant="primary"
      />

      <Card.Body className="p-3 p-md-5">
        <div className="progress-container">
          <div className="d-flex justify-content-between align-items-end mb-2">
            <div className="progress-header">
              <h5 className="fw-bold mb-0">Foundational Readiness</h5>
            </div>
            <div className="text-end">
              <span className="fw-bold" style={{ color: "#2B3176" }}>
                {progressPercent}%
              </span>
            </div>
          </div>
          <ProgressBar
            now={progressPercent}
            variant={isSectionComplete ? "success" : "primary"}
            style={{ height: "8px", borderRadius: "4px" }}
          />
        </div>

        <Row className="mb-4 g-2">
          {questionGroups.map((group, idx) => (
            <Col key={group.id} xs={4}>
              <button
                onClick={() => setActiveGroup(idx)}
                className={`tab-button ${activeGroup === idx ? "active" : ""}`}
                style={
                  { "--category-color": group.color } as React.CSSProperties
                }
              >
                <div className="tab-icon">{group.icon}</div>
                <div className="tab-label d-none d-md-block">{group.label}</div>
                {isGroupComplete(idx) && (
                  <CheckCircle2
                    size={16}
                    className="text-success position-absolute"
                    style={{ top: "5px", right: "5px" }}
                  />
                )}
              </button>
            </Col>
          ))}
        </Row>

        <div
          className="content-area"
          style={
            { "--category-color": currentGroup.color } as React.CSSProperties
          }
        >
          <div className="mb-4 text-center">
            <h4 className="fw-bold" style={{ color: currentGroup.color }}>
              {currentGroup.label}
            </h4>
            <p className="text-muted small">{currentGroup.description}</p>
          </div>

          <Row className="g-4">
            {currentGroup.questions.map((q, qIdx) => {
              // ✅ FIX: NEVER use just q._id here if it might be undefined.
              // Fallback to questionText ensures unique keys for every question.
              const qId = q._id;

              const selectedValue = formData.foundationalAssessment[qId];
              const randomizedOptions =
                shuffledOptionsMap[qId] || q.options || [];

              return (
                <Col key={qId} xs={12}>
                  <div className="question-text mb-2">
                    <span className="question-number badge rounded-circle bg-light text-dark border-2 me-2">
                      {qIdx + 1}
                    </span>
                    {q.questionText}
                  </div>

                  {q.helperText && (
                    <div className="small text-muted mb-3 ps-4">
                      <Info size={14} className="me-1" />
                      <i>{q.helperText}</i>
                    </div>
                  )}

                  <Row className="g-2 g-md-3">
                    {randomizedOptions.map((option, optIdx) => (
                      <Col key={`${qId}-${optIdx}`} xs={12} md={6}>
                        <div
                          // ✅ Send the reliable qId to the backend
                          onClick={() =>
                            onChange("foundationalAssessment", qId, option)
                          }
                          className={`option-card ${selectedValue === option ? "selected" : ""}`}
                        >
                          <div className="option-content">
                            <div className="status-icon">
                              {selectedValue === option ? (
                                <CheckCircle2 size={20} />
                              ) : (
                                <Circle size={20} />
                              )}
                            </div>
                            <span className="option-text">{option}</span>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Col>
              );
            })}
          </Row>
        </div>
      </Card.Body>

      <AssessmentActionFooter
        currentSection={currentSection}
        totalSections={totalSections}
        onPrevious={onPrevious}
        onNext={() => validateSection() && onNext()}
        onReset={onReset}
        isLastSection={false}
        isComplete={isSectionComplete}
      />
    </Card>
  );
};

export default FoundationalAssessmentSection;
