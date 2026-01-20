// src/components/AssessmentForm/question-sections/prerequisites.tsx
import React from "react";
import type { AssessmentSectionProps } from "../types";

export const PrerequisitesSection: React.FC<AssessmentSectionProps> = ({
  questions,
  formData,
  onChange,
  onNext,
  onPrevious,
}) => {
  return (
    <div className="section-container">
      <h2>Foundational Readiness</h2>
      <p>
        These questions help us understand if you're prepared for the specific
        demands of these programs.
      </p>

      {questions.map((q) => (
        <div key={q._id} className="question-block">
          <label>{q.questionText}</label>
          <div className="options-grid">
            {q.options!.map((option) => (
              <button
                key={option}
                className={`option-btn ${formData.prerequisites[q.questionText] === option ? "active" : ""}`}
                onClick={() =>
                  onChange("prerequisites", q.questionText, option)
                }
              >
                {option}
              </button>
            ))}
          </div>
          <small className="helper-text">{q.helperText}</small>
        </div>
      ))}

      <div className="navigation-btns">
        <button onClick={onPrevious}>Previous</button>
        <button onClick={onNext}>Next</button>
      </div>
    </div>
  );
};
