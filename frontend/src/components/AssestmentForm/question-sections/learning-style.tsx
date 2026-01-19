// Updated LearningStyleSection.tsx with validation hook integration

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

  // Initialize the validation hook
  const { validateSection } = useAssessmentValidation({
    formData,
    section: "learningWorkStyle",
    currentQuestions: questions as Question[],
    setCurrentQuestionIndex: (index) => {
      // Scroll to the specific category group
      const categoryIndex = getCategoryIndexForQuestion(index);
      if (categoryIndex !== -1) {
        setActiveGroup(categoryIndex);
      }
    },
    categoryTitles: {
      learningWorkStyle: "Learning & Work Style",
    },
  });

  // Helper function to find which category a question belongs to
  const getCategoryIndexForQuestion = (questionIndex: number) => {
    if (questionIndex < 0 || questionIndex >= questions.length) return -1;

    const question = questions[questionIndex];
    const subCategory = question.subCategory;

    const categoryOrder = [
      "Learning Preferences",
      "Work Style Preferences",
      "Financial & Time Resources",
      "Career Goals & Logistics",
    ];

    return categoryOrder.findIndex((cat) => cat === subCategory);
  };

  // Group questions by their subCategory field
  const questionGroups: QuestionGroup[] = useMemo(() => {
    const groups: Record<string, Question[]> = {};

    // First, organize questions by their subCategory
    questions.forEach((question) => {
      const subCategory = question.subCategory || "Uncategorized";
      if (!groups[subCategory]) {
        groups[subCategory] = [];
      }
      groups[subCategory].push(question as Question);
    });

    // Define the order and configuration for each category
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

    // Convert to array in the correct order
    return Object.entries(categoryConfig).map(([category, config]) => ({
      category,
      icon: config.icon,
      color: config.color,
      description: config.description,
      questions: groups[category] || [], // Get questions for this category, or empty array if none
    }));
  }, [questions]);

  // Check if at least one question is answered in each category
  const checkCategoryCompletion = () => {
    const incompleteCategories: string[] = [];

    questionGroups.forEach((group) => {
      // Instead of === true, check for truthy value
      const hasAnswerInCategory = group.questions.some(
        (q) => !!formData.learningWorkStyle[q.questionText], // Convert to boolean
      );

      if (!hasAnswerInCategory && group.questions.length > 0) {
        incompleteCategories.push(group.category);
      }
    });

    setValidationErrors(incompleteCategories);
    return incompleteCategories;
  };

  // Check if a specific group is complete
  const isGroupComplete = (groupIndex: number) => {
    const group = questionGroups[groupIndex];
    return group.questions.some(
      (q) => !!formData.learningWorkStyle[q.questionText], // Truthy check
    );
  };

  // Get completion status for display
  const getCompletionStatus = () => {
    const totalGroups = questionGroups.length;
    const completedGroups = questionGroups.filter((_, idx) =>
      isGroupComplete(idx),
    ).length;
    return { completedGroups, totalGroups };
  };

  // Handle checkbox change with validation update
  const handleCheckboxChange = (question: Question, checked: boolean) => {
    onChange(
      "learningWorkStyle",
      question.questionText,
      checked,
      question.program,
    );

    // Clear validation error for this category if user selects something
    if (checked) {
      const category = question.subCategory || "Uncategorized";
      setValidationErrors((prev) => prev.filter((cat) => cat !== category));
    }
  };

  // Handle next button click with validation
  const handleNextWithValidation = () => {
    const incompleteCategories = checkCategoryCompletion();

    if (incompleteCategories.length > 0) {
      // Use the validation hook's toast notification
      const isValid = validateSection();
      if (!isValid) {
        return; // Don't proceed if validation fails
      }
    }

    onNext();
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
        marginTop: "50px",
        marginBottom: "50px",
      }}
    >
      <SectionHeader
        icon={<BrainCircuit />}
        sectionType="learningWorkStyle"
        title="Learning & Work Style"
        variant="warning"
      />

      <Card.Body className="p-4 p-md-5">
        {/* Progress and Validation Alert */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h5 className="mb-1">
                Progress: {completedGroups} of {totalGroups} categories complete
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                Please select at least one option from each category
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
            <Alert variant="warning" className="mt-3">
              <div className="d-flex align-items-center">
                <Circle size={20} className="me-2" />
                <div>
                  <strong>Please complete these categories:</strong>
                  <ul className="mb-0 mt-1">
                    {validationErrors.map((category, idx) => (
                      <li key={idx}>{category}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Alert>
          )}
        </div>

        {/* Category Navigation Tabs */}
        <Row className="mb-4">
          {questionGroups.map((group, idx) => {
            const isComplete = isGroupComplete(idx);
            const isActive = activeGroup === idx;
            const isIncomplete = validationErrors.includes(group.category);

            return (
              <Col key={idx} xs={6} lg={3} className="mb-3">
                <button
                  onClick={() => {
                    setActiveGroup(idx);
                    setValidationErrors([]); // Clear errors when switching tabs
                  }}
                  style={{
                    width: "100%",
                    padding: "16px",
                    border: `2px solid ${
                      isIncomplete
                        ? "#dc3545"
                        : isActive
                          ? group.color
                          : isComplete
                            ? `${group.color}80`
                            : "#e0e0e0"
                    }`,
                    borderRadius: "12px",
                    background: isActive
                      ? `linear-gradient(135deg, ${group.color}10 0%, ${group.color}05 100%)`
                      : isComplete
                        ? `linear-gradient(135deg, ${group.color}05 0%, ${group.color}02 100%)`
                        : "white",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = group.color;
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = isComplete
                        ? `${group.color}80`
                        : "#e0e0e0";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "8px" }}>
                    {group.icon}
                  </div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      color: isActive
                        ? group.color
                        : isComplete
                          ? `${group.color}99`
                          : "#666",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {group.category}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: isComplete ? "#28a745" : "#999",
                      marginTop: "4px",
                    }}
                  >
                    {isComplete
                      ? "Complete"
                      : `${group.questions.length} questions`}
                  </div>
                  {isComplete && (
                    <CheckCircle2
                      size={20}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        color: group.color,
                      }}
                    />
                  )}
                  {isIncomplete && (
                    <Circle
                      size={20}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        color: "#dc3545",
                      }}
                    />
                  )}
                </button>
              </Col>
            );
          })}
        </Row>

        {/* Current Category Card */}
        <div
          style={{
            background: `linear-gradient(135deg, ${currentGroup.color}08 0%, ${currentGroup.color}03 100%)`,
            borderRadius: "16px",
            padding: "32px",
            border: `2px solid ${currentGroup.color}30`,
            position: "relative",
          }}
        >
          {/* Category Header */}
          <div className="text-center mb-4">
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>
              {currentGroup.icon}
            </div>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "800",
                color: currentGroup.color,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {currentGroup.category}
              {validationErrors.includes(currentGroup.category) && (
                <span
                  style={{
                    color: "#dc3545",
                    fontSize: "0.8rem",
                    marginLeft: "8px",
                  }}
                >
                  (Required)
                </span>
              )}
            </h3>
            <p style={{ color: "#666", fontSize: "1rem", marginBottom: 0 }}>
              {currentGroup.description}
            </p>
            <small style={{ color: "#999", fontSize: "0.85rem" }}>
              Select at least one option that applies to you
            </small>
          </div>

          {/* Checkbox Questions from Backend */}
          <Row>
            {currentGroup.questions.map((question, idx) => {
              const isChecked =
                !!formData.learningWorkStyle[question.questionText];
              return (
                <Col key={idx} md={6} className="mb-3">
                  <label
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      padding: "16px 20px",
                      border: `2px solid ${isChecked ? currentGroup.color : "#e0e0e0"}`,
                      borderRadius: "12px",
                      background: isChecked
                        ? `${currentGroup.color}10`
                        : "white",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      minHeight: "70px",
                    }}
                    onMouseEnter={(e) => {
                      if (!isChecked) {
                        e.currentTarget.style.borderColor = currentGroup.color;
                        e.currentTarget.style.transform = "translateX(4px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isChecked) {
                        e.currentTarget.style.borderColor = "#e0e0e0";
                        e.currentTarget.style.transform = "translateX(0)";
                      }
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
                    <div style={{ marginTop: "2px", flexShrink: 0 }}>
                      {isChecked ? (
                        <CheckCircle2
                          size={24}
                          style={{ color: currentGroup.color }}
                        />
                      ) : (
                        <Circle size={24} style={{ color: "#ccc" }} />
                      )}
                    </div>
                    <span
                      style={{
                        flex: 1,
                        fontSize: "0.95rem",
                        color: isChecked ? "#333" : "#666",
                        fontWeight: isChecked ? "600" : "400",
                        lineHeight: "1.4",
                      }}
                    >
                      {question.questionText}
                      {currentGroup.category === "Career Goals & Logistics" &&
                        question.program && (
                          <small
                            style={{
                              color: "#888",
                              fontSize: "0.85rem",
                              display: "block",
                              marginTop: "4px",
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

      {/* Footer - Original Assessment Actions */}
      <AssessmentActionFooter
        currentSection={currentSection}
        totalSections={totalSections}
        onPrevious={onPrevious}
        onNext={handleNextWithValidation} // Use validated next handler
        onReset={onReset}
        isLastSection={currentSection === totalSections - 1}
        isComplete={isSectionComplete} // Only complete when all 4 categories have at least one answer
        nextLabel={
          currentSection === totalSections - 1
            ? isSectionComplete
              ? "Finish Assessment"
              : "Complete All Categories First"
            : isSectionComplete
              ? "Next Section →"
              : "Complete All Categories First"
        }
      />
    </Card>
  );
};

export default LearningStyleSection;
