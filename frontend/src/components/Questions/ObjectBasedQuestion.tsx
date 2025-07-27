import React from "react";
import { useEvaluationStore } from "../../../store/useEvaluationStore";

type ObjectBasedQuestionProps = {
  sectionQuestions: Record<string, string[]>;
};

const ObjectBasedQuestion: React.FC<ObjectBasedQuestionProps> = ({ sectionQuestions }) => {
  const { answers, updateAnswer } = useEvaluationStore();

  return (
    <>
      {Object.entries(sectionQuestions).map(([question, options]) => (
        <div key={question} className="question-item">
          <label>{question}</label>
          {options.map((option) => (
            <div key={option}>
              <label>
                <input
                  type="radio"
                  name={question}
                  value={option}
                  checked={answers[question] === option}
                  onChange={() => updateAnswer(question, option)}
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default ObjectBasedQuestion;
