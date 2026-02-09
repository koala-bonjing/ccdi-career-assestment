import React, { useEffect, useState } from "react";
import type { AssessmentResult } from "../../../types";
import type { Question } from "../../../hooks/useAssessmentQuestions";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Info } from "lucide-react";

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

  const isStudyHabitsQuestion = (subCategory: string) => {
    return (
      subCategory.toLowerCase().includes("studyhabits") ||
      subCategory.toLowerCase().includes("study habits") ||
      subCategory.toLowerCase().includes("study_habits")
    );
  };

  // Common Tooltip Content
  const TooltipContent = () => (
    <>
      <div
        className="fw-bold mb-1 border-bottom border-light pb-1"
        style={{ borderColor: "rgba(255,255,255,0.2)" }}
      >
        How is this scored?
      </div>
      <div>
        Your foundational score is calculated based on:
        <br />
        <br />• <strong>Multiple Choice</strong>: Exact match with correct
        answer
        <br />• <strong>Self-Assessment</strong>: Based on proficiency level you
        selected
        <br />• <strong>Open-Ended</strong>: AI evaluates understanding (0-100%)
        <br />
        <br />
        Final score = (Points Earned / Total Possible Points) × 100%
      </div>
    </>
  );

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
              className="fw-bold mb-0"
              style={{ color: "#2B3176", fontSize: "1.1rem" }}
            >
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  className="bi bi-question-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
                </svg>
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
          <p className="text-muted mb-0 small">
            Tap categories to view details
          </p>
        </div>

        <div className="card-body p-3">
          {/* ✅ PREREQUISITE SCORES SECTION - MOBILE */}
          {prereqAnalysis && (
            <div
              className="mb-4 p-3 rounded-3 border"
              style={{ background: "rgba(43, 49, 118, 0.03)" }}
            >
              <h6
                className="fw-bold mb-3 text-center"
                style={{ color: "#2B3176" }}
              >
                📊 Readiness Breakdown
              </h6>

              <div className="row g-2 mb-3">
                <div className="col-4">
                  <div className="p-2 bg-white rounded-3 border text-center h-100 d-flex flex-column justify-content-center">
                    <div
                      className="text-muted mb-2 d-flex align-items-center justify-content-center gap-1"
                      style={{ fontSize: "0.7rem" }}
                    >
                      <span>Prerequisites</span>
                      <span
                        className="badge bg-secondary flex-shrink-0"
                        style={{
                          cursor: "help",
                          fontSize: "0.6rem",
                          width: "14px",
                          height: "14px",
                          padding: "0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title={CategoryTooltips.prerequisites}
                      >
                        ?
                      </span>
                    </div>
                    <span
                      className={`badge ${getScoreBadgeClass(prereqAnalysis.prerequisites)}`}
                      style={{ fontSize: "0.85rem" }}
                    >
                      {prereqAnalysis.prerequisites}/5
                    </span>
                  </div>
                </div>

                <div className="col-4">
                  <div className="p-2 bg-white rounded-3 border text-center h-100 d-flex flex-column justify-content-center">
                    <div
                      className="text-muted mb-2 d-flex align-items-center justify-content-center gap-1"
                      style={{ fontSize: "0.7rem" }}
                    >
                      <span>Study Habits</span>
                      <span
                        className="badge bg-secondary flex-shrink-0"
                        style={{
                          cursor: "help",
                          fontSize: "0.6rem",
                          width: "14px",
                          height: "14px",
                          padding: "0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title={CategoryTooltips.studyHabits}
                      >
                        ?
                      </span>
                    </div>
                    <span
                      className={`badge ${getScoreBadgeClass(prereqAnalysis.studyHabits)}`}
                      style={{ fontSize: "0.85rem" }}
                    >
                      {prereqAnalysis.studyHabits}/5
                    </span>
                  </div>
                </div>

                <div className="col-4">
                  <div className="p-2 bg-white rounded-3 border text-center h-100 d-flex flex-column justify-content-center">
                    <div
                      className="text-muted mb-2 d-flex align-items-center justify-content-center gap-1"
                      style={{ fontSize: "0.7rem" }}
                    >
                      <span>Problem Solving</span>
                      <span
                        className="badge bg-secondary flex-shrink-0"
                        style={{
                          cursor: "help",
                          fontSize: "0.6rem",
                          width: "14px",
                          height: "14px",
                          padding: "0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title={CategoryTooltips.problemSolving}
                      >
                        ?
                      </span>
                    </div>
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
              <div className="p-3 bg-white rounded-3 border text-center mt-2">
                <div className="small text-muted mb-2">Overall Readiness</div>
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <span
                    className={`badge ${getScoreBadgeClass(prereqAnalysis.overallScore)} fs-4 px-3 py-2`}
                  >
                    {prereqAnalysis.overallScore}/5
                  </span>
                  <span className="small text-muted">
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
                    <div className="small fw-bold mb-2">
                      ⚠️ Areas to Improve:
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
            const catScore = Math.round(
              (correctInCat / questionsInCategory.length) * 100,
            );

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
                    <h6 className="fw-bold mb-1" style={{ color: "#2B3176" }}>
                      {category}
                    </h6>
                    <small className="text-muted">
                      {correctInCat}/{questionsInCategory.length} correct •{" "}
                      {catScore}%
                    </small>
                  </div>
                  <span className="text-muted fs-5">
                    {expandedSection === category ? "−" : "+"}
                  </span>
                </button>

                {expandedSection === category && (
                  <div className="mt-3">
                    {questionsInCategory.map((item) => {
                      const isStudyHabit = isStudyHabitsQuestion(
                        item.subCategory || "",
                      );

                      return (
                        <div
                          key={item.id}
                          className="mb-3 p-3 rounded-3 border-start border-3"
                          style={{
                            borderLeftColor: !item.userAnswer
                              ? "#6c757d"
                              : isStudyHabit || item.isCorrect
                                ? "#198754"
                                : "#dc3545",
                            background: !item.userAnswer
                              ? "#f8f9fa"
                              : isStudyHabit || item.isCorrect
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
                            <span className="badge bg-success-subtle text-success border border-success small mb-2">
                              Self-Assessment
                            </span>
                          )}

                          <div className="small">
                            <div className="mb-2">
                              <span className="text-muted">Your answer: </span>
                              <span
                                className={`fw-bold ${isStudyHabit || item.isCorrect ? "text-success" : "text-danger"}`}
                              >
                                {item.userAnswer || "Skipped"}
                              </span>
                            </div>

                            {/* Only show correct answer for non-study-habit questions */}
                            {!isStudyHabit &&
                              !item.isCorrect &&
                              item.userAnswer && (
                                <div className="mb-1">
                                  <span className="text-muted">
                                    ✅ Correct:{" "}
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
            <h6 className="fw-bold mb-3" style={{ color: "#2B3176" }}>
              Summary
            </h6>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <div className="text-center p-2 bg-white rounded-3 border h-100">
                  <div className="h3 fw-bold text-success mb-1">
                    {accuracy}%
                  </div>
                  <small className="text-muted">Accuracy</small>
                </div>
              </div>
              <div className="col-6">
                <div className="text-center p-2 bg-white rounded-3 border h-100">
                  <div className="h3 fw-bold text-primary mb-1">
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
                <span className="text-muted">Overall Score</span>
                <span className="fw-bold">{accuracy}%</span>
              </div>
            </div>
          </div>

          {/* AI Analysis for mobile */}
          {(result?.examAnalysis || result?.successRoadmap) && (
            <div className="mt-4">
              <h6 className="fw-bold mb-3" style={{ color: "#2B3176" }}>
                AI Insights
              </h6>
              {result?.examAnalysis && (
                <div className="p-3 bg-info-subtle rounded-3 border border-info mb-3">
                  <p className="small mb-0">{result.examAnalysis}</p>
                </div>
              )}
              {result?.successRoadmap && (
                <div className="p-3 bg-warning-subtle rounded-3 border border-warning">
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
            <h4 className="fw-bold mb-1" style={{ color: "#2B3176" }}>
              Foundational Readiness Review
            </h4>
            <p className="text-muted small mb-0">
              Analysis of your background, habits, and logical reasoning skills
            </p>
          </div>

          {/* SCORE SECTION WITH TOOLTIP */}
          <div className="text-end position-relative">
            <div className="d-flex align-items-center justify-content-end gap-2">
              <span className="h2 fw-bold mb-0" style={{ color: "#2B3176" }}>
                {accuracy}%
              </span>

              {/* Desktop Tooltip Trigger (Hover) */}
              <div
                className="position-relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                style={{ cursor: "pointer" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="#6c757d"
                  className="bi bi-question-circle-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
                </svg>

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
                <h6 className="fw-bold mb-3" style={{ color: "#2B3176" }}>
                  📊 Readiness Breakdown
                </h6>
                <div className="row g-3">
                  <div className="col-md-4 col-6">
                    <div className="text-center p-3 bg-white rounded-3 border h-100 d-flex flex-column justify-content-center">
                      <div className="small text-muted mb-2 d-flex align-items-center justify-content-center gap-1">
                        Prerequisites
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>{CategoryTooltips.prerequisites}</Tooltip>
                          }
                        >
                          <Info
                            size={isMobile ? 14 : 18}
                            className="text-muted"
                            style={{ cursor: "pointer" }}
                          />
                        </OverlayTrigger>
                      </div>
                      <span
                        className={`badge ${getScoreBadgeClass(prereqAnalysis.prerequisites)} fs-6 px-3 py-2 d-inline-block border-0`}
                      >
                        {prereqAnalysis.prerequisites}/5
                      </span>
                    </div>
                  </div>
                  <div className="col-md-4 col-6">
                    <div className="text-center p-3 bg-white rounded-3 border h-100 d-flex flex-column justify-content-center">
                      <div className="small text-muted mb-2 d-flex align-items-center justify-content-center gap-1">
                        Study Habits
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>{CategoryTooltips.studyHabits}</Tooltip>
                          }
                        >
                          <Info
                            size={isMobile ? 14 : 18}
                            className="text-muted"
                            style={{ cursor: "pointer" }}
                          />
                        </OverlayTrigger>
                      </div>
                      <span
                        className={`badge ${getScoreBadgeClass(prereqAnalysis.studyHabits)} fs-6 px-3 py-2 d-inline-block border-0`}
                      >
                        {prereqAnalysis.studyHabits}/5
                      </span>
                    </div>
                  </div>
                  <div className="col-md-4 col-6">
                    <div className="text-center p-3 bg-white rounded-3 border h-100 d-flex flex-column justify-content-center">
                      <div className="small text-muted mb-2 d-flex align-items-center justify-content-center gap-1">
                        Problem Solving
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip>{CategoryTooltips.problemSolving}</Tooltip>
                          }
                        >
                          <Info
                            size={isMobile ? 14 : 18}
                            className="text-muted"
                            style={{ cursor: "pointer" }}
                          />
                        </OverlayTrigger>
                      </div>
                      <span
                        className={`badge ${getScoreBadgeClass(prereqAnalysis.problemSolving)} fs-6 px-3 py-2 d-inline-block border-0`}
                      >
                        {prereqAnalysis.problemSolving}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-3 bg-white rounded-3 border text-center h-100 d-flex flex-column justify-content-center">
                  <div className="small text-muted mb-2 d-flex align-items-center justify-content-center gap-1">
                    Overall Readiness
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>{CategoryTooltips.overall}</Tooltip>}
                    >
                      <i
                        className="bi bi-info-circle"
                        style={{ cursor: "help", fontSize: "0.75rem" }}
                      ></i>
                    </OverlayTrigger>
                  </div>
                  <div className="h2 fw-bold mb-2" style={{ color: "#2B3176" }}>
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
                <div className="fw-bold mb-2">⚠️ Areas for Improvement:</div>
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
                  <div className="fw-bold mb-2">💡 Recommended Actions:</div>
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
              className={`btn btn-sm rounded-pill px-3 fw-bold transition-all ${
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
            <h5 className="fw-bold mb-0" style={{ color: "#2B3176" }}>
              {activeCategory}
            </h5>
          </div>

          {/* Slide Body (Questions List) */}
          <div className="row">
            {activeQuestions.map((item) => {
              const isStudyHabit = isStudyHabitsQuestion(
                item.subCategory || "",
              );

              return (
                <div key={item.id} className="col-12 mb-3">
                  <div
                    className="p-3 rounded-3 border-start border-3 h-100"
                    style={{
                      borderLeftColor: !item.userAnswer
                        ? "#6c757d"
                        : isStudyHabit || item.isCorrect
                          ? "#198754"
                          : "#dc3545",
                      background: !item.userAnswer
                        ? "#f8f9fa"
                        : isStudyHabit || item.isCorrect
                          ? "rgba(25, 135, 84, 0.05)"
                          : "rgba(220, 53, 69, 0.05)",
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
                          <span className="badge bg-success-subtle text-success border border-success small">
                            Self-Assessment
                          </span>
                        )}
                      </div>
                      <div className="col-md-5 border-start">
                        <div className="small ps-md-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="text-muted">Your Answer:</span>
                            <span
                              className={`fw-bold ${isStudyHabit || item.isCorrect ? "text-success" : "text-danger"}`}
                            >
                              {item.userAnswer || "Skipped"}
                            </span>
                          </div>
                          {/* Only show correct answer for non-study-habit questions */}
                          {!isStudyHabit &&
                            !item.isCorrect &&
                            item.userAnswer && (
                              <div className="d-flex justify-content-between">
                                <span className="text-muted">Correct:</span>
                                <span className="text-success fw-bold">
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
            className="btn btn-outline-secondary px-4"
            onClick={handlePrev}
            disabled={activeSlideIndex === 0}
            style={{ opacity: activeSlideIndex === 0 ? 0.5 : 1 }}
          >
            ← Previous Category
          </button>

          <div className="text-muted small">
            Slide {activeSlideIndex + 1} of {categories.length}
          </div>

          <button
            className="btn btn-primary px-4"
            onClick={handleNext}
            disabled={activeSlideIndex === categories.length - 1}
            style={{
              backgroundColor: "#2B3176",
              opacity: activeSlideIndex === categories.length - 1 ? 0.5 : 1,
            }}
          >
            Next Category →
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
            {result?.examAnalysis && (
              <div
                className={`${result?.successRoadmap ? "col-md-6" : "col-12"}`}
              >
                <div className="p-3 bg-info-subtle rounded-3 h-100 border border-info-subtle">
                  <h6 className="fw-bold mb-2">📊 AI Evaluation</h6>
                  <p className="small mb-0">{result.examAnalysis}</p>
                </div>
              </div>
            )}
            {result?.successRoadmap && (
              <div
                className={`${result?.examAnalysis ? "col-md-6" : "col-12"}`}
              >
                <div className="p-3 bg-warning-subtle rounded-3 h-100 border border-warning-subtle">
                  <h6 className="fw-bold mb-2">🗺️ What to do next?</h6>
                  <p className="small mb-0">
                    {result.prereqAnalysis?.recommendations}
                  </p>
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
