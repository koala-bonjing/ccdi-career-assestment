import React, { useEffect, useState } from "react";
import type { AssessmentResult } from "../../../types";
import type { Question } from "../../../hooks/useAssessmentQuestions";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  Info,
  BookOpen,
  Brain,
  Clock,
  Target,
  Award,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  BarChart3,
  Lightbulb,
  FileText,
  Sparkles,
} from "lucide-react";

interface Props {
  userAnswers: Record<string, string>;
  result: AssessmentResult;
  questions?: Question[];
}

interface GroupSection {
  id: string;
  questionText: string;
  correctAnswer: string;
  helperText: string;
  userAnswer: string;
  isCorrect: boolean;
  isSubjective: boolean;
  subCategory?: string;
}

const FoundationalExamCard: React.FC<Props> = ({
  result,
  userAnswers,
  questions,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const hasAnswers = userAnswers && Object.keys(userAnswers).length > 0;
  const hasScoreData =
    result?.foundationalScore !== undefined ||
    result?.prereqAnalysis ||
    result?.examAnalysis;

  if (!hasAnswers && !hasScoreData) {
    return (
      <div
        className="mt-5 p-4 text-center rounded-4"
        style={{ border: "1px solid rgba(43, 49, 118, 0.1)" }}
      >
        <p className="text-muted mb-0">
          No foundational assessment data available.
        </p>
      </div>
    );
  }

  const accuracy = result?.foundationalScore || 0;
  const prereqAnalysis = result?.prereqAnalysis;

  const groupedQuestions: Record<string, GroupSection[]> = {};

  if (questions && questions.length > 0) {
    questions.forEach((q) => {
      const userAnswerValue = userAnswers[q._id] || userAnswers[q.questionText];
      const correctAnswer = q.correctAnswer || "";
      const isCorrect =
        String(userAnswerValue || "")
          .trim()
          .toLowerCase() === String(correctAnswer).trim().toLowerCase() &&
        !!userAnswerValue;
      const cat = q.subCategory || "General";
      const displayCategory = cat
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (s) => s.toUpperCase());

      if (!groupedQuestions[displayCategory])
        groupedQuestions[displayCategory] = [];

      groupedQuestions[displayCategory].push({
        id: q._id,
        questionText: q.questionText,
        correctAnswer: correctAnswer,
        helperText: q.helperText || "",
        userAnswer: userAnswerValue || "Not Answered",
        isCorrect: isCorrect,
        isSubjective: false,
        subCategory: q.subCategory,
      });
    });
  }

  const categories = Object.keys(groupedQuestions);
  const totalQuestions = questions?.length || 0;

  const getScoreBadgeStyle = (score: number) => {
    if (score >= 4) return { bg: "#EC2326", text: "white", label: "Strong" };
    if (score >= 3)
      return { bg: "#F59E0B", text: "#1a1a1a", label: "Moderate" };
    return { bg: "#A41D31", text: "white", label: "Needs Work" };
  };

  const getScoreIcon = (score: number) => {
    if (score >= 4) return <Award size={16} style={{ color: "#EC2326" }} />;
    if (score >= 3)
      return <TrendingUp size={16} style={{ color: "#F59E0B" }} />;
    return <AlertCircle size={16} style={{ color: "#A41D31" }} />;
  };

  const getAccuracyColor = (score: number) => {
    if (score >= 80) return "#EC2326";
    if (score >= 60) return "#F59E0B";
    return "#A41D31";
  };

  const isStudyHabitsQuestion = (subCategory: string) => {
    return (
      subCategory.toLowerCase().includes("studyhabits") ||
      subCategory.toLowerCase().includes("study habits") ||
      subCategory.toLowerCase().includes("study_habits")
    );
  };

  const isSubjectiveQuestion = (question: GroupSection) => {
    if (isStudyHabitsQuestion(question.subCategory || "")) return true;
    if (!question.correctAnswer || question.correctAnswer.trim() === "")
      return true;
    return false;
  };

  const getCategoryIcon = (category: string, size: number = 16) => {
    const categoryLower = category.toLowerCase();
    if (
      categoryLower.includes("prerequisite") ||
      categoryLower.includes("math") ||
      categoryLower.includes("english") ||
      categoryLower.includes("computer")
    ) {
      return (
        <BookOpen size={size} className="me-2" style={{ color: "#03AED2" }} />
      );
    }
    if (categoryLower.includes("study") || categoryLower.includes("habit")) {
      return (
        <Clock size={size} className="me-2" style={{ color: "#EC2326" }} />
      );
    }
    if (
      categoryLower.includes("problem") ||
      categoryLower.includes("solve") ||
      categoryLower.includes("logical")
    ) {
      return (
        <Brain size={size} className="me-2" style={{ color: "#53CBF3" }} />
      );
    }
    return (
      <FileText size={size} className="me-2" style={{ color: "#2B3176" }} />
    );
  };

  const CategoryTooltips = {
    prerequisites:
      "Evaluates your foundational knowledge in Math, English, and Computer Literacy",
    studyHabits: "Assesses your time management and study organization skills",
    problemSolving:
      "Measures your logical thinking and analytical reasoning abilities",
    overall:
      "Combined average of Prerequisites, Study Habits, and Problem Solving scores",
  };

  const TooltipContent = () => {
    const [showDetails, setShowDetails] = useState(false);
    return (
      <>
        <div
          className="fw-bold mb-2 pb-1"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}
        >
          How is this scored?
        </div>
        <div style={{ fontSize: "0.85em", lineHeight: "1.5" }}>
          Your score uses a <strong>weighted point system</strong>:
          <br />
          <br />
          <strong>📝 Multiple Choice</strong>
          <br />
          • Correct = Full points • Wrong = 0 points
          <br />
          <br />
          <strong>✋ Self-Assessment</strong>
          <br />
          • Based on proficiency level (0-100%)
          <br />
          <br />
          <strong>💬 Open-Ended</strong>
          <br />
          • AI grades understanding (0-100%)
          <br />
          <br />
          <div
            onClick={() => setShowDetails(!showDetails)}
            style={{
              cursor: "pointer",
              color: "#60a5fa",
              textDecoration: "underline",
              fontSize: "0.9em",
            }}
          >
            {showDetails ? "▼ Show less" : "▶ Learn more"}
          </div>
          {showDetails && (
            <div
              className="mt-2 pt-2"
              style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
            >
              <strong>Self-Assessment Multipliers:</strong>
              <br />
              • Expert/Very Confident → 100%
              <br />
              • Good/Confident → 75%
              <br />
              • Moderate Experience → 50%
              <br />
              • Basic/Learning → 25%
              <br />
              • None → 0%
              <br />
              <br />
              <strong>Final Score:</strong>
              <br />
              (Total Points Earned ÷ Total Possible) × 100%
            </div>
          )}
        </div>
      </>
    );
  };

  // ─── MOBILE VIEW ──────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div
        className="mt-4 rounded-4 overflow-hidden"
        style={{
          border: "2px solid rgba(43, 49, 118, 0.1)",
          boxShadow: "0 2px 12px rgba(43, 49, 118, 0.06)",
        }}
      >
        {/* Header */}
        <div
          className="p-3"
          style={{ background: "linear-gradient(135deg, #2B3176, #1C6CB3)" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h4
              className="fw-bold mb-0 d-flex align-items-center text-white"
              style={{ fontSize: "1.1rem" }}
            >
              <FileText size={18} className="me-2" />
              Foundational Readiness
            </h4>
            <div className="d-flex align-items-center gap-1 position-relative">
              <span
                className="fw-bold text-white"
                style={{ fontSize: "1.2rem" }}
              >
                {accuracy}%
              </span>
              <div
                onClick={() => setShowTooltip(!showTooltip)}
                style={{ cursor: "pointer", color: "rgba(255,255,255,0.7)" }}
              >
                <HelpCircle size={18} />
              </div>
              {showTooltip && (
                <div
                  className="position-absolute p-3 rounded shadow"
                  style={{
                    top: "120%",
                    right: 0,
                    width: "260px",
                    backgroundColor: "#2B3176",
                    color: "#fff",
                    fontSize: "0.8rem",
                    zIndex: 1050,
                    textAlign: "left",
                  }}
                  onClick={() => setShowTooltip(false)}
                >
                  <TooltipContent />
                </div>
              )}
            </div>
          </div>
          <p
            className="text-white mb-0 small d-flex align-items-center"
            style={{ opacity: 0.8 }}
          >
            <Info size={14} className="me-1" />
            Tap categories to view details
          </p>
        </div>

        <div
          className="p-3"
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%)",
          }}
        >
          {/* Prerequisite Scores */}
          {prereqAnalysis && (
            <div
              className="mb-4 p-3 rounded-4"
              style={{
                background: "rgba(43, 49, 118, 0.02)",
                border: "1px solid rgba(43, 49, 118, 0.08)",
              }}
            >
              <h6
                className="fw-bold mb-3 d-flex align-items-center"
                style={{ color: "#2B3176" }}
              >
                <BarChart3
                  size={18}
                  className="me-2"
                  style={{ color: "#1C6CB3" }}
                />
                Readiness Breakdown
              </h6>
              <div className="d-flex flex-column gap-2">
                {[
                  {
                    label: "Prerequisites",
                    sub: "Math, English, Computer",
                    icon: BookOpen,
                    score: prereqAnalysis.prerequisites,
                    color: "#2B3176",
                  },
                  {
                    label: "Study Habits",
                    sub: "Time management & organization",
                    icon: Clock,
                    score: prereqAnalysis.studyHabits,
                    color: "#EC2326",
                  },
                  {
                    label: "Problem Solving",
                    sub: "Logical thinking & analysis",
                    icon: Brain,
                    score: prereqAnalysis.problemSolving,
                    color: "#1C6CB3",
                  },
                ].map((item, idx) => {
                  const IconComp = item.icon;
                  // Green for high scores, amber for medium, red for low
                  const scoreColor =
                    item.score >= 4
                      ? "#22c55e"
                      : item.score >= 3
                        ? "#F59E0B"
                        : "#EF4444";
                  const scoreBg =
                    item.score >= 4
                      ? "rgba(34, 197, 94, 0.1)"
                      : item.score >= 3
                        ? "rgba(245, 158, 11, 0.1)"
                        : "rgba(239, 68, 68, 0.1)";
                  const scoreBorder =
                    item.score >= 4
                      ? "rgba(34, 197, 94, 0.3)"
                      : item.score >= 3
                        ? "rgba(245, 158, 11, 0.3)"
                        : "rgba(239, 68, 68, 0.3)";

                  return (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-3 d-flex align-items-center justify-content-between"
                      style={{ border: "1px solid rgba(43, 49, 118, 0.06)" }}
                    >
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <IconComp size={22} style={{ color: item.color }} />
                        </div>
                        <div>
                          <div
                            className="fw-medium"
                            style={{ color: "#2B3176", fontSize: "0.9rem" }}
                          >
                            {item.label}
                          </div>
                          <small className="text-muted">{item.sub}</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {item.score >= 4 ? (
                          <CheckCircle2
                            size={18}
                            style={{ color: "#22c55e" }}
                          />
                        ) : item.score >= 3 ? (
                          <TrendingUp size={18} style={{ color: "#F59E0B" }} />
                        ) : (
                          <AlertCircle size={18} style={{ color: "#EF4444" }} />
                        )}
                        <span
                          className="badge fw-bold"
                          style={{
                            background: scoreBg,
                            color: scoreColor,
                            border: `1px solid ${scoreBorder}`,
                            fontSize: "0.85rem",
                            padding: "6px 10px",
                          }}
                        >
                          {item.score}/5
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Overall */}
              <div
                className="p-3 bg-white rounded-3 text-center mt-2"
                style={{ border: "1px solid rgba(43, 49, 118, 0.1)" }}
              >
                <div className="small text-muted mb-2 d-flex align-items-center justify-content-center">
                  <Target
                    size={14}
                    className="me-1"
                    style={{ color: "#2B3176" }}
                  />
                  Overall Readiness
                </div>
                {prereqAnalysis.overallScore >= 4 ? (
                  <CheckCircle2
                    size={20}
                    className="me-1"
                    style={{ color: "#22c55e", display: "inline" }}
                  />
                ) : prereqAnalysis.overallScore >= 3 ? (
                  <TrendingUp
                    size={20}
                    className="me-1"
                    style={{ color: "#F59E0B", display: "inline" }}
                  />
                ) : (
                  <AlertCircle
                    size={20}
                    className="me-1"
                    style={{ color: "#EF4444", display: "inline" }}
                  />
                )}
                <span
                  className="fw-bold"
                  style={{ fontSize: "1.5rem", color: "#2B3176" }}
                >
                  {prereqAnalysis.overallScore}/5
                </span>
                <span
                  className="small ms-2 fw-bold"
                  style={{
                    color:
                      prereqAnalysis.overallScore >= 4
                        ? "#22c55e"
                        : prereqAnalysis.overallScore >= 3
                          ? "#F59E0B"
                          : "#EF4444",
                  }}
                >
                  {prereqAnalysis.overallScore >= 4
                    ? "(Excellent)"
                    : prereqAnalysis.overallScore >= 3
                      ? "(Good)"
                      : "(Needs Work)"}
                </span>
              </div>

              {/* Warnings */}
              {prereqAnalysis.warnings &&
                prereqAnalysis.warnings.length > 0 && (
                  <div
                    className="mt-3 p-3 rounded-3"
                    style={{
                      background: "rgba(239, 68, 68, 0.06)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                    }}
                  >
                    <div
                      className="small fw-bold mb-2 d-flex align-items-center"
                      style={{ color: "#DC2626" }}
                    >
                      <AlertCircle size={14} className="me-1" /> Areas to
                      Improve:
                    </div>
                    <ul
                      className="small mb-0 ps-3"
                      style={{ color: "#991B1B" }}
                    >
                      {prereqAnalysis.warnings.map((warning, idx) => (
                        <li key={idx} className="mb-1">
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}

          {/* Mobile Accordion */}
          {categories.map((category) => {
            const questionsInCategory = groupedQuestions[category];
            const correctInCat = questionsInCategory.filter(
              (q) => q.isCorrect,
            ).length;
            return (
              <div key={category} className="mb-3">
                <button
                  className="w-100 text-start p-3 rounded-3 d-flex justify-content-between align-items-center"
                  style={{
                    background:
                      expandedSection === category
                        ? "rgba(43, 49, 118, 0.04)"
                        : "#f8f9fa",
                    border:
                      expandedSection === category
                        ? "2px solid #2B3176"
                        : "1px solid #e5e7eb",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === category ? null : category,
                    )
                  }
                >
                  <div>
                    <h6
                      className="fw-bold mb-1 d-flex align-items-center"
                      style={{ color: "#2B3176", fontSize: "0.9rem" }}
                    >
                      {getCategoryIcon(category, 16)}
                      {category}
                    </h6>
                    <small className="text-muted">
                      {correctInCat}/{questionsInCategory.length} correct
                    </small>
                  </div>
                  {expandedSection === category ? (
                    <ChevronUp size={20} style={{ color: "#2B3176" }} />
                  ) : (
                    <ChevronDown size={20} className="text-muted" />
                  )}
                </button>

                {expandedSection === category && (
                  <div className="mt-3">
                    {questionsInCategory.map((item) => {
                      const isStudyHabit = isStudyHabitsQuestion(
                        item.subCategory || "",
                      );
                      const isSubjective = isSubjectiveQuestion(item);
                      const correctColor = "#22c55e"; // ✅ Green
                      const wrongColor = "#EF4444"; // ❌ Red
                      const skippedColor = "#6c757d"; // ⏭️ Gray

                      return (
                        <div
                          key={item.id}
                          className="mb-2 p-3 rounded-3"
                          style={{
                            borderLeft: `4px solid ${!item.userAnswer ? skippedColor : isSubjective || item.isCorrect ? correctColor : wrongColor}`,
                            background: !item.userAnswer
                              ? "#f8f9fa"
                              : isSubjective || item.isCorrect
                                ? "rgba(34, 197, 94, 0.04)" // Light green bg for correct
                                : "rgba(239, 68, 68, 0.04)", // Light red bg for wrong
                          }}
                        >
                          <p
                            className="small fw-bold mb-2"
                            style={{ color: "#2B3176" }}
                          >
                            {item.questionText}
                          </p>
                          {isStudyHabit && (
                            <span
                              className="badge small mb-2 d-inline-flex align-items-center"
                              style={{
                                background: "rgba(28, 108, 179, 0.1)",
                                color: "#1C6CB3",
                                border: "1px solid rgba(28, 108, 179, 0.2)",
                              }}
                            >
                              <Clock size={12} className="me-1" />{" "}
                              Self-Assessment
                            </span>
                          )}
                          <div className="small">
                            <div className="mb-1 d-flex align-items-start">
                              <span className="text-muted me-1">
                                Your answer:
                              </span>
                              <span
                                className="fw-bold d-flex align-items-center"
                                style={{
                                  color:
                                    isSubjective || item.isCorrect
                                      ? correctColor
                                      : wrongColor,
                                }}
                              >
                                {isSubjective || item.isCorrect ? (
                                  <CheckCircle2
                                    size={14}
                                    className="me-1"
                                    style={{ color: correctColor }}
                                  />
                                ) : (
                                  <XCircle
                                    size={14}
                                    className="me-1"
                                    style={{ color: wrongColor }}
                                  />
                                )}
                                {item.userAnswer || "Skipped"}
                              </span>
                            </div>
                            {!isSubjective &&
                              !item.isCorrect &&
                              item.userAnswer && (
                                <div className="d-flex align-items-start">
                                  <span className="text-muted me-1">
                                    Correct:
                                  </span>
                                  <span
                                    className="fw-bold d-flex align-items-center"
                                    style={{ color: correctColor }}
                                  >
                                    <CheckCircle2 size={14} className="me-1" />
                                    {item.correctAnswer}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Summary */}
          <div
            className="mt-4 p-3 rounded-4"
            style={{
              background: "rgba(43, 49, 118, 0.02)",
              border: "1px solid rgba(43, 49, 118, 0.08)",
            }}
          >
            <h6
              className="fw-bold mb-3 d-flex align-items-center"
              style={{ color: "#2B3176" }}
            >
              <BarChart3 size={16} className="me-2" /> Summary
            </h6>
            <div className="row g-2 mb-3">
              <div className="col-6">
                <div
                  className="text-center p-2 bg-white rounded-3 h-100"
                  style={{ border: "1px solid rgba(43, 49, 118, 0.06)" }}
                >
                  <div
                    className="fw-bold mb-1 d-flex align-items-center justify-content-center"
                    style={{
                      fontSize: "1.5rem",
                      color: getAccuracyColor(accuracy),
                    }}
                  >
                    <CheckCircle2 size={20} className="me-1" />
                    {accuracy}%
                  </div>
                  <small className="text-muted">Accuracy</small>
                </div>
              </div>
              <div className="col-6">
                <div
                  className="text-center p-2 bg-white rounded-3 h-100"
                  style={{ border: "1px solid rgba(43, 49, 118, 0.06)" }}
                >
                  <div
                    className="fw-bold mb-1 d-flex align-items-center justify-content-center"
                    style={{ fontSize: "1.5rem", color: "#1C6CB3" }}
                  >
                    <FileText size={20} className="me-1" />
                    {totalQuestions}
                  </div>
                  <small className="text-muted">Total Questions</small>
                </div>
              </div>
            </div>
            <div
              className="w-100 rounded-pill overflow-hidden"
              style={{ height: "10px", background: "#e5e7eb" }}
            >
              <div
                className="h-100 rounded-pill"
                style={{
                  width: `${accuracy}%`,
                  background: getAccuracyColor(accuracy),
                  transition: "width 0.6s ease",
                }}
              />
            </div>
            <div className="d-flex justify-content-between mt-2 small">
              <span className="text-muted">Overall Score</span>
              <span className="fw-bold" style={{ color: "#2B3176" }}>
                {accuracy}%
              </span>
            </div>
          </div>

          {/* AI Insights */}
          {(result?.examAnalysis || result?.successRoadmap) && (
            <div className="mt-4">
              <h6
                className="fw-bold mb-3 d-flex align-items-center"
                style={{ color: "#2B3176" }}
              >
                <Sparkles
                  size={16}
                  className="me-2"
                  style={{ color: "#1C6CB3" }}
                />{" "}
                AI Insights
              </h6>
              {result?.examAnalysis && (
                <div
                  className="p-3 rounded-3 mb-3 d-flex"
                  style={{
                    background: "rgba(28, 108, 179, 0.05)",
                    border: "1px solid rgba(28, 108, 179, 0.15)",
                  }}
                >
                  <FileText
                    size={16}
                    className="me-2 flex-shrink-0 mt-1"
                    style={{ color: "#1C6CB3" }}
                  />
                  <p className="small mb-0" style={{ color: "#374151" }}>
                    {result.examAnalysis}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── DESKTOP VIEW ─────────────────────────────────────────────────────
  const activeCategory = categories[activeSlideIndex];
  const activeQuestions = groupedQuestions[activeCategory] || [];

  return (
    <div
      className="mt-5 rounded-4 overflow-hidden"
      style={{
        border: "2px solid rgba(43, 49, 118, 0.1)",
        boxShadow: "0 2px 12px rgba(43, 49, 118, 0.06)",
      }}
    >
      {/* Header */}
      {/* Header - Softer gradient */}
      <div
        className="p-4"
        style={{
          background: "#ffffff",
          borderBottom: "1px solid rgba(43, 49, 118, 0.1)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4
              className="fw-bold mb-1 d-flex align-items-center"
              style={{ color: "#2B3176" }}
            >
              <FileText
                size={24}
                className="me-2"
                style={{ color: "#1C6CB3" }}
              />
              Foundational Readiness Review
            </h4>
            <p
              className="small mb-0 d-flex align-items-center"
              style={{ color: "#6b7280" }}
            >
              <Info size={14} className="me-1" />
              Analysis of your background, habits, and logical reasoning skills
            </p>
          </div>
          <div className="text-end position-relative">
            <div className="d-flex align-items-center justify-content-end gap-2">
              <span
                className="fw-bold mb-0 d-flex align-items-center"
                style={{ fontSize: "2rem", color: "#2B3176" }}
              >
                <Target
                  size={24}
                  className="me-2"
                  style={{ color: "#EC2326" }}
                />
                {accuracy}%
              </span>
              <div
                className="position-relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                style={{ cursor: "pointer" }}
              >
                <HelpCircle size={18} style={{ color: "#9ca3af" }} />
                {showTooltip && (
                  <div
                    className="position-absolute p-3 rounded shadow"
                    style={{
                      top: "100%",
                      right: 0,
                      width: "280px",
                      backgroundColor: "#2B3176",
                      color: "#fff",
                      fontSize: "0.85rem",
                      zIndex: 1000,
                      marginTop: "10px",
                      textAlign: "left",
                    }}
                  >
                    <TooltipContent />
                  </div>
                )}
              </div>
            </div>
            <div className="small" style={{ color: "#9ca3af" }}>
              Overall Score
            </div>
          </div>
        </div>

        {/* Prerequisite Scores */}
        {prereqAnalysis && (
          <div
            className="p-4 rounded-4"
            style={{
              background: "rgba(43, 49, 118, 0.02)",
              border: "1px solid rgba(43, 49, 118, 0.08)",
            }}
          >
            <h6
              className="fw-bold mb-3 d-flex align-items-center"
              style={{ color: "#2B3176" }}
            >
              <BarChart3
                size={20}
                className="me-2"
                style={{ color: "#1C6CB3" }}
              />{" "}
              Readiness Breakdown
            </h6>
            <div className="row g-3">
              {[
                {
                  label: "Prerequisites",
                  icon: BookOpen,
                  score: prereqAnalysis.prerequisites,
                  tooltip: CategoryTooltips.prerequisites,
                },
                {
                  label: "Study Habits",
                  icon: Clock,
                  score: prereqAnalysis.studyHabits,
                  tooltip: CategoryTooltips.studyHabits,
                },
                {
                  label: "Problem Solving",
                  icon: Brain,
                  score: prereqAnalysis.problemSolving,
                  tooltip: CategoryTooltips.problemSolving,
                },
              ].map((item, idx) => {
                const badgeStyle = getScoreBadgeStyle(item.score);
                const IconComp = item.icon;
                return (
                  <div key={idx} className="col-md-4">
                    <div
                      className="text-center p-3 bg-white rounded-3 h-100"
                      style={{ border: "1px solid rgba(43, 49, 118, 0.06)" }}
                    >
                      <div className="small text-muted mb-2 d-flex align-items-center justify-content-center gap-1">
                        <IconComp size={16} style={{ color: "#2B3176" }} />
                        {item.label}
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>{item.tooltip}</Tooltip>}
                        >
                          <Info
                            size={14}
                            className="text-muted"
                            style={{ cursor: "pointer" }}
                          />
                        </OverlayTrigger>
                      </div>
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        {getScoreIcon(item.score)}
                        <span
                          className="badge fw-bold"
                          style={{
                            background: badgeStyle.bg,
                            color: badgeStyle.text,
                            fontSize: "0.9rem",
                            padding: "6px 12px",
                          }}
                        >
                          {item.score}/5
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Overall + warnings */}
            <div className="row mt-3">
              <div className="col-md-6">
                <div
                  className="p-3 bg-white rounded-3 text-center h-100"
                  style={{ border: "1px solid rgba(43, 49, 118, 0.06)" }}
                >
                  <div className="small text-muted mb-2 d-flex align-items-center justify-content-center gap-1">
                    <Target size={16} style={{ color: "#EC2326" }} /> Overall
                    Readiness
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>{CategoryTooltips.overall}</Tooltip>}
                    >
                      <Info
                        size={14}
                        className="text-muted"
                        style={{ cursor: "help" }}
                      />
                    </OverlayTrigger>
                  </div>
                  <span
                    className="fw-bold"
                    style={{ fontSize: "1.5rem", color: "#2B3176" }}
                  >
                    {prereqAnalysis.overallScore}/5
                  </span>
                  <span
                    className="badge ms-2"
                    style={{
                      background: getScoreBadgeStyle(
                        prereqAnalysis.overallScore,
                      ).bg,
                      color: getScoreBadgeStyle(prereqAnalysis.overallScore)
                        .text,
                    }}
                  >
                    {prereqAnalysis.overallScore >= 4
                      ? "Excellent"
                      : prereqAnalysis.overallScore >= 3
                        ? "Good Progress"
                        : "Needs Improvement"}
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                {prereqAnalysis.warnings &&
                  prereqAnalysis.warnings.length > 0 && (
                    <div
                      className="p-3 rounded-3 h-100"
                      style={{
                        background: "rgba(245, 158, 11, 0.06)",
                        border: "1px solid rgba(245, 158, 11, 0.15)",
                      }}
                    >
                      <div
                        className="fw-bold mb-2 d-flex align-items-center"
                        style={{ color: "#92400e" }}
                      >
                        <AlertCircle size={18} className="me-2" /> Areas for
                        Improvement:
                      </div>
                      <ul
                        className="mb-0 small ps-3"
                        style={{ color: "#92400e" }}
                      >
                        {prereqAnalysis.warnings.map((warning, idx) => (
                          <li key={idx} className="mb-1">
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div
          className="d-flex gap-2 mt-3 pt-3"
          style={{ borderTop: "1px solid rgba(43, 49, 118, 0.08)" }}
        >
          {categories.map((cat, index) => (
            <button
              key={cat}
              onClick={() => setActiveSlideIndex(index)}
              className="btn btn-sm rounded-pill px-3 fw-bold d-flex align-items-center"
              style={{
                background: activeSlideIndex === index ? "#2B3176" : "#f3f4f6",
                border:
                  activeSlideIndex === index
                    ? "2px solid #2B3176"
                    : "1px solid #e5e7eb",
                color: activeSlideIndex === index ? "white" : "#6b7280",
                transition: "all 0.2s ease",
              }}
            >
              {getCategoryIcon(cat, 16)}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div
        className="p-4"
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%)",
        }}
      >
        <div style={{ minHeight: "300px" }}>
          <h5
            className="fw-bold mb-4 d-flex align-items-center"
            style={{ color: "#2B3176" }}
          >
            {activeCategory}
          </h5>
          <div className="row">
            {activeQuestions.map((item) => {
              const isStudyHabit = isStudyHabitsQuestion(
                item.subCategory || "",
              );
              const isSubjective = isSubjectiveQuestion(item);
              const correctColor = "#22c55e"; // ✅ Green
              const wrongColor = "#EF4444"; // ❌ Red

              return (
                <div key={item.id} className="col-12 mb-3">
                  <div
                    className="p-3 rounded-3"
                    style={{
                      borderLeft: `4px solid ${!item.userAnswer ? "#6c757d" : isSubjective || item.isCorrect ? correctColor : wrongColor}`,
                      background: !item.userAnswer
                        ? "#f8f9fa"
                        : isSubjective || item.isCorrect
                          ? "rgba(34, 197, 94, 0.04)" // Light green
                          : "rgba(239, 68, 68, 0.04)", // Light red
                    }}
                  >
                    <div className="row align-items-center">
                      <div className="col-md-7">
                        <p
                          className="small fw-bold mb-1"
                          style={{ color: "#2B3176" }}
                        >
                          {item.questionText}
                        </p>
                        {isStudyHabit && (
                          <span
                            className="badge small d-inline-flex align-items-center"
                            style={{
                              background: "rgba(28, 108, 179, 0.1)",
                              color: "#1C6CB3",
                              border: "1px solid rgba(28, 108, 179, 0.2)",
                            }}
                          >
                            <Clock size={12} className="me-1" /> Self-Assessment
                          </span>
                        )}
                      </div>
                      <div
                        className="col-md-5"
                        style={{ borderLeft: "1px solid #e5e7eb" }}
                      >
                        <div className="small ps-md-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="text-muted d-flex align-items-center">
                              <CheckCircle2 size={12} className="me-1" /> Your:
                            </span>
                            <span
                              className="fw-bold d-flex align-items-center"
                              style={{
                                color:
                                  isSubjective || item.isCorrect
                                    ? correctColor
                                    : wrongColor,
                              }}
                            >
                              {isSubjective || item.isCorrect ? (
                                <CheckCircle2
                                  size={14}
                                  className="me-1"
                                  style={{ color: correctColor }}
                                />
                              ) : (
                                <XCircle
                                  size={14}
                                  className="me-1"
                                  style={{ color: wrongColor }}
                                />
                              )}
                              {item.userAnswer || "Skipped"}
                            </span>
                          </div>
                          {!isSubjective &&
                            !item.isCorrect &&
                            item.userAnswer && (
                              <div className="d-flex justify-content-between">
                                <span className="text-muted">Correct:</span>
                                <span
                                  className="fw-bold d-flex align-items-center"
                                  style={{ color: correctColor }}
                                >
                                  <CheckCircle2 size={14} className="me-1" />
                                  {item.correctAnswer}
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Navigation */}
        <div
          className="d-flex justify-content-between align-items-center mt-4 pt-3"
          style={{ borderTop: "1px solid rgba(43, 49, 118, 0.1)" }}
        >
          <button
            className="btn btn-sm rounded-pill px-3 d-flex align-items-center"
            onClick={() =>
              setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))
            }
            disabled={activeSlideIndex === 0}
            style={{
              background: "white",
              border: "1px solid #d1d5db",
              color: "#6b7280",
              opacity: activeSlideIndex === 0 ? 0.5 : 1,
            }}
          >
            <ChevronDown
              size={16}
              className="me-1"
              style={{ transform: "rotate(90deg)" }}
            />{" "}
            Previous
          </button>
          <div className="text-muted small d-flex align-items-center">
            <BarChart3 size={14} className="me-1" /> {activeSlideIndex + 1} of{" "}
            {categories.length}
          </div>
          <button
            className="btn btn-sm rounded-pill px-3 d-flex align-items-center"
            onClick={() =>
              setActiveSlideIndex(
                Math.min(categories.length - 1, activeSlideIndex + 1),
              )
            }
            disabled={activeSlideIndex === categories.length - 1}
            style={{
              background:
                activeSlideIndex === categories.length - 1
                  ? "#e5e7eb"
                  : "linear-gradient(135deg, #2B3176, #1C6CB3)",
              border: "none",
              color:
                activeSlideIndex === categories.length - 1
                  ? "#9ca3af"
                  : "white",
              opacity: activeSlideIndex === categories.length - 1 ? 0.5 : 1,
            }}
          >
            Next{" "}
            <ChevronDown
              size={16}
              className="ms-1"
              style={{ transform: "rotate(270deg)" }}
            />
          </button>
        </div>

        {/* AI Analysis Footer */}
        <div
          className="mt-4 p-4 rounded-4"
          style={{
            background: "rgba(43, 49, 118, 0.02)",
            border: "1px solid rgba(43, 49, 118, 0.08)",
          }}
        >
          {result?.examAnalysis && (
            <div className="d-flex">
              <FileText
                size={18}
                className="me-3 flex-shrink-0 mt-1"
                style={{ color: "#1C6CB3" }}
              />
              <div>
                <h6
                  className="fw-bold mb-2 d-flex align-items-center"
                  style={{ color: "#2B3176" }}
                >
                  <Sparkles
                    size={16}
                    className="me-1"
                    style={{ color: "#1C6CB3" }}
                  />{" "}
                  AI Evaluation
                </h6>
                <p className="small mb-0" style={{ color: "#374151" }}>
                  {result.examAnalysis}
                </p>
              </div>
            </div>
          )}
          {result?.successRoadmap && !result?.examAnalysis && (
            <div className="d-flex">
              <Lightbulb
                size={18}
                className="me-3 flex-shrink-0 mt-1"
                style={{ color: "#EC2326" }}
              />
              <div>
                <h6
                  className="fw-bold mb-2 d-flex align-items-center"
                  style={{ color: "#2B3176" }}
                >
                  <Sparkles
                    size={16}
                    className="me-1"
                    style={{ color: "#EC2326" }}
                  />{" "}
                  Success Roadmap
                </h6>
                <p className="small mb-0" style={{ color: "#374151" }}>
                  {result.successRoadmap}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoundationalExamCard;
