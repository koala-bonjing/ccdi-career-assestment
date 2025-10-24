import React, { useState } from "react";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { ProgramLabels } from "../../types";
import { getProgramTextColor } from "../../utils/colorUtils";
import NavigationBar from "../NavigationBarComponents/NavigationBar";
import { useAuth } from "../../context/AuthContext";

const ResultsPage: React.FC = () => {
  const { result, loading, error } = useEvaluationStore();
  const [currentSection, setCurrentSection] = useState(0);
  const [showDetailedExplanation, setShowDetailedExplanation] = useState(false);
  const { user: authUser } = useAuth();

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
      EE: "bg-pink-500",
    };
    return colorMap[programType] || "bg-gray-500";
  };

  return (
    <div className="results-page max-w-4xl mx-auto p-6 font-poppins">
      <NavigationBar />

      {/* Main Results Card */}
      <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-8 mb-6 border border-gray-200">
        {/* Student Information */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Assessment Results
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-lg text-gray-600">
            <p>
              <strong>Name:</strong>{" "}
              <span className={nameColorClass}>{authUser?.fullName}</span>
            </p>
            <p>
              <strong>Preferred Course:</strong>{" "}
              <span className="text-blue-600">
                {authUser?.preferredCourse || "Not specified"}
              </span>
            </p>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Summary
          </h3>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <p className="text-lg text-gray-700 leading-relaxed">
              {result.summary ||
                "Based on your assessment, here are your results..."}
            </p>
          </div>
        </div>

        {/* Recommended Program */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            Recommended Program
          </h3>
          <div className="inline-block bg-gradient-to-r from-green-400 to-green-600 text-white px-8 py-4 rounded-full shadow-lg">
            <span className="text-3xl font-bold">
              {ProgramLabels[result.recommendedProgram]}
            </span>
          </div>
          <p className="text-gray-500 mt-2">
            Best match based on your skills and interests
          </p>
        </div>

        {/* Toggle Detailed Explanation */}
        <div className="text-center mb-6">
          <button
            onClick={() => setShowDetailedExplanation(!showDetailedExplanation)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            {showDetailedExplanation
              ? "Hide Detailed Explanation"
              : "Show Detailed Explanation"}
          </button>
        </div>

        {/* Detailed Explanation (Collapsible) */}
        {showDetailedExplanation && (
          <div className="space-y-6 animate-fadeIn">
            {/* Evaluation */}
            <div>
              <h4 className="text-xl font-semibold text-blue-600 mb-3">
                📊 Detailed Evaluation
              </h4>
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  {result.evaluation}
                </p>
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="text-xl font-semibold text-purple-600 mb-3">
                💡 Personalized Recommendations
              </h4>
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  {result.recommendations}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Program Compatibility Chart */}
      {result.percent && (
        <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
            Program Compatibility
          </h3>
          <p className="text-gray-600 text-center mb-6">
            This chart shows how well your skills and interests align with each
            program. Higher percentages indicate better compatibility.
          </p>

          <div className="space-y-6">
            {Object.entries(ProgramLabels).map(
              ([programType, programLabel]) => {
                const percentage =
                  result.percent?.[
                    programType as keyof typeof result.percent
                  ] || 0;
                const isRecommended = programType === result.recommendedProgram;

                return (
                  <div key={programType} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-lg font-medium ${
                            isRecommended
                              ? "text-green-600 font-bold"
                              : "text-gray-700"
                          }`}
                        >
                          {programLabel}
                        </span>
                        {isRecommended && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-lg font-semibold ${
                          isRecommended ? "text-green-600" : "text-gray-700"
                        }`}
                      >
                        {percentage}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-4 relative">
                      <div
                        className={`${getColorClass(
                          programType
                        )} h-4 rounded-full transition-all duration-1000 ease-out ${
                          isRecommended
                            ? "ring-2 ring-green-400 ring-opacity-50"
                            : ""
                        }`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></div>
                    </div>

                    {/* Compatibility Description */}
                    <p className="text-sm text-gray-500 mt-1">
                      {percentage >= 80 && "Excellent match with your profile"}
                      {percentage >= 60 &&
                        percentage < 80 &&
                        "Strong compatibility with your skills"}
                      {percentage >= 40 &&
                        percentage < 60 &&
                        "Moderate alignment with your interests"}
                      {percentage >= 20 &&
                        percentage < 40 &&
                        "Some relevant aspects match"}
                      {percentage < 20 &&
                        "Limited compatibility based on current profile"}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
