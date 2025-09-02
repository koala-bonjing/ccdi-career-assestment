import React from "react";
import { useEvaluationStore } from "../../store/useEvaluationStore";

const ResultsPage: React.FC = () => {
  const { result, name } = useEvaluationStore();

  if (!result) {
    return <p>No results yet. Please complete the assessment.</p>;
  }

  return (
    <div className="results-page max-w-4xl mx-auto p-6 font-poppins">
      {/* Heading */}
      <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">
        Results for <span className="text-blue-600">{name}</span>
      </h2>

      {/* Evaluation + Recommendations */}
      <div className="bg-white/10 backdrop-blur-md shadow-md rounded-2xl p-6 mb-6 border border-gray-200">
        <p className="text-lg mb-4">
          <strong className="text-blue-500">Evaluation:</strong>{" "}
          <span className="text-gray-700">{result.evaluation}</span>
        </p>
        <p className="text-lg mb-4">
          <strong className="text-purple-500">Recommendations:</strong>{" "}
          <span className="text-gray-700">{result.recommendations}</span>
        </p>
        <p className="text-lg">
          <strong className="text-green-500">Recommended Program:</strong>{" "}
          <span className="text-gray-800 font-semibold">
            {result.recommendedProgram}
          </span>
        </p>
      </div>

      {/* Percent Match Section */}
      {result.percent && (
        <div className="bg-white/10 backdrop-blur-md shadow-md rounded-2xl p-6 border border-gray-200">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Percent Match
          </h3>
          <ul className="space-y-4">
            {[
              { label: "BSCS", color: "bg-blue-500" },
              { label: "BSIT", color: "bg-orange-500" },
              { label: "BSIS", color: "bg-purple-500" },
              {
                label: "Technology Engineering (Electrical)",
                color: "bg-pink-500",
              },
            ].map((prog) => (
              <li key={prog.label}>
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>{prog.label}</span>
                  <span>
                    {result.percent[prog.label.replace(/\s*\(.*\)/, "")] || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${prog.color} h-3 rounded-full transition-all duration-500`}
                    style={{
                      width: `${
                        result.percent[prog.label.replace(/\s*\(.*\)/, "")] || 0
                      }%`,
                    }}
                  ></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
