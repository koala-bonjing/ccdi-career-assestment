import React from "react";
import { useEvaluationStore } from "../../../store/useEvaluationStore";

type ArrayBasedQuestionProps = {
  data: string[];
  section: string;
};

const ArrayBasedQuestion: React.FC<ArrayBasedQuestionProps> = ({ data, section }) => {
  const { answers, updateAnswer } = useEvaluationStore();
  const options = [1, 2, 3, 4, 5];

  return (
    <div>
      {data.map((question) => {
        // Build the full answer key for this question
        const answerKey = `${section}_${question}`;

        return (
          <div key={answerKey} className="question-item">
            <label>{question}</label>

            {section === "careerInterest" ? (
              <div
                className="scale-options"
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "5px",
                }}
              >
                {options.map((value) => (
                  <label className="pointer-label" key={value}>
                    <input
                      type="radio"
                      name={answerKey}
                      value={value}
                      checked={answers[answerKey] === value}
                      onChange={() => updateAnswer(answerKey, value)}
                    />
                    {value}
                  </label>
                ))}
              </div>
            ) : (
              <div style={{ marginTop: "5px" }}>
                <label className="pointer-label">
                  <input
                    type="checkbox"
                    checked={!!answers[answerKey]}
                    onChange={(e) => updateAnswer(answerKey, e.target.checked)}
                    style={{ marginRight: "5px" }}
                  />
                  Select
                </label>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ArrayBasedQuestion;
