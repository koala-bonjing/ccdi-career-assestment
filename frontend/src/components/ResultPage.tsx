import React from "react";
import { useEvaluationStore } from "../../store/useEvaluationStore";
import { ProgramLabels } from "../types";
import { getProgramTextColor } from "../utils/colorUtils";
import type { AssessmentResult } from "../types";
import ProgressSideBar from "./ProgressSideBar/ProgressSideBar";

const ResultsPage: React.FC = () => {
  const { result, name, loading, error } = useEvaluationStore();

  console.log("🔍 RESULTS PAGE DEBUG:");
  console.log("🔍 Name:", name);
  console.log("🔍 Result:", result);
  console.log("🔍 Loading:", loading);
  console.log("🔍 Error:", error);
  console.log("🔍 Result type:", typeof result);
  console.log("🔍 Result keys:", result ? Object.keys(result) : "No result");

  if (result) {
    console.log("🔍 Result properties:");
    console.log("  - evaluation:", result.evaluation);
    console.log("  - recommendations:", result.recommendations);
    console.log("  - recommendedProgram:", result.recommendedProgram);
    console.log("  - percent:", result.percent);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">No results yet.</p>
          <p className="text-gray-500">
            Please complete the assessment to see your results.
          </p>
        </div>
      </div>
    );
  }

  // Additional safety checks
  if (
    !result.recommendedProgram ||
    !result.evaluation ||
    !result.recommendations
  ) {
    console.error("❌ Invalid result data:", result);
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Invalid result data</p>
          <p className="text-gray-500">Please try the assessment again.</p>
        </div>
      </div>
    );
  }

  const nameColorClass = getProgramTextColor(result.recommendedProgram);

  // Helper function to get color classes for progress bars
  const getColorClass = (programType: string) => {
    const colorMap: Record<string, string> = {
      BSCS: "bg-blue-500",
      BSIT: "bg-orange-500",
      BSIS: "bg-purple-500",
      teElectrical: "bg-pink-500",
    };
    return colorMap[programType] || "bg-gray-500";
  };

  return (
    <div className="results-page max-w-4xl mx-auto p-6 font-poppins">
      <ProgressSideBar recommendedProgram={result.recommendedProgram} />
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

export default ResultsPage;
