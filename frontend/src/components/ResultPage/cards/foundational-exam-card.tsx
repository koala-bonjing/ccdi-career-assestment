import React, { useEffect, useState } from "react";
import { FOUNDATIONAL_QUESTIONS_MAP } from "../../../config/foundationalQuesdtions";
import type { AssessmentResult } from "../../../types";

interface Props {
  userAnswers: Record<string, string>;
  result: AssessmentResult;
}

interface GroupSection {
  id: string;
  questionText: string;
  correctAnswer: string;
  helperText: string;
  userAnswer: string;
  isCorrect: boolean;
  isSubjective: boolean;
}

const FoundationalExamCard: React.FC<Props> = ({ result, userAnswers }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // New state for Desktop Carousel
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // State for Tooltip (Shared logic, but triggered differently on mobile/desktop)
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

  const questionEntries = Object.entries(FOUNDATIONAL_QUESTIONS_MAP);
  let correctCount = 0;
  const totalQuestions = questionEntries.length;

  // Group questions by category
  const groupedQuestions = questionEntries.reduce(
    (acc, [id, data]) => {
      const userAnswerValue = userAnswers[id] || userAnswers[data.text];
      const isCorrect = userAnswerValue === data.correct;

      if (isCorrect && userAnswerValue) correctCount++;

      let category = "General";
      if (id.includes("prereq")) category = "Prerequisites";
      if (id.includes("study")) category = "Study Habits";
      if (id.includes("problem")) category = "Problem Solving";

      if (!acc[category]) acc[category] = [];

      acc[category].push({
        id,
        questionText: data.text,
        correctAnswer: data.correct,
        helperText: data.helper,
        userAnswer: userAnswerValue,
        isCorrect,
        isSubjective: data.isSubjective || id.startsWith("found_study"),
      });

      return acc;
    },
    {} as Record<string, GroupSection[]>,
  );

  const categories = Object.keys(groupedQuestions);
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

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
        This score aggregates both your <strong>objective knowledge</strong> and
        your <strong>subjective habits</strong>.
        <br />
        <br />
        Subjective answers (like study habits) are scored based on alignment
        with recommended success strategies.
      </div>
    </>
  );

  // --- MOBILE VIEW ---
  if (isMobile) {
    return (
      <div className="card border-0 shadow-lg mt-5 rounded-4 overflow-hidden">
        <div className="card-header bg-white py-3 px-3 border-0">
          <h4
            className="fw-bold mb-1"
            style={{ color: "#2B3176", fontSize: "1.1rem" }}
          >
            Foundational Readiness
          </h4>
          <div className="d-flex justify-content-between align-items-center">
            <p className="text-muted mb-0 small">
              Tap categories to view details
            </p>

            {/* Mobile Score & Tooltip Wrapper */}
            <div className="d-flex align-items-center gap-1 position-relative">
              <span
                className={`badge ${accuracy >= 80 ? "bg-success" : accuracy >= 60 ? "bg-warning" : "bg-danger"}`}
              >
                {accuracy}%
              </span>
              {/* Tooltip Icon (Click to Toggle on Mobile) */}
              <div
                onClick={() => setShowTooltip(!showTooltip)}
                style={{ cursor: "pointer" }}
                className="text-muted"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
                  onClick={() => setShowTooltip(false)} // Click tooltip to close it as well
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
        </div>

        <div className="card-body p-3">
          {/* Mobile Accordion */}
          {categories.map((category) => {
            const questions = groupedQuestions[category];
            const correctInCat = questions.filter((q) => q.isCorrect).length;
            const catScore = Math.round(
              (correctInCat / questions.length) * 100,
            );

            return (
              <div key={category} className="mb-3">
                <button
                  className="w-100 text-start p-3 border-0 rounded-3 d-flex justify-content-between align-items-center"
                  style={{
                    background:
                      expandedSection === category
                        ? "rgba(43, 49, 118, 0.05)"
                        : "#f8f9fa",
                    transition: "all 0.2s ease",
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
                      {correctInCat}/{questions.length} correct • {catScore}%
                    </small>
                  </div>
                  <span className="text-muted">
                    {expandedSection === category ? "−" : "+"}
                  </span>
                </button>

                {expandedSection === category && (
                  <div className="mt-2">
                    {questions.map((item) => (
                      <div
                        key={item.id}
                        className="mb-2 p-2 rounded-3 border-start border-3"
                        style={{
                          borderLeftColor: !item.userAnswer
                            ? "#6c757d"
                            : item.isCorrect
                              ? "#198754"
                              : "#dc3545",
                          background: !item.userAnswer
                            ? "#f8f9fa"
                            : item.isCorrect
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

                        <div className="small">
                          <div className="mb-1">
                            <span className="text-muted">Your answer: </span>
                            <span
                              className={`fw-bold ${item.isCorrect ? "text-success" : "text-danger"}`}
                            >
                              {item.userAnswer || "Skipped"}
                            </span>
                          </div>

                          {!item.isCorrect && item.userAnswer && (
                            <div className="mb-1">
                              <span className="text-muted">
                                {item.isSubjective ? "💡 " : "✅ "}
                                {item.isSubjective
                                  ? "Recommended: "
                                  : "Correct: "}
                              </span>
                              <span className="text-success fw-bold">
                                {item.correctAnswer}
                              </span>
                            </div>
                          )}

                          {!item.isCorrect &&
                            item.userAnswer &&
                            item.helperText && (
                              <div className="text-muted fst-italic mt-1 small">
                                {item.helperText}
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Summary for mobile */}
          <div className="mt-4 p-3 rounded-3 border bg-light">
            <h6 className="fw-bold mb-2" style={{ color: "#2B3176" }}>
              Summary
            </h6>
            <div className="row g-2">
              <div className="col-6">
                <div className="text-center p-2 bg-white rounded-2 border">
                  <div className="h4 fw-bold text-success mb-0">
                    {correctCount}
                  </div>
                  <small className="text-muted">Correct</small>
                </div>
              </div>
              <div className="col-6">
                <div className="text-center p-2 bg-white rounded-2 border">
                  <div className="h4 fw-bold text-danger mb-0">
                    {totalQuestions - correctCount}
                  </div>
                  <small className="text-muted">To Improve</small>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <div className="progress" style={{ height: "8px" }}>
                <div
                  className={`progress-bar ${accuracy >= 80 ? "bg-success" : accuracy >= 60 ? "bg-warning" : "bg-danger"}`}
                  style={{ width: `${accuracy}%` }}
                />
              </div>
              <div className="d-flex justify-content-between mt-1 small">
                <span className="text-muted">Overall Score</span>
                <span className="fw-bold">{accuracy}%</span>
              </div>
            </div>
          </div>

          {/* AI Analysis for mobile */}
          {(result?.examAnalysis || result?.successRoadMap) && (
            <div className="mt-4">
              <h6 className="fw-bold mb-2" style={{ color: "#2B3176" }}>
                AI Insights
              </h6>
              {result?.examAnalysis && (
                <div className="p-3 bg-info-subtle rounded-3 border border-info mb-2">
                  <p className="small mb-0">{result.examAnalysis}</p>
                </div>
              )}
              {result?.successRoadMap && (
                <div className="p-3 bg-warning-subtle rounded-3 border border-warning">
                  <p className="small mb-0">{result.successRoadMap}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- DESKTOP VIEW (CAROUSEL / SLIDES WITH HOVER TOOLTIP) ---

  const activeCategory = categories[activeSlideIndex];
  const activeQuestions = groupedQuestions[activeCategory];
  const activeCorrect = activeQuestions.filter((q) => q.isCorrect).length;

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
            <div className="badge bg-light text-dark border px-3 py-2">
              Scored: {activeCorrect} / {activeQuestions.length}
            </div>
          </div>

          {/* Slide Body (Questions List) */}
          <div className="row">
            {activeQuestions.map((item) => (
              <div key={item.id} className="col-12 mb-3">
                <div
                  className="p-3 rounded-3 border-start border-3 h-100"
                  style={{
                    borderLeftColor: !item.userAnswer
                      ? "#6c757d"
                      : item.isCorrect
                        ? "#198754"
                        : "#dc3545",
                    background: !item.userAnswer
                      ? "#f8f9fa"
                      : item.isCorrect
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
                      {!item.isCorrect &&
                        item.userAnswer &&
                        item.helperText && (
                          <div className="small text-muted fst-italic mt-1">
                            {item.helperText}
                          </div>
                        )}
                    </div>
                    <div className="col-md-5 border-start">
                      <div className="small ps-md-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Your Answer:</span>
                          <span
                            className={`fw-bold ${item.isCorrect ? "text-success" : "text-danger"}`}
                          >
                            {item.userAnswer || "Skipped"}
                          </span>
                        </div>
                        {!item.isCorrect && item.userAnswer && (
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">
                              {item.isSubjective ? "Recommended:" : "Correct:"}
                            </span>
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
            ))}
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
                className={`${result?.successRoadMap ? "col-md-6" : "col-12"}`}
              >
                <div className="p-3 bg-info-subtle rounded-3 h-100 border border-info-subtle">
                  <h6 className="fw-bold mb-2">📊 AI Evaluation</h6>
                  <p className="small mb-0">{result.examAnalysis}</p>
                </div>
              </div>
            )}
            {result?.successRoadMap && (
              <div
                className={`${result?.examAnalysis ? "col-md-6" : "col-12"}`}
              >
                <div className="p-3 bg-warning-subtle rounded-3 h-100 border border-warning-subtle">
                  <h6 className="fw-bold mb-2">🗺️ Success Roadmap</h6>
                  <p className="small mb-0">{result.successRoadMap}</p>
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
