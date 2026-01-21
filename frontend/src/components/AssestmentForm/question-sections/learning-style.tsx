// Updated LearningStyleSection.tsx with Responsive UX Fixes

import React, { useState, useMemo } from "react";
import { Card, Row, Col, Form, Alert, Badge } from "react-bootstrap";
import { CheckCircle2, Circle, BrainCircuit } from "lucide-react";
import SectionHeader from "../section-header";
import AssessmentActionFooter from "../assessment-action-footer";
import { useAssessmentValidation } from "../../../hooks/useAssessmentValidation";
import type { AssessmentSectionProps } from "../types";
import type { Question } from "../../../types";

interface QuestionGroup {
  category: string;
  icon: string;
  color: string;
  description: string;
  questions: Question[];
}

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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Responsiveness Helper (Simplified for inline usage)
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const { validateSection } = useAssessmentValidation({
    formData,
    section: "learningWorkStyle",
    currentQuestions: questions as Question[],
    setCurrentQuestionIndex: (index) => {
      const categoryIndex = getCategoryIndexForQuestion(index);
      if (categoryIndex !== -1) setActiveGroup(categoryIndex);
    },
    categoryTitles: { learningWorkStyle: "Learning & Work Style" },
  });

  const getCategoryIndexForQuestion = (questionIndex: number) => {
    if (questionIndex < 0 || questionIndex >= questions.length) return -1;
    const question = questions[questionIndex];
    const categoryOrder = [
      "Learning Preferences",
      "Work Style Preferences",
      "Financial & Time Resources",
      "Career Goals & Logistics",
    ];
    return categoryOrder.findIndex((cat) => cat === question.subCategory);
  };

  const questionGroups: QuestionGroup[] = useMemo(() => {
    const groups: Record<string, Question[]> = {};
    questions.forEach((question) => {
      const subCategory = question.subCategory || "Uncategorized";
      if (!groups[subCategory]) groups[subCategory] = [];
      groups[subCategory].push(question as Question);
    });

    const categoryConfig = {
      "Learning Preferences": {
        icon: "📚",
        color: "#2B3176",
        description: "How do you prefer to learn and study?",
      },
      "Work Style Preferences": {
        icon: "💼",
        color: "#EC2326",
        description: "What type of work environment suits you?",
      },
      "Financial & Time Resources": {
        icon: "💰",
        color: "#1C6CB3",
        description: "What resources do you have available?",
      },
      "Career Goals & Logistics": {
        icon: "🎯",
        color: "#28a745",
        description: "What are your career priorities?",
      },
    };

    return Object.entries(categoryConfig).map(([category, config]) => ({
      category,
      ...config,
      questions: groups[category] || [],
    }));
  }, [questions]);

  const isGroupComplete = (groupIndex: number) => {
    const group = questionGroups[groupIndex];
    return group.questions.some(
      (q) => !!formData.learningWorkStyle[q.questionText],
    );
  };

  const getCompletionStatus = () => {
    const totalGroups = questionGroups.length;
    const completedGroups = questionGroups.filter((_, idx) =>
      isGroupComplete(idx),
    ).length;
    return { completedGroups, totalGroups };
  };

  const handleCheckboxChange = (question: Question, checked: boolean) => {
    onChange(
      "learningWorkStyle",
      question.questionText,
      checked,
      question.program,
    );
    if (checked) {
      setValidationErrors((prev) =>
        prev.filter((cat) => cat !== question.subCategory),
      );
    }
  };

  const { completedGroups, totalGroups } = getCompletionStatus();
  const currentGroup = questionGroups[activeGroup];
  const isSectionComplete = completedGroups === totalGroups;

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
        icon={<BrainCircuit size={40}/>}
        sectionType="learningWorkStyle"
        title="Learning Style & Work Interest"
        variant="warning"
      />

      <Card.Body className="p-3 p-md-5">
        {/* Progress Section - Stacked on Mobile */}
        <div className="mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-2">
            <div>
              <h5
                className="mb-1"
                style={{ fontSize: isMobile ? "1.1rem" : "1.25rem" }}
              >
                Progress: {completedGroups} of {totalGroups}
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
                Select at least one option from each category
              </p>
            </div>
            <Badge
              bg={isSectionComplete ? "success" : "warning"}
              className="fs-6 px-3 py-2"
            >
              {completedGroups}/{totalGroups} Categories
            </Badge>
          </div>

          {validationErrors.length > 0 && (
            <Alert variant="warning" className="mt-3 p-2">
              <div className="d-flex align-items-start">
                <Circle size={18} className="me-2 mt-1 flex-shrink-0" />
                <div style={{ fontSize: "0.9rem" }}>
                  <strong>Required Categories:</strong>{" "}
                  {validationErrors.join(", ")}
                </div>
              </div>
            </Alert>
          )}
        </div>

        {/* Category Navigation Tabs - Smaller padding/font on mobile */}
        <Row className="mb-4 g-2">
          {questionGroups.map((group, idx) => {
            const isComplete = isGroupComplete(idx);
            const isActive = activeGroup === idx;
            const isIncomplete = validationErrors.includes(group.category);

            return (
              <Col key={idx} xs={6} lg={3}>
                <button
                  onClick={() => {
                    setActiveGroup(idx);
                    setValidationErrors([]);
                  }}
                  style={{
                    width: "100%",
                    padding: isMobile ? "10px 5px" : "16px",
                    border: `2px solid ${isIncomplete ? "#dc3545" : isActive ? group.color : isComplete ? `${group.color}80` : "#e0e0e0"}`,
                    borderRadius: "12px",
                    background: isActive ? `${group.color}10` : "white",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    position: "relative",
                    minHeight: isMobile ? "90px" : "auto",
                  }}
                >
                  <div
                    style={{
                      fontSize: isMobile ? "1.5rem" : "2rem",
                      marginBottom: "4px",
                    }}
                  >
                    {group.icon}
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? "0.65rem" : "0.85rem",
                      fontWeight: "700",
                      color: isActive ? group.color : "#666",
                      textTransform: "uppercase",
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {group.category}
                  </div>
                  {isComplete && (
                    <CheckCircle2
                      size={16}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        color: group.color,
                      }}
                    />
                  )}
                </button>
              </Col>
            );
          })}
        </Row>

        {/* Current Category Card - Adjusted padding for mobile */}
        <div
          style={{
            background: `linear-gradient(135deg, ${currentGroup.color}08 0%, #ffffff 100%)`,
            borderRadius: "16px",
            padding: isMobile ? "20px 15px" : "32px",
            border: `2px solid ${currentGroup.color}20`,
          }}
        >
          <div className="text-center mb-4">
            <div
              style={{
                fontSize: isMobile ? "2rem" : "3rem",
                marginBottom: "8px",
              }}
            >
              {currentGroup.icon}
            </div>
            <h4
              style={{
                color: currentGroup.color,
                fontWeight: "800",
                textTransform: "uppercase",
                fontSize: isMobile ? "1.2rem" : "1.5rem",
              }}
            >
              {currentGroup.category}
            </h4>
            <p className="text-muted small px-2">{currentGroup.description}</p>
          </div>

          <Row className="g-2 g-md-3">
            {currentGroup.questions.map((question, idx) => {
              const isChecked =
                !!formData.learningWorkStyle[question.questionText];
              return (
                <Col key={idx} xs={12} md={6}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      padding: isMobile ? "12px" : "16px 20px",
                      border: `2px solid ${isChecked ? currentGroup.color : "#e0e0e0"}`,
                      borderRadius: "12px",
                      background: isChecked
                        ? `${currentGroup.color}08`
                        : "white",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      minHeight: "60px",
                      width: "100%",
                    }}
                  >
                    <Form.Check
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        handleCheckboxChange(question, e.target.checked)
                      }
                      style={{ display: "none" }}
                    />

                    {/* FIXED: Checkbox doesn't shrink on mobile */}
                    <div style={{ flexShrink: 0, marginTop: "2px" }}>
                      {isChecked ? (
                        <CheckCircle2
                          size={22}
                          style={{ color: currentGroup.color }}
                        />
                      ) : (
                        <Circle size={22} style={{ color: "#ccc" }} />
                      )}
                    </div>

                    <span
                      style={{
                        fontSize: isMobile ? "0.85rem" : "0.95rem",
                        color: isChecked ? "#000" : "#555",
                        fontWeight: isChecked ? "600" : "400",
                        lineHeight: "1.3",
                      }}
                    >
                      {question.questionText}
                      {currentGroup.category === "Career Goals & Logistics" &&
                        question.program && (
                          <small
                            style={{
                              color: "#888",
                              display: "block",
                              marginTop: "2px",
                              fontSize: "0.75rem",
                            }}
                          >
                            {question.program}
                          </small>
                        )}
                    </span>
                  </label>
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
        onNext={() => (validateSection() ? onNext() : null)}
        onReset={onReset}
        isLastSection={currentSection === totalSections - 1}
        isComplete={isSectionComplete}
        nextLabel={
          isSectionComplete
            ? currentSection === totalSections - 1
              ? "Finish"
              : "Next Section →"
            : "Select Options First"
        }
      />
    </Card>
  );
};

export default LearningStyleSection;
