import React from "react";
import { useEvaluationStore } from "../../store/useEvaluationStore";
import { ProgramLabels } from "../types";
import { getProgramTextColor } from "../utils/colorUtils";

const ResultsPage: React.FC = () => {
  const { result, name } = useEvaluationStore();

  console.log("DEBUG - Name in ResultsPage:", name);
  console.log("DEBUG - Result in ResultsPage:", result);

  if (!result) {
    return <p>No results yet. Please complete the assessment.</p>;
  }
  const nameColorClass = getProgramTextColor(result.recommendedProgram);

  // Create reverse mapping from label to program type
  const programTypeFromLabel = Object.entries(ProgramLabels).reduce(
    (acc, [key, value]) => {
      acc[value] = key as keyof typeof ProgramLabels;
      return acc;
    },
    {} as Record<string, keyof typeof ProgramLabels>
  );

  return (
    <div className="results-page max-w-4xl mx-auto p-6 font-poppins">
      {/* Heading */}
      <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">
        Results for <span className={nameColorClass}>{name}</span>
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
            {ProgramLabels[result.recommendedProgram]}
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
            {Object.entries(ProgramLabels).map(
              ([programType, programLabel]) => (
                <li key={programType}>
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>{programLabel}</span>
                    <span>
                      {result.percent?.[
                        programType as keyof typeof result.percent
                      ] || 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${getColorClass(
                        programType
                      )} h-3 rounded-full transition-all duration-500`}
                      style={{
                        width: `${
                          result.percent?.[
                            programType as keyof typeof result.percent
                          ] || 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// Helper function to get color classes
const getColorClass = (programType: string) => {
  const colorMap: Record<string, string> = {
    BSCS: "bg-blue-500",
    BSIT: "bg-orange-500",
    BSIS: "bg-purple-500",
    teElectrical: "bg-pink-500",
  };
  return colorMap[programType] || "bg-gray-500";
};

export default ResultsPage;
