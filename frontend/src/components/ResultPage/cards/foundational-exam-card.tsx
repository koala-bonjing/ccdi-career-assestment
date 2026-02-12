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

  if (!userAnswers || Object.keys(userAnswers).length === 0) {
    return (
      <div className="card border-0 shadow-sm mt-5 p-4 text-center">
        <p className="text-muted">No foundational assessment data available.</p>
      </div>
    );
  }

  const accuracy = result?.foundationalScore || 0;

  // ✅ GET PREREQUISITE ANALYSIS DATA
  const prereqAnalysis = result?.prereqAnalysis;

  const groupedQuestions: Record<string, GroupSection[]> = {};

  if (questions && questions.length > 0) {
    questions.forEach((q) => {
      const userAnswerValue = userAnswers[q._id] || userAnswers[q.questionText];

      // ✅ Ensure we are comparing correctly
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

  // ✅ HELPER FUNCTIONS
  const getScoreBadgeClass = (score: number) => {
    if (score >= 4) return "bg-success";
    if (score >= 3) return "bg-warning";
    return "bg-danger";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 4) return <Award size={16} className="text-success" />;
    if (score >= 3) return <TrendingUp size={16} className="text-warning" />;
    return <AlertCircle size={16} className="text-danger" />;
  };

  const isStudyHabitsQuestion = (subCategory: string) => {
    return (
      subCategory.toLowerCase().includes("studyhabits") ||
      subCategory.toLowerCase().includes("study habits") ||
      subCategory.toLowerCase().includes("study_habits")
    );
  };

  // Check if a question is subjective (has scoringRubrics instead of correctAnswer)
  const isSubjectiveQuestion = (
    question: GroupSection,
    originalQuestion?: Question,
  ) => {
    // Check if it's a study habits question
    if (isStudyHabitsQuestion(question.subCategory || "")) {
      return true;
    }
    // Check if the original question has scoringRubrics
    if (originalQuestion && "scoringRubrics" in originalQuestion) {
      return true;
    }
    // If correctAnswer is empty or undefined, it's likely subjective
    if (!question.correctAnswer || question.correctAnswer.trim() === "") {
      return true;
    }
    return false;
  };
  // Add this helper function to get category-specific icons
  const getCategoryIcon = (category: string, size: number = 16) => {
    const categoryLower = category.toLowerCase();

    if (
      categoryLower.includes("prerequisite") ||
      categoryLower.includes("math") ||
      categoryLower.includes("english") ||
      categoryLower.includes("computer")
    ) {
      return (
        <BookOpen size={size} className="me-2" style={{ color: "#2B3176" }} />
      );
    }
    if (categoryLower.includes("study") || categoryLower.includes("habit")) {
      return (
        <Clock size={size} className="me-2" style={{ color: "#2B3176" }} />
      );
    }
    if (
      categoryLower.includes("problem") ||
      categoryLower.includes("solve") ||
      categoryLower.includes("logical")
    ) {
      return (
        <Brain size={size} className="me-2" style={{ color: "#2B3176" }} />
      );
    }
    if (categoryLower.includes("general") || categoryLower.includes("other")) {
      return (
        <FileText size={size} className="me-2" style={{ color: "#2B3176" }} />
      );
    }

    // Default icon
    return (
      <FileText size={size} className="me-2" style={{ color: "#2B3176" }} />
    );
  };

  // Common Tooltip Content

  const TooltipContent = () => {
    const [showDetails, setShowDetails] = useState(false);

    return (
      <>
        <div
          className="fw-bold mb-2 border-bottom border-light pb-1"
          style={{ borderColor: "rgba(255,255,255,0.2)" }}
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
              color: "#4dabf7",
              textDecoration: "underline",
              fontSize: "0.9em",
            }}
          >
            {showDetails ? "▼ Show less" : "▶ Learn more"}
          </div>
          {showDetails && (
            <div className="mt-2 pt-2 border-top border-light">
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
              <strong>Example:</strong>
              <br />
              Question worth 5 points
              <br />
              You select "Good" (75%)
              <br />
              You earn: 5 × 0.75 = <strong>3.75 points</strong>
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

  const CategoryTooltips = {
    prerequisites:
      "Evaluates your foundational knowledge in Math, English, and Computer Literacy - essential building blocks for technical programs",
    studyHabits:
      "Assesses your time management and study organization skills based on your self-reported practices",
    problemSolving:
      "Measures your logical thinking and analytical reasoning abilities through problem-solving questions",
    overall:
      "Combined average of Prerequisites, Study Habits, and Problem Solving scores",
  };

  // --- MOBILE VIEW ---
  if (isMobile) {
    return (
      <div className="card border-0 shadow-lg mt-4 rounded-4 overflow-hidden">
        <div className="card-header bg-white py-3 px-3 border-bottom">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h4
              className="fw-bold mb-0 d-flex align-items-center"
              style={{ color: "#2B3176", fontSize: "1.1rem" }}
            >
              <FileText
                size={18}
                className="me-2"
                style={{ color: "#2B3176" }}
              />
              Foundational Readiness
            </h4>

            {/* Mobile Score & Tooltip */}
            <div className="d-flex align-items-center gap-1 position-relative">
              <span
                className={`badge ${accuracy >= 80 ? "bg-success" : accuracy >= 60 ? "bg-warning" : "bg-danger"} fs-6`}
              >
                {accuracy}%
              </span>
              <div
                onClick={() => setShowTooltip(!showTooltip)}
                style={{ cursor: "pointer" }}
                className="text-muted"
              >
                <HelpCircle size={18} />
              </div>

              {/* Mobile Tooltip Popup */}
              {showTooltip && (
                <div
                  className="position-absolute p-3 rounded shadow"
                  style={{
                    top: "120%",
                    right: 0,
                    width: "260px",
                    backgroundColor: "#333",
                    color: "#fff",
                    fontSize: "0.8rem",
                    zIndex: 1050,
                    lineHeight: "1.4",
                    textAlign: "left",
                  }}
                  onClick={() => setShowTooltip(false)}
                >
                  <TooltipContent />
                  <div className="text-end mt-2">
                    <span
                      className="badge bg-light text-dark"
                      style={{ cursor: "pointer" }}
                    >
                      Close
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-muted mb-0 small d-flex align-items-center">
            <Info size={14} className="me-1" />
            Tap categories to view details
          </p>
        </div>

        <div className="card-body p-3">
          {/* ✅ PREREQUISITE SCORES SECTION - MOBILE - STACKED LAYOUT WITH LUCIDE ICONS */}
          {prereqAnalysis && (
            <div
              className="mb-4 p-3 rounded-3 border"
              style={{ background: "rgba(43, 49, 118, 0.03)" }}
            >
              <h6
                className="fw-bold mb-3 d-flex align-items-center"
                style={{ color: "#2B3176" }}
              >
                <BarChart3 size={18} className="me-2" />
                Readiness Breakdown
              </h6>

              {/* STACKED LAYOUT - VERTICAL CARDS */}
              <div className="d-flex flex-column gap-3">
                {/* Prerequisites */}
                <div className="p-3 bg-white rounded-3 border d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <BookOpen size={22} style={{ color: "#2B3176" }} />
                    </div>
                    <div>
                      <div className="fw-medium" style={{ color: "#2B3176" }}>
                        Prerequisites
                      </div>
                      <small className="text-muted d-flex align-items-center">
                        Math, English, Computer Literacy
                      </small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    {getScoreIcon(prereqAnalysis.prerequisites)}
                    <span
                      className={`badge ${getScoreBadgeClass(prereqAnalysis.prerequisites)}`}
                      style={{ fontSize: "0.85rem" }}
                    >
                      {prereqAnalysis.prerequisites}/5
                    </span>
                  </div>
                </div>

                {/* Study Habits */}
                <div className="p-3 bg-white rounded-3 border d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <Clock size={22} style={{ color: "#2B3176" }} />
                    </div>
                    <div>
                      <div className="fw-medium" style={{ color: "#2B3176" }}>
                        Study Habits
                      </div>
                      <small className="text-muted d-flex align-items-center">
                        Time management & organization
                      </small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    {getScoreIcon(prereqAnalysis.studyHabits)}
                    <span
                      className={`badge ${getScoreBadgeClass(prereqAnalysis.studyHabits)}`}
                      style={{ fontSize: "0.85rem" }}
                    >
                      {prereqAnalysis.studyHabits}/5
                    </span>
                  </div>
                </div>

                {/* Problem Solving */}
                <div className="p-3 bg-white rounded-3 border d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <Brain size={22} style={{ color: "#2B3176" }} />
                    </div>
                    <div>
                      <div className="fw-medium" style={{ color: "#2B3176" }}>
                        Problem Solving
                      </div>
                      <small className="text-muted d-flex align-items-center">
                        Logical thinking & analysis
                      </small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    {getScoreIcon(prereqAnalysis.problemSolving)}
                    <span
                      className={`badge ${getScoreBadgeClass(prereqAnalysis.problemSolving)}`}
                      style={{ fontSize: "0.85rem" }}
                    >
                      {prereqAnalysis.problemSolving}/5
                    </span>
                  </div>
                </div>
              </div>

              {/* Overall Readiness */}
              <div className="p-3 bg-white rounded-3 border text-center mt-3">
                <div className="small text-muted mb-2 d-flex align-items-center justify-content-center">
                  <Target size={14} className="me-1" />
                  Overall Readiness
                </div>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <span
                    className={`badge ${getScoreBadgeClass(prereqAnalysis.overallScore)} fs-4 px-3 py-2`}
                  >
                    {prereqAnalysis.overallScore}/5
                  </span>
                  <span className="small text-muted d-flex align-items-center">
                    {prereqAnalysis.overallScore >= 4
                      ? "(Excellent)"
                      : prereqAnalysis.overallScore >= 3
                        ? "(Good)"
                        : "(Needs Work)"}
                  </span>
                </div>
              </div>

              {/* Warnings if any */}
              {prereqAnalysis.warnings &&
                prereqAnalysis.warnings.length > 0 && (
                  <div className="mt-3 p-3 bg-warning-subtle rounded-3 border border-warning">
                    <div className="small fw-bold mb-2 d-flex align-items-center">
                      <AlertCircle size={14} className="me-1 text-warning" />
                      Areas to Improve:
                    </div>
                    <ul className="small mb-0 ps-3">
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
                  className="w-100 text-start p-3 border rounded-3 d-flex justify-content-between align-items-center"
                  style={{
                    background:
                      expandedSection === category
                        ? "rgba(43, 49, 118, 0.05)"
                        : "#f8f9fa",
                    transition: "all 0.2s ease",
                    borderColor:
                      expandedSection === category ? "#2B3176" : "#dee2e6",
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
                      style={{ color: "#2B3176" }}
                    >
                      {getCategoryIcon(category, 16)}
                      {category}
                    </h6>
                    <div className="d-flex align-items-center">
                      <small className="text-muted">
                        {correctInCat}/{questionsInCategory.length} correct
                      </small>
                      <span className="mx-1 text-muted">•</span>
                    
                    </div>
                  </div>
                  <span className="text-muted">
                    {expandedSection === category ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </span>
                </button>

                {expandedSection === category && (
                  <div className="mt-3">
                    {questionsInCategory.map((item) => {
                      const isStudyHabit = isStudyHabitsQuestion(
                        item.subCategory || "",
                      );
                      // Check if this is a subjective question
                      const isSubjective = isSubjectiveQuestion(item);

                      return (
                        <div
                          key={item.id}
                          className="mb-3 p-3 rounded-3 border-start border-3"
                          style={{
                            borderLeftColor: !item.userAnswer
                              ? "#6c757d"
                              : isSubjective || item.isCorrect
                                ? "#198754"
                                : "#dc3545",
                            background: !item.userAnswer
                              ? "#f8f9fa"
                              : isSubjective || item.isCorrect
                                ? "rgba(25, 135, 84, 0.05)"
                                : "rgba(220, 53, 69, 0.05)",
                          }}
                        >
                          <p
                            className="small fw-bold mb-2"
                            style={{ color: "#2B3176" }}
                          >
                            {item.questionText}
                          </p>

                          {isStudyHabit && (
                            <span className="badge bg-success-subtle text-success border border-success small mb-2 d-inline-flex align-items-center">
                              <Clock size={12} className="me-1" />
                              Self-Assessment
                            </span>
                          )}

                          <div className="small">
                            <div className="mb-2 d-flex align-items-start">
                              <span className="text-muted me-1">
                                Your answer:
                              </span>
                              <span
                                className={`fw-bold d-flex align-items-center ${isSubjective || item.isCorrect ? "text-success" : "text-danger"}`}
                              >
                                {isSubjective || item.isCorrect ? (
                                  <CheckCircle2 size={14} className="me-1" />
                                ) : (
                                  <XCircle size={14} className="me-1" />
                                )}
                                {item.userAnswer || "Skipped"}
                              </span>
                            </div>

                            {/* Only show correct answer for objective questions that are wrong */}
                            {!isSubjective &&
                              !item.isCorrect &&
                              item.userAnswer && (
                                <div className="mb-1 d-flex align-items-start">
                                  <span className="text-muted me-1">
                                    ✅ Correct:
                                  </span>
                                  <span className="text-success fw-bold">
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

          {/* Summary for mobile */}
          <div className="mt-4 p-3 rounded-3 border bg-light">
            <h6
              className="fw-bold mb-3 d-flex align-items-center"
              style={{ color: "#2B3176" }}
            >
              <BarChart3 size={16} className="me-2" />
              Summary
            </h6>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <div className="text-center p-2 bg-white rounded-3 border h-100">
                  <div className="h3 fw-bold text-success mb-1 d-flex align-items-center justify-content-center">
                    <CheckCircle2 size={20} className="me-1" />
                    {accuracy}%
                  </div>
                  <small className="text-muted">Accuracy</small>
                </div>
              </div>
              <div className="col-6">
                <div className="text-center p-2 bg-white rounded-3 border h-100">
                  <div className="h3 fw-bold text-primary mb-1 d-flex align-items-center justify-content-center">
                    <FileText size={20} className="me-1" />
                    {totalQuestions}
                  </div>
                  <small className="text-muted">Total Questions</small>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <div className="progress" style={{ height: "10px" }}>
                <div
                  className={`progress-bar ${accuracy >= 80 ? "bg-success" : accuracy >= 60 ? "bg-warning" : "bg-danger"}`}
                  style={{ width: `${accuracy}%` }}
                />
              </div>
              <div className="d-flex justify-content-between mt-2 small">
                <span className="text-muted d-flex align-items-center">
                  <Target size={12} className="me-1" />
                  Overall Score
                </span>
                <span className="fw-bold">{accuracy}%</span>
              </div>
            </div>
          </div>

          {/* AI Analysis for mobile */}
          {(result?.examAnalysis || result?.successRoadmap) && (
            <div className="mt-4">
              <h6
                className="fw-bold mb-3 d-flex align-items-center"
                style={{ color: "#2B3176" }}
              >
                <Sparkles size={16} className="me-2" />
                AI Insights
              </h6>
              {result?.examAnalysis && (
                <div className="p-3 bg-info-subtle rounded-3 border border-info mb-3 d-flex">
                  <FileText
                    size={16}
                    className="me-2 text-info flex-shrink-0 mt-1"
                  />
                  <p className="small mb-0">{result.examAnalysis}</p>
                </div>
              )}
              {result?.successRoadmap && (
                <div className="p-3 bg-warning-subtle rounded-3 border border-warning d-flex">
                  <Lightbulb
                    size={16}
                    className="me-2 text-warning flex-shrink-0 mt-1"
                  />
                  <p className="small mb-0">{result.successRoadmap}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- DESKTOP VIEW ---
  const activeCategory = categories[activeSlideIndex];
  const activeQuestions = groupedQuestions[activeCategory] || [];

  const handleNext = () => {
    if (activeSlideIndex < categories.length - 1) {
      setActiveSlideIndex(activeSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
  };

  return (
    <div className="card border-0 shadow-lg mt-5 rounded-4 overflow-hidden">
      <div className="card-header bg-white py-4 px-4 border-0">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4
              className="fw-bold mb-1 d-flex align-items-center"
              style={{ color: "#2B3176" }}
            >
              <FileText size={24} className="me-2" />
              Foundational Readiness Review
            </h4>
            <p className="text-muted small mb-0 d-flex align-items-center">
              <Info size={14} className="me-1" />
              Analysis of your background, habits, and logical reasoning skills
            </p>
          </div>

          {/* SCORE SECTION WITH TOOLTIP */}
          <div className="text-end position-relative">
            <div className="d-flex align-items-center justify-content-end gap-2">
              <span
                className="h2 fw-bold mb-0 d-flex align-items-center"
                style={{ color: "#2B3176" }}
              >
                <Target size={24} className="me-2" />
                {accuracy}%
              </span>

              {/* Desktop Tooltip Trigger (Hover) */}
              <div
                className="position-relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                style={{ cursor: "pointer" }}
              >
                <HelpCircle size={18} className="text-muted" />

                {/* The Tooltip Popup (Desktop) */}
                {showTooltip && (
                  <div
                    className="position-absolute p-3 rounded shadow-sm"
                    style={{
                      top: "100%",
                      right: 0,
                      width: "280px",
                      backgroundColor: "#333",
                      color: "#fff",
                      fontSize: "0.85rem",
                      zIndex: 1000,
                      marginTop: "10px",
                      lineHeight: "1.4",
                      textAlign: "left",
                    }}
                  >
                    <TooltipContent />
                  </div>
                )}
              </div>
            </div>
            <div className="text-muted small">Overall Score</div>
          </div>
        </div>

        {/* ✅ PREREQUISITE SCORES SECTION - DESKTOP */}
        {prereqAnalysis && (
          <div
            className="mb-4 p-4 rounded-3 border"
            style={{ background: "rgba(43, 49, 118, 0.02)" }}
          >
            <div className="row align-items-center g-3">
              <div className="col-md-8">
                <h6
                  className="fw-bold mb-3 d-flex align-items-center"
                  style={{ color: "#2B3176" }}
                >
                  <BarChart3 size={20} className="me-2" />
                  Readiness Breakdown
                </h6>
                <div className="row g-3">
                  <div className="col-md-4 col-6">
                    <div className="text-center p-3 bg-white rounded-3 border h-100 d-flex flex-column justify-content-center">
                      <div className="small text-muted mb-2 d-flex align-items-center justify-content-center gap-1">
                        <BookOpen size={16} className="me-1" />
                        Prerequisites
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>{CategoryTooltips.prerequisites}</Tooltip>
                          }
                        >
                          <Info
                            size={14}
                            className="text-muted"
                            style={{ cursor: "pointer" }}
                          />
                        </OverlayTrigger>
                      </div>
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        {getScoreIcon(prereqAnalysis.prerequisites)}
                        <span
                          className={`badge ${getScoreBadgeClass(prereqAnalysis.prerequisites)} fs-6 px-3 py-2 d-inline-block border-0`}
                        >
                          {prereqAnalysis.prerequisites}/5
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-6">
                    <div className="text-center p-3 bg-white rounded-3 border h-100 d-flex flex-column justify-content-center">
                      <div className="small text-muted mb-2 d-flex align-items-center justify-content-center gap-1">
                        <Clock size={16} className="me-1" />
                        Study Habits
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>{CategoryTooltips.studyHabits}</Tooltip>
                          }
                        >
                          <Info
                            size={14}
                            className="text-muted"
                            style={{ cursor: "pointer" }}
                          />
                        </OverlayTrigger>
                      </div>
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        {getScoreIcon(prereqAnalysis.studyHabits)}
                        <span
                          className={`badge ${getScoreBadgeClass(prereqAnalysis.studyHabits)} fs-6 px-3 py-2 d-inline-block border-0`}
                        >
                          {prereqAnalysis.studyHabits}/5
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-6">
                    <div className="text-center p-3 bg-white rounded-3 border h-100 d-flex flex-column justify-content-center">
                      <div className="small text-muted mb-2 d-flex align-items-center justify-content-center gap-1">
                        <Brain size={16} className="me-1" />
                        Problem Solving
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>{CategoryTooltips.problemSolving}</Tooltip>
                          }
                        >
                          <Info
                            size={14}
                            className="text-muted"
                            style={{ cursor: "pointer" }}
                          />
                        </OverlayTrigger>
                      </div>
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        {getScoreIcon(prereqAnalysis.problemSolving)}
                        <span
                          className={`badge ${getScoreBadgeClass(prereqAnalysis.problemSolving)} fs-6 px-3 py-2 d-inline-block border-0`}
                        >
                          {prereqAnalysis.problemSolving}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-3 bg-white rounded-3 border text-center h-100 d-flex flex-column justify-content-center">
                  <div className="small text-muted mb-2 d-flex align-items-center justify-content-center gap-1">
                    <Target size={16} className="me-1" />
                    Overall Readiness
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
                  <div
                    className="h2 fw-bold mb-2 d-flex align-items-center justify-content-center"
                    style={{ color: "#2B3176" }}
                  >
                    {getScoreIcon(prereqAnalysis.overallScore)}
                    {prereqAnalysis.overallScore}/5
                  </div>
                  <span
                    className={`badge ${getScoreBadgeClass(prereqAnalysis.overallScore)} border-0`}
                  >
                    {prereqAnalysis.overallScore >= 4
                      ? "Excellent"
                      : prereqAnalysis.overallScore >= 3
                        ? "Good Progress"
                        : "Needs Improvement"}
                  </span>
                </div>
              </div>
            </div>

            {/* Show warnings if any */}
            {prereqAnalysis.warnings && prereqAnalysis.warnings.length > 0 && (
              <div className="mt-4 p-3 bg-warning-subtle rounded-3 border border-warning">
                <div className="fw-bold mb-2 d-flex align-items-center">
                  <AlertCircle size={18} className="me-2 text-warning" />
                  Areas for Improvement:
                </div>
                <ul className="mb-0 small ms-3">
                  {prereqAnalysis.warnings.map((warning, idx) => (
                    <li key={idx} className="mb-1">
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Show recommendations */}
            {prereqAnalysis.recommendations &&
              prereqAnalysis.recommendations.length > 0 && (
                <div className="mt-3 p-3 bg-info-subtle rounded-3 border border-info">
                  <div className="fw-bold mb-2 d-flex align-items-center">
                    <Lightbulb size={18} className="me-2 text-info" />
                    Recommended Actions:
                  </div>
                  <ul className="mb-0 small ms-3">
                    {prereqAnalysis.recommendations.map((rec, idx) => (
                      <li key={idx} className="mb-1">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}

        {/* Carousel Tabs Navigation */}
        <div className="d-flex gap-2 border-bottom pb-3">
          {categories.map((cat, index) => (
            <button
              key={cat}
              onClick={() => setActiveSlideIndex(index)}
              className={`btn btn-sm rounded-pill px-3 fw-bold transition-all d-flex align-items-center ${
                activeSlideIndex === index
                  ? "btn-primary"
                  : "btn-light text-muted"
              }`}
              style={{
                backgroundColor:
                  activeSlideIndex === index ? "#2B3176" : "#f8f9fa",
                borderColor: activeSlideIndex === index ? "#2B3176" : "#e9ecef",
                color: activeSlideIndex === index ? "white" : "#6c757d",
              }}
            >
              {getCategoryIcon(cat, 16)}
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="card-body p-4">
        {/* CAROUSEL CONTENT AREA */}
        <div className="position-relative" style={{ minHeight: "400px" }}>
          {/* Slide Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5
              className="fw-bold mb-0 d-flex align-items-center"
              style={{ color: "#2B3176" }}
            >
              {activeCategory}
            </h5>
          </div>

          {/* Slide Body (Questions List) */}
          <div className="row">
            {activeQuestions.map((item) => {
              const isStudyHabit = isStudyHabitsQuestion(
                item.subCategory || "",
              );
              // Check if this is a subjective question
              const isSubjective = isSubjectiveQuestion(item);

              return (
                <div key={item.id} className="col-12 mb-3">
                  <div
                    className="p-3 rounded-3 border-start border-3 h-100"
                    style={{
                      borderLeftColor: !item.userAnswer
                        ? "#6c757d"
                        : isSubjective || item.isCorrect
                          ? "#198754"
                          : "#dc3545",
                      background: !item.userAnswer
                        ? "#f8f9fa"
                        : isSubjective || item.isCorrect
                          ? "rgba(25, 135, 84, 0.05)"
                          : "rgba(220, 53, 69, 0.05)",
                    }}
                  >
                    <div className="row align-items-center">
                      <div className="col-md-7">
                        <p
                          className="small fw-bold mb-1 d-flex align-items-start"
                          style={{ color: "#2B3176" }}
                        >
                          <span>{item.questionText}</span>
                        </p>
                        {isStudyHabit && (
                          <span className="badge bg-success-subtle text-success border border-success small d-inline-flex align-items-center">
                            <Clock size={12} className="me-1" />
                            Self-Assessment
                          </span>
                        )}
                      </div>
                      <div className="col-md-5 border-start">
                        <div className="small ps-md-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="text-muted d-flex align-items-center">
                              <CheckCircle2 size={12} className="me-1" />
                              Your Answer:
                            </span>
                            <span
                              className={`fw-bold d-flex align-items-center ${isSubjective || item.isCorrect ? "text-success" : "text-danger"}`}
                            >
                              {isSubjective || item.isCorrect ? (
                                <CheckCircle2 size={14} className="me-1" />
                              ) : (
                                <XCircle size={14} className="me-1" />
                              )}
                              {item.userAnswer || "Skipped"}
                            </span>
                          </div>
                          {/* Only show correct answer for objective questions that are wrong */}
                          {!isSubjective &&
                            !item.isCorrect &&
                            item.userAnswer && (
                              <div className="d-flex justify-content-between">
                                <span className="text-muted">Correct:</span>
                                <span className="text-success fw-bold d-flex align-items-center">
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

        {/* Carousel Navigation Buttons */}
        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
          <button
            className="btn btn-outline-secondary px-4 d-flex align-items-center"
            onClick={handlePrev}
            disabled={activeSlideIndex === 0}
            style={{ opacity: activeSlideIndex === 0 ? 0.5 : 1 }}
          >
            <ChevronDown
              size={16}
              className="me-1 rotate-90"
              style={{ transform: "rotate(90deg)" }}
            />
            Previous Category
          </button>

          <div className="text-muted small d-flex align-items-center">
            <BarChart3 size={14} className="me-1" />
            Slide {activeSlideIndex + 1} of {categories.length}
          </div>

          <button
            className="btn btn-primary px-4 d-flex align-items-center"
            onClick={handleNext}
            disabled={activeSlideIndex === categories.length - 1}
            style={{
              backgroundColor: "#2B3176",
              opacity: activeSlideIndex === categories.length - 1 ? 0.5 : 1,
            }}
          >
            Next Category
            <ChevronDown
              size={16}
              className="ms-1 rotate-270"
              style={{ transform: "rotate(270deg)" }}
            />
          </button>
        </div>

        {/* SUMMARY & AI SECTION (Static Footer) */}
        <div
          className="mt-5 p-4 rounded-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(43, 49, 118, 0.05) 0%, rgba(236, 35, 38, 0.05) 100%)",
            border: "1px solid rgba(43, 49, 118, 0.1)",
          }}
        >
          {/* AI Analysis */}
          <div className="row g-3">
            {/* AI Analysis */}
            {result?.examAnalysis && (
              <div className="p-3 bg-info-subtle rounded-3 border border-info-subtle d-flex">
                <FileText
                  size={18}
                  className="me-2 text-info flex-shrink-0 mt-1"
                />
                <div>
                  <h6 className="fw-bold mb-2 d-flex align-items-center">
                    <Sparkles size={16} className="me-1" />
                    AI Evaluation
                  </h6>
                  <p className="small mb-0">{result.examAnalysis}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoundationalExamCard;
