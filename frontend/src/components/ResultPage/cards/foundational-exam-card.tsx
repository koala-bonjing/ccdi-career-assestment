import React from "react";
import { FOUNDATIONAL_QUESTIONS_MAP } from "../../../config/foundationalQuesdtions";
import type { AssessmentResult } from "../../../types";

interface Props {
  userAnswers: Record<string, string>;
  result: AssessmentResult;
}

const FoundationalExamCard: React.FC<Props> = ({ result, userAnswers }) => {
  const questionEntries = Object.entries(FOUNDATIONAL_QUESTIONS_MAP);
  let correctCount = 0;
  const totalQuestions = questionEntries.length;

  // Process data for the display
  const processedResults = questionEntries.map(([id, data]) => {
    // Lookup by ID or Text key
    const userAnswerValue = userAnswers[id] || userAnswers[data.text];
    const isCorrect = userAnswerValue === data.correct;

    if (isCorrect && userAnswerValue) {
      correctCount++;
    }

    return {
      id,
      questionText: data.text,
      correctAnswer: data.correct,
      helperText: data.helper,
      userAnswer: userAnswerValue,
      isCorrect,
      // Subjective label if study-habit or explicitly marked
      isSubjective: data.isSubjective || id.startsWith("found_study"),
    };
  });

  if (!userAnswers || Object.keys(userAnswers).length === 0) {
    return (
      <div className="card border-0 shadow-sm mt-5 p-4 text-center">
        <p className="text-muted">No foundational assessment data available.</p>
      </div>
    );
  }

  return (
    <div
      className="card border-0 shadow-lg mt-5"
      style={{ borderRadius: "24px" }}
    >
      <div className="card-header bg-white py-4 border-0">
        <h4 className="fw-bold mb-0" style={{ color: "#2B3176" }}>
          Foundational Readiness Review
        </h4>
        <p className="text-muted small mb-0">
          Analysis of your background, habits, and logical reasoning skills
        </p>
      </div>

      <div className="card-body p-4">
        <div className="row g-3">
          {processedResults.map((item) => (
            <div key={item.id} className="col-12">
              <div
                className={`p-3 rounded-4 border-start border-4 ${
                  !item.userAnswer
                    ? "bg-light border-secondary opacity-50"
                    : item.isCorrect
                      ? "bg-success-subtle border-success"
                      : "bg-danger-subtle border-danger"
                }`}
              >
                <p
                  className="fw-bold mb-2"
                  style={{ fontSize: "0.95rem", color: "#2B3176" }}
                >
                  {item.questionText}
                </p>

                <div className="d-flex flex-wrap gap-3 align-items-center">
                  <div className="small">
                    <span className="text-muted">Your Response: </span>
                    <span
                      className={
                        item.isCorrect
                          ? "text-success fw-bold"
                          : "text-danger fw-bold"
                      }
                    >
                      {item.userAnswer || "Skipped"}
                    </span>
                  </div>

                  {!item.isCorrect && item.userAnswer && (
                    <div className="small d-flex align-items-center">
                      <span className="text-muted me-1">
                        {item.isSubjective
                          ? "💡 Recommended:"
                          : "✅ Correct Answer:"}
                      </span>
                      <span className="text-success fw-bold">
                        {item.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>

                {!item.isCorrect && item.userAnswer && (
                  <div className="mt-2 p-2 bg-white rounded-3 small text-muted border border-light">
                    <span style={{ fontStyle: "italic" }}>
                      {item.helperText}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Accuracy Summary */}
        <div
          className="mt-5 p-4 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(43, 49, 118, 0.05) 0%, rgba(236, 35, 38, 0.05) 100%)",
            borderRadius: "18px",
            border: "1px solid rgba(43, 49, 118, 0.1)",
          }}
        >
          <div className="h4 fw-bold mb-1" style={{ color: "#2B3176" }}>
            Readiness Alignment:{" "}
            {Math.round((correctCount / totalQuestions) * 100)}%
          </div>
          {result?.examAnalysis && (
            <div className="alert alert-info mt-4">
              <h6 className="fw-bold">
                AI Evaluation of Your Foundational Assessment:
              </h6>
              <p className="mb-0">{result.examAnalysis}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoundationalExamCard;
