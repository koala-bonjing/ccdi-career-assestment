import React from "react";

function ArrayBasedQuestion({ data, section, answers, setAnswers }: any) {
  const options = [1, 2, 3, 4, 5];

  return (
    <div>
      {data.map((question: any) => (
        <div key={question} className="question-item">
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
                    name={question}
                    value={value}
                    checked={answers[question] === value}
                    onChange={() =>
                      setAnswers((prev: any) => ({
                        ...prev,
                        [question]: value,
                      }))
                    }
                  />
                  {value}
                </label>
              ))}
            </div>
          ) : (
            <div>
              <input
                type="checkbox"
                checked={!!answers[question]}
                onChange={(e) =>
                  setAnswers((prev: any) => ({
                    ...prev,
                    [question]: e.target.checked,
                  }))
                }
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ArrayBasedQuestion;
