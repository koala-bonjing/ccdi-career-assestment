import React from "react";
// Ensure the import path to your map file is correct
import { FOUNDATIONAL_QUESTIONS_MAP } from "../../../config/foundationalQuesdtions";

interface Props {
  userAnswers: Record<string, string>;
}

const FoundationalExamCard: React.FC<Props> = ({ userAnswers }) => {
  // 1. Convert the Map into an array we can loop through
  const questionEntries = Object.entries(FOUNDATIONAL_QUESTIONS_MAP);

  let correctCount = 0;
  const totalQuestions = questionEntries.length;

  // 2. Map the data and check for matches
  const processedResults = questionEntries.map(([id, data]) => {
    // BRIDGE THE GAP: Check if answer is stored by ID OR by the Text
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
    };
  });

  // 3. If there are absolutely no answers found at all
  if (!userAnswers || Object.keys(userAnswers).length === 0) {
    return (
      <div className="card border-0 shadow-sm mt-5 p-4 text-center">
        <p className="text-muted">No foundational assessment data available.</p>
      </div>
    );
  }

  return (
    <div
      className="card border-0 shadow-sm mt-5"
      style={{ borderRadius: "20px" }}
    >
      <div className="card-header bg-white py-4 border-0">
        <h4 className="fw-bold mb-0" style={{ color: "#2B3176" }}>
          Foundational Assessment Review
        </h4>
        <p className="text-muted small mb-0">
          Comparing your logical and technical responses to program requirements
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
                  style={{ fontSize: "0.9rem", color: "#333" }}
                >
                  {item.questionText}
                </p>

                <div className="d-flex flex-wrap gap-3">
                  <div className="small">
                    <span className="text-muted">Your Answer: </span>
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
                    <div className="small">
                      <span className="text-muted">Correct Answer: </span>
                      <span className="text-success fw-bold">
                        {item.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>

                {!item.isCorrect && item.userAnswer && (
                  <div className="mt-2 p-2 bg-white rounded-3 small text-muted">
                    💡{" "}
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
        <div className="mt-4 p-4 bg-light rounded-4 text-center">
          <div className="h5 fw-bold mb-1" style={{ color: "#2B3176" }}>
            Foundational Accuracy:{" "}
            {Math.round((correctCount / totalQuestions) * 100)}%
          </div>
          <div className="text-muted small">
            You answered {correctCount} out of {totalQuestions} questions
            correctly.
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoundationalExamCard;
