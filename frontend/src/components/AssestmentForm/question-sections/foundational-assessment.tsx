import React, { useState, useMemo } from "react";
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

interface QuestionGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  questions: Question[];
}

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

  // 1. Logic to calculate completion percentage
  const calculateProgress = () => {
    if (!questions || questions.length === 0) return 0;

    // Count how many of the questions in this section have a value in formData
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
      description: "Math, English, and Basic Computer Literacy.",
    },
    studyHabits: {
      label: "Study Habits",
      icon: <ClipboardList size={24} />,
      color: "#EC2326",
      description: "Your schedule, environment, and how you approach learning.",
    },
    problemSolving: {
      label: "Logic & Puzzles",
      icon: <BrainCircuit size={24} />,
      color: "#28a745",
      description: "Simple logical challenges to see how you think.",
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
      label: categoryConfig[key].label,
      icon: categoryConfig[key].icon,
      color: categoryConfig[key].color,
      description: categoryConfig[key].description,
      questions: groups[key] || [],
    }));
  }, [questions]);

  const { validateSection } = useAssessmentValidation({
    formData,
    section: "foundationalAssessment",
    currentQuestions: questions as Question[],
    categoryTitles: { foundationalAssessment: "Foundational Assessment" },
    setCurrentQuestionIndex: (index) => {
      // 1. Find which category/tab the question belongs to
      const question = questions[index];
      const subCategory = (question as Question).subCategory || "prerequisites";

      // 2. Switch the active tab automatically if an error is found there
      const groupIndex = questionGroups.findIndex((g) => g.id === subCategory);
      if (groupIndex !== -1) {
        setActiveGroup(groupIndex);
      }

      // 3. Call the parent's setter to handle the index state
      setCurrentQuestionIndex?.(index);
    },
  });

  const isGroupComplete = (groupIndex: number) => {
    const group = questionGroups[groupIndex];
    if (group.questions.length === 0) return true;
    return group.questions.every(
      (q) => !!formData.foundationalAssessment[q.questionText],
    );
  };

  const handleNextWithValidation = () => {
    const isValid = validateSection();
    if (isValid) onNext();
  };

  const currentGroup = questionGroups[activeGroup];
  const progressPercent = calculateProgress();
  const isSectionComplete = progressPercent === 100;

  return (
    <Card
      className="border-0 shadow-lg w-100 mt-5 mb-5"
      style={{ maxWidth: "1200px", borderRadius: "16px" }}
    >
      <SectionHeader
        icon={<BrainCircuit />}
        sectionType="foundationalAssessment"
        title="Foundational Assessment"
        variant="primary"
      />

      <Card.Body className="p-4 p-md-5">
        {/* Visual Progress Bar */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-end mb-2">
            <div>
              <h5 className="fw-bold mb-0">Foundational Readiness</h5>
              <small className="text-muted">
                Answer all questions to unlock the next section
              </small>
            </div>
            <div className="text-end">
              <span className="fw-bold" style={{ color: "#2B3176" }}>
                {progressPercent}% Complete
              </span>
            </div>
          </div>
          <ProgressBar
            now={progressPercent}
            variant={isSectionComplete ? "success" : "primary"}
            style={{ height: "10px", borderRadius: "5px" }}
            animated={!isSectionComplete}
          />
        </div>

        {/* Tab Navigation */}
        <Row className="mb-4 g-2">
          {questionGroups.map((group, idx) => {
            const isActive = activeGroup === idx;
            const complete = isGroupComplete(idx);
            return (
              <Col key={group.id} xs={4}>
                <button
                  onClick={() => setActiveGroup(idx)}
                  className="w-100 p-3 border-0 transition-all"
                  style={{
                    borderRadius: "12px",
                    background: isActive ? `${group.color}15` : "white",
                    border: `2px solid ${isActive ? group.color : "#eee"}`,
                    transition: "0.3s ease",
                    position: "relative",
                  }}
                >
                  <div style={{ color: isActive ? group.color : "#999" }}>
                    {group.icon}
                  </div>
                  <div
                    className="mt-2 fw-bold text-uppercase d-none d-md-block"
                    style={{
                      fontSize: "0.7rem",
                      color: isActive ? group.color : "#666",
                    }}
                  >
                    {group.label}
                  </div>
                  {complete && (
                    <CheckCircle2
                      size={16}
                      className="text-success position-absolute"
                      style={{ top: "8px", right: "8px" }}
                    />
                  )}
                </button>
              </Col>
            );
          })}
        </Row>

        {/* Content Area */}
        <div
          className="p-4 rounded-4"
          style={{
            background: `linear-gradient(135deg, ${currentGroup.color}05 0%, #ffffff 100%)`,
            border: `1px solid ${currentGroup.color}20`,
            minHeight: "400px",
          }}
        >
          <div className="mb-4 text-center">
            <h4 className="fw-bold" style={{ color: currentGroup.color }}>
              {currentGroup.label}
            </h4>
            <p className="text-muted">{currentGroup.description}</p>
          </div>

          <Row className="g-4">
            {currentGroup.questions.map((q, qIdx) => {
              const selectedValue =
                formData.foundationalAssessment[q.questionText];
              return (
                <Col key={qIdx} xs={12}>
                  <div className="mb-2 fw-bold d-flex align-items-center gap-2">
                    <span className="badge rounded-circle bg-light text-dark border">
                      {qIdx + 1}
                    </span>
                    {q.questionText}
                  </div>

                  {q.helperText && (
                    <div className="small text-muted mb-3 d-flex align-items-start gap-1">
                      <Info size={14} className="mt-1 flex-shrink-0" />
                      <i>{q.helperText}</i>
                    </div>
                  )}

                  <Row className="g-3">
                    {q.options?.map((option, optIdx) => (
                      <Col key={optIdx} md={6}>
                        <div
                          onClick={() =>
                            onChange(
                              "foundationalAssessment",
                              q.questionText,
                              option,
                            )
                          }
                          className="p-3 rounded-3 transition-all h-100"
                          style={{
                            cursor: "pointer",
                            border: `2px solid ${selectedValue === option ? currentGroup.color : "#eee"}`,
                            background:
                              selectedValue === option
                                ? `${currentGroup.color}08`
                                : "white",
                            boxShadow:
                              selectedValue === option
                                ? `0 4px 12px ${currentGroup.color}15`
                                : "none",
                          }}
                        >
                          <div className="d-flex align-items-center gap-3">
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
                            <span
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
        onNext={handleNextWithValidation}
        onReset={onReset}
        isLastSection={false}
        // 2. Added the requested logic here
        isComplete={isSectionComplete}
      />
    </Card>
  );
};

export default FoundationalAssessmentSection;
