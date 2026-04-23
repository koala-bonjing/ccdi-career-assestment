import React, { useState, useMemo, useEffect } from "react";
import { Card, Row, Col, Form, Alert, Badge } from "react-bootstrap";
import {
  CheckCircle2,
  Circle,
  BrainCircuit,
  BookOpen,
  Briefcase,
  Wallet,
  Target,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import SectionHeader from "../section-header";
import AssessmentActionFooter from "../assessment-action-footer";
import { useAssessmentValidation } from "../../../hooks/useAssessmentValidation";
import type { AssessmentSectionProps } from "../types";
import type { Question } from "../../../types";

interface QuestionGroup {
  category: string;
  icon: LucideIcon;
  color: string;
  description: string;
  questions: Question[];
}

// Central mapping of known subCategory values to display properties
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
    color: "#28a745",
    description:
      "Your long‑term plans: management roles, licensure, entry‑level work, or further education.",
  },
  // Optional fallback for any new categories
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Build groups dynamically from actual subCategory values in the data
  const questionGroups: QuestionGroup[] = useMemo(() => {
    const groupsMap = new Map<string, Question[]>();

    // Group questions by subCategory (default to "Uncategorized" if missing)
    questions.forEach((question) => {
      const subCat = question.subCategory || "Uncategorized";
      if (!groupsMap.has(subCat)) groupsMap.set(subCat, []);
      groupsMap.get(subCat)!.push(question as Question);
    });

    // Convert to array of QuestionGroup, using mapping or generic fallback
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

  // Validation uses the same dynamic groups
  const { validateSection } = useAssessmentValidation({
    formData,
    section: "learningWorkStyle",
    currentQuestions: questions as Question[],
    setCurrentQuestionIndex: (index) => {
      // Find which group contains the question at this index
      let cumulative = 0;
      for (let i = 0; i < questionGroups.length; i++) {
        const group = questionGroups[i];
        if (
          index >= cumulative &&
          index < cumulative + group.questions.length
        ) {
          setActiveGroup(i);
          break;
        }
        cumulative += group.questions.length;
      }
    },
    categoryTitles: { learningWorkStyle: "Learning & Work Style" },
  });

  const isGroupComplete = (group: QuestionGroup) => {
    return group.questions.some(
      (q) => !!formData.learningWorkStyle[q.questionText],
    );
  };

  const getCompletionStatus = () => {
    const totalGroups = questionGroups.length;
    const completedGroups = questionGroups.filter(isGroupComplete).length;
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

  const tabIconSize = isMobile ? 24 : 32;
  const headerIconSize = isMobile ? 32 : 48;
  const checkboxIconSize = 22;

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
        {/* Progress Section */}
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
                <Circle
                  size={18}
                  className="me-2 mt-1 flex-shrink-0"
                  aria-hidden="true"
                />
                <div style={{ fontSize: "0.9rem" }}>
                  <strong>Required Categories:</strong>{" "}
                  {validationErrors.join(", ")}
                </div>
              </div>
            </Alert>
          )}
        </div>

        {/* Category Navigation Tabs */}
        <Row className="mb-4 g-2">
          {questionGroups.map((group, idx) => {
            const IconComponent = group.icon;
            const isComplete = isGroupComplete(group);
            const isActive = activeGroup === idx;
            const isIncomplete = validationErrors.includes(group.category);

            return (
              <Col key={idx} xs={6} lg={Math.floor(12 / questionGroups.length)}>
                <button
                  onClick={() => {
                    setActiveGroup(idx);
                    setValidationErrors([]);
                  }}
                  style={{
                    width: "100%",
                    padding: isMobile ? "10px 5px" : "16px",
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
                    background: isActive ? `${group.color}10` : "white",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    position: "relative",
                    minHeight: isMobile ? "90px" : "auto",
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
                    <IconComponent
                      size={tabIconSize}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
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
                      aria-hidden="true"
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
            background: `linear-gradient(135deg, ${currentGroup.color}08 0%, #ffffff 100%)`,
            borderRadius: "16px",
            padding: isMobile ? "20px 15px" : "32px",
            border: `2px solid ${currentGroup.color}20`,
          }}
        >
          <div className="text-center mb-4">
            <div
              style={{
                marginBottom: "8px",
                color: currentGroup.color,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <currentGroup.icon
                size={headerIconSize}
                strokeWidth={2}
                aria-hidden="true"
              />
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

                    <div
                      style={{
                        flexShrink: 0,
                        marginTop: "2px",
                        color: isChecked ? currentGroup.color : "#ccc",
                      }}
                    >
                      {isChecked ? (
                        <CheckCircle2
                          size={checkboxIconSize}
                          aria-hidden="true"
                        />
                      ) : (
                        <Circle size={checkboxIconSize} aria-hidden="true" />
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
