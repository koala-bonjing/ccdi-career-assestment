import React from "react";
import { useEvaluationStore } from "../../../store/useEvaluationStore";

type ObjectBasedQuestionProps = {
  section: string; // ✅ Add section so we can namespace the keys
  sectionQuestions: Record<string, string[]>;
};

const ObjectBasedQuestion: React.FC<ObjectBasedQuestionProps> = ({ section, sectionQuestions }) => {
  const { answers, updateAnswer } = useEvaluationStore();

  return (
    <>
      {Object.entries(sectionQuestions).map(([question, options]) => {
        const answerKey = `${section}_${question}`; // ✅ Unique per section

        return (
          <div key={answerKey} className="question-item">
            <label>{question}</label>
            {options.map((option) => (
              <div key={option}>
                <label>
                  <input
                    type="radio"
                    name={answerKey}
                    value={option}
                    checked={answers[answerKey] === option}
                    onChange={() => updateAnswer(answerKey, option)}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
};

export default ObjectBasedQuestion;
