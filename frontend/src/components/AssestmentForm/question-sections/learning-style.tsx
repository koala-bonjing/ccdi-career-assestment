import React, { useState, useMemo, useEffect } from "react";
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
  const [quizIndex, setQuizIndex] = useState(0); // Question index within current group
  const [isMobile, setIsMobile] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<"left" | "right" | null>(null);
  const [showCategoryIntro, setShowCategoryIntro] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show category intro when switching groups
  useEffect(() => {
    setShowCategoryIntro(true);
    setQuizIndex(0);
    const timer = setTimeout(() => {
      setShowCategoryIntro(false);
    }, 2000); // Show intro for 2 seconds
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

  // Calculate progress
  const calculateProgress = () => {
    const answered = questions.filter(
      (q) => typeof formData.learningWorkStyle[q.questionText] === "boolean",
    ).length;
    return Math.round((answered / questions.length) * 100);
  };

  // Count Yes in current group
  const yesCountInGroup = currentGroup?.questions.filter(
    (q) => formData.learningWorkStyle[q.questionText] === true,
  ).length || 0;

  // Check if current group is complete
  const isGroupComplete = (group: QuestionGroup) => {
    return group.questions.some(
      (q) => formData.learningWorkStyle[q.questionText] === true,
    );
  };

  const isSectionComplete = questionGroups.every(isGroupComplete);

  const handleAnswer = (value: boolean) => {
    if (!currentQuestion) return;

    onChange(
      "learningWorkStyle",
      currentQuestion.questionText,
      value,
      currentQuestion.program,
    );

    // Auto-advance to next question
    setTimeout(() => {
      if (quizIndex < totalQuestionsInGroup - 1) {
        setTransitionDirection("right");
        setQuizIndex((i) => i + 1);
      } else if (activeGroup < totalGroups - 1) {
        // Move to next group
        setActiveGroup((g) => g + 1);
      }
    }, 300);
  };



 

  const currentAnswer = currentQuestion
    ? formData.learningWorkStyle[currentQuestion.questionText]
    : undefined;

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
        {/* Category Intro Animation */}
        {showCategoryIntro && (
          <div
            className="text-center mb-4"
            style={{
              animation: "fadeInScale 0.6s ease-out",
            }}
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

        {/* Progress bar */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted small">
              Question{" "}
              <strong>
                {activeGroup * totalQuestionsInGroup + quizIndex + 1}
              </strong>{" "}
              of {questions.length}
            </span>
            <div className="d-flex gap-3">
              <span className="small fw-bold" style={{ color: "#EC2326" }}>
                {yesCountInGroup} Yes in this category
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
                transition: "width 0.4s ease",
                boxShadow: isSectionComplete
                  ? "0 0 8px rgba(28, 108, 179, 0.3)"
                  : "none",
              }}
            />
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <Row className="mb-4 g-2">
          {questionGroups.map((group, idx) => {
            const IconComponent = group.icon;
            const isComplete = isGroupComplete(group);
            const isActive = activeGroup === idx;

            return (
              <Col key={idx} xs={6} lg={Math.floor(12 / questionGroups.length)}>
                <button
                  onClick={() => setActiveGroup(idx)}
                  style={{
                    width: "100%",
                    padding: isMobile ? "8px 4px" : "12px 8px",
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

        {/* Question Card */}
        <div
          className="text-center mx-auto"
          style={{ maxWidth: "650px", minHeight: "300px" }}
        >
          {/* Question bubble */}
          <div
            className="mb-4 p-4 rounded-4"
            style={{
              background: `linear-gradient(135deg, ${currentGroup.color}08, #ffffff)`,
              border: `1.5px solid ${currentGroup.color}30`,
              animation: transitionDirection
                ? `slide${transitionDirection === "right" ? "InRight" : "InLeft"} 0.3s ease-out`
                : "none",
            }}
            onAnimationEnd={() => setTransitionDirection(null)}
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
                border:
                  currentAnswer === false
                    ? "2px solid #1C6CB3"
                    : "2px solid #D1D5DB",
                transition: "all 0.2s ease",
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
              <XCircle size={18} />
              No
            </button>

            <button
              onClick={() => handleAnswer(true)}
              style={{
                minWidth: "140px",
                borderRadius: "50px",
                fontWeight: "600",
                fontSize: "0.95rem",
                padding: "12px 28px",
                background: currentAnswer === true ? currentGroup.color : "white",
                color: currentAnswer === true ? "white" : "#374151",
                border:
                  currentAnswer === true
                    ? `2px solid ${currentGroup.color}`
                    : "2px solid #D1D5DB",
                transition: "all 0.2s ease",
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
              <CheckCircle2 size={18} />
              Yes
            </button>
          </div>

         
        </div>
      </Card.Body>


      {/* Assessment Action Footer - only shows when complete */}
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
    </Card>
  );
};

// Add these keyframe animations to your CSS
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;
document.head.appendChild(style);

export default LearningStyleSection;