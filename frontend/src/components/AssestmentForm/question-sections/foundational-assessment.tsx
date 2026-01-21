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

// Fisher-Yates shuffle algorithm for randomizing arrays
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

  useEffect(() => {
    const newShuffledOptionsMap: Record<string, string[]> = {};
    questions.forEach((q) => {
      if (q.options && q.options.length > 0) {
        const questionKey = `${q.questionText}-${q.subCategory || "default"}`;
        newShuffledOptionsMap[questionKey] = shuffleArray(q.options);
      }
    });
    setShuffledOptionsMap(newShuffledOptionsMap);
  }, [questions]);

  const calculateProgress = () => {
    if (!questions || questions.length === 0) return 0;
    const answeredCount = questions.filter(
      (q) => !!formData.foundationalAssessment[q.questionText],
    ).length;
    return Math.round((answeredCount / questions.length) * 100);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categoryConfig: Record<string, any> = {
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

  const isGroupComplete = (groupIndex: number) => {
    const group = questionGroups[groupIndex];
    return (
      group.questions.length > 0 &&
      group.questions.every(
        (q) => !!formData.foundationalAssessment[q.questionText],
      )
    );
  };

  const currentGroup = questionGroups[activeGroup];
  const progressPercent = calculateProgress();
  const isSectionComplete = progressPercent === 100;

    

  return (
    <Card className="assessment-card shadow-lg mx-auto">
      <SectionHeader
        icon={<BrainCircuit size={40}/>}
        sectionType="foundationalAssessment"
        title="Foundational Assessment"
        variant="primary"
      />

      <Card.Body className="p-3 p-md-5">
        {/* Progress Bar */}
        <div className="progress-container">
          <div className="d-flex justify-content-between align-items-end mb-2">
            <div className="progress-header">
              <h5 className="fw-bold mb-0">Foundational Readiness</h5>
              <small className="text-muted d-none d-sm-block">
                Answer all questions to proceed
              </small>
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
            animated={!isSectionComplete}
          />
        </div>

        {/* Tab Navigation */}
        <Row className="mb-4 g-2">
          {questionGroups.map((group, idx) => (
            <Col key={group.id} xs={4}>
              <button
                onClick={() => setActiveGroup(idx)}
                className={`tab-button ${activeGroup === idx ? "active" : ""}`}
                style={
                  {
                    "--category-color": group.color,
                    "--bg-active": `${group.color}15`,
                  } as React.CSSProperties
                }
              >
                <div
                  className="tab-icon"
                  style={{ color: activeGroup === idx ? group.color : "#999" }}
                >
                  {group.icon}
                </div>
                <div
                  className="tab-label d-none d-md-block"
                  style={{ color: activeGroup === idx ? group.color : "#666" }}
                >
                  {group.label}
                </div>
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

        {/* Content Area */}
        <div
          className="content-area"
          style={
            {
              "--category-color": currentGroup.color,
              "--border-color": `${currentGroup.color}20`,
              "--bg-gradient": `${currentGroup.color}05`,
            } as React.CSSProperties
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
              const selectedValue =
                formData.foundationalAssessment[q.questionText];
              const questionKey = `${q.questionText}-${q.subCategory || "default"}`;
              const randomizedOptions =
                shuffledOptionsMap[questionKey] || q.options || [];

              return (
                <Col key={qIdx} xs={12}>
                  <div className="question-text mb-2">
                    <span className="question-number badge rounded-circle bg-light text-dark border">
                      {qIdx + 1}
                    </span>
                    {q.questionText}
                  </div>

                  {q.helperText && (
                    <div className="small text-muted mb-3 d-flex align-items-start gap-1 ps-4">
                      <Info size={14} className="mt-1 flex-shrink-0" />
                      <i>{q.helperText}</i>
                    </div>
                  )}

                  <Row className="g-2 g-md-3">
                    {randomizedOptions.map((option, optIdx) => (
                      <Col key={optIdx} xs={12} md={6}>
                        <div
                          onClick={() =>
                            onChange(
                              "foundationalAssessment",
                              q.questionText,
                              option,
                            )
                          }
                          className={`option-card ${selectedValue === option ? "selected" : ""}`}
                          style={
                            {
                              "--category-color": currentGroup.color,
                              "--bg-selected": `${currentGroup.color}08`,
                              "--shadow-color": `${currentGroup.color}15`,
                            } as React.CSSProperties
                          }
                        >
                          <div className="option-content">
                            <div className="status-icon">
                              {selectedValue === option ? (
                                <CheckCircle2
                                  size={20}
                                  style={{ color: currentGroup.color }}
                                />
                              ) : (
                                <Circle
                                  size={20}
                                  className="text-light-emphasis"
                                />
                              )}
                            </div>
                            <span
                              className="option-text"
                              style={{
                                fontWeight:
                                  selectedValue === option ? "600" : "400",
                              }}
                            >
                              {option}
                            </span>
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
