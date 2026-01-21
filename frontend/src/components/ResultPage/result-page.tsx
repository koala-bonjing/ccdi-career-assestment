// src/pages/ResultsPage/index.tsx
import { useState } from "react";
import { useAuth, type User } from "../../context/AuthContext";
import NavigationBar from "../../components/NavigationBarComponents/NavigationBar";

// Views
import NoResultsView from "../ui/views/result-view";

// Sub-components
import ActionButtons from "../ui/buttons/action-buttons";
import StudentInfoCard from "./cards/student-info-card";
import SummaryCard from "./cards/summary-card";
import RecommendedProgramCard from "./cards/recommended-prog-card";
import DetailedExplanationToggle from "../ui/toggle/detail-explenation-toggle";
import DetailedExplanationSection from "./section/detail-explenation-section";
import CompatibilityChart from "./chart/compatibility-chart";
import CompatibilityLegend from "../ui/legend/compatibility-legend";

// Hooks & utils
import { useNormalizedPercentages } from "../../hooks/useNormalizePercentage";
import { saveResultsAsDocument } from "../../hooks/saveResultsAsDocument";
import { useAssessmentState } from "../../hooks/useAssessmentState"; // ✅ ADD THIS
import { useEvaluationStore } from "../../../store/useEvaluationStore"; // ✅ ADD THIS

import "./result-page.css";
import type { AssessmentResult } from "../../types";
import { useResultsHydration } from "../../hooks/useResultHydaration";
import RadarChart from "./chart/radar-chart";
import ProgramBreakdownChart from "./chart/program-breakdown-chart";
import FoundationalExamCard from "./cards/foundational-exam-card";

interface ResultsPageProps {
  result?: AssessmentResult; // Make it optional
}

const ResultsPage = ({ result: propResult }: ResultsPageProps) => {
  const { user: authUser } = useAuth();
  const [showDetailed, setShowDetailed] = useState(false);
  const [savingDocument, setSavingDocument] = useState<boolean>(false);

  // ✅ Get result from multiple sources
  const { assessmentResult } = useAssessmentState();
  const { result: storeResult } = useEvaluationStore();

  // Hydrate Data on Mount

  // ✅ Priority: prop > store > assessment state
  const result = propResult || storeResult || assessmentResult;

  console.log(
    "Answer received:",
    Object.keys(result?.answers.foundationalAssessment || {}),
  );

  // ✅ Call all hooks BEFORE any conditional returns
  const normalizedPercent = useNormalizedPercentages(result?.percent);
  useResultsHydration();

  // ✅ NOW check if result exists from ANY source
  if (!result) {
    console.log("❌ No result found from any source - showing NoResultsView");
    return <NoResultsView />;
  }

  // Handler for saving document
  const handleSaveAsDocument = async (): Promise<void> => {
    if (!result || !authUser) return;

    setSavingDocument(true);
    try {
      await saveResultsAsDocument(result, authUser as User);
    } catch (error) {
      console.error("Error saving document:", error);
    } finally {
      setSavingDocument(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <NavigationBar />

      {/* 👇 White Card Container — centered, max-width, responsive padding */}
      {/* 👇 White Card Container — centered, max-width, responsive padding */}
      <div className="container-fluid py-4 flex-grow-1 d-flex">
        <div className="row justify-content-center w-100">
          <div className="col-xxl-10 col-xl-12 col-lg-12">
            {/* 📄 Main Content Card */}
            <div
              className="card border-0 shadow-lg"
              style={{
                background: "white",
                borderRadius: "20px",
                overflow: "hidden",
                minHeight: "70vh",
              }}
            >
              <div className="card-body p-4 p-md-5">
                {/* Action Buttons — still outside main content flow */}
                <ActionButtons
                  onSave={handleSaveAsDocument}
                  saving={savingDocument}
                  onPrint={handlePrint}
                />

                {/* All content inside white card */}
                <StudentInfoCard
                  fullName={(authUser as User)?.fullName}
                  preferredCourse={(authUser as User)?.preferredCourse}
                />
                <SummaryCard summary={result.summary} />
                <RecommendedProgramCard program={result.recommendedProgram} />

                <DetailedExplanationToggle
                  isOpen={showDetailed}
                  onToggle={() => setShowDetailed(!showDetailed)}
                />
                {showDetailed && (
                  <DetailedExplanationSection
                    evaluation={result.detailedEvaluation}
                    recommendations={result.recommendations}
                  />
                )}

                <CompatibilityChart
                  percentages={normalizedPercent}
                  recommendedProgram={result.recommendedProgram}
                />

                <CompatibilityLegend />

                {/* Advanced Insights */}
                {result.categoryScores && (
                  <>
                    <ProgramBreakdownChart
                      programName={result.recommendedProgram}
                      academic={result.categoryScores.academic}
                      technical={result.categoryScores.technical}
                      career={result.categoryScores.career}
                      logistics={result.categoryScores.logistics}
                      categoryExplanations={result.categoryExplanations}
                    />
                    <h4
                      className="text-center mt-5 mb-3 fw-bold"
                      style={{ color: "#2B3176" }}
                    >
                      Your Full Profile Overview
                    </h4>
                    <RadarChart
                      academic={result.categoryScores.academic}
                      technical={result.categoryScores.technical}
                      career={result.categoryScores.career}
                      logistics={result.categoryScores.logistics}
                      recommendedProgram={result.recommendedProgram}
                    />
                  </>
                )}

                {result.answers?.foundationalAssessment && (
                  <FoundationalExamCard
                    userAnswers={result.answers.foundationalAssessment}
                    result={result}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
