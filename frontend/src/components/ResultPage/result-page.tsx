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
  useResultsHydration();

  // ✅ Priority: prop > store > assessment state
  const result = propResult || storeResult || assessmentResult;

  // ✅ Call all hooks BEFORE any conditional returns
  const normalizedPercent = useNormalizedPercentages(result?.percent);

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

  // Derive section scores (0–100)
  const computeSectionScores = () => {
    if (!result?.answers) return null;

    const {
      academicAptitude,
      technicalSkills,
      careerInterest,
      learningWorkStyle,
    } = result.answers;

    // Academic: average of 1–5 → scale to 0–100
    const academicValues = Object.values(academicAptitude).filter(
      (v) => typeof v === "number",
    ) as number[];
    const academic = academicValues.length
      ? Math.round(
          (academicValues.reduce((a, b) => a + b, 0) / academicValues.length) *
            20,
        )
      : 0;

    // Technical: % of "true" answers
    const techValues = Object.values(technicalSkills).filter(
      (v) => typeof v === "boolean",
    );
    const technical = techValues.length
      ? Math.round(
          (techValues.filter((v) => v).length / techValues.length) * 100,
        )
      : 0;

    // Career: average of 1–5 → 0–100
    const careerValues = Object.values(careerInterest).filter(
      (v) => typeof v === "number",
    ) as number[];
    const career = careerValues.length
      ? Math.round(
          (careerValues.reduce((a, b) => a + b, 0) / careerValues.length) * 20,
        )
      : 0;

    const logisticsValues = Object.values(learningWorkStyle).filter(
      (v) => typeof v === "boolean",
    );
    const logistics = logisticsValues.length
      ? Math.round(
          (logisticsValues.filter((v) => v).length / logisticsValues.length) *
            100,
        )
      : 0;

    return { academic, technical, career, logistics };
  };

  const sectionScores = computeSectionScores();

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
                minHeight: "70vh", // ensures space even on small screens
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
                    recommendations={result.evaluation}
                  />
                )}

                <CompatibilityChart
                  percentages={normalizedPercent}
                  recommendedProgram={result.recommendedProgram}
                />

                <CompatibilityLegend />
                {/* Advanced Insights */}
                {sectionScores && (
                  <>
                    <h4
                      className="text-center mt-5 mb-3 fw-bold"
                      style={{ color: "#2B3176" }}
                    >
                      Your Full Profile Overview
                    </h4>
                    <RadarChart
                      academic={sectionScores.academic}
                      technical={sectionScores.technical}
                      career={sectionScores.career}
                      logistics={sectionScores.logistics}
                    />

                    <ProgramBreakdownChart
                      programName={result.recommendedProgram}
                      academic={sectionScores.academic}
                      technical={sectionScores.technical}
                      career={sectionScores.career}
                      logistics={sectionScores.logistics}
                      categoryExplanations={result.categoryExplanations}
                    />
                  </>
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
