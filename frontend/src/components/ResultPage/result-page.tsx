import { useState } from "react";
import { useAuth, type User } from "../../context/AuthContext";

import NoResultsView from "../ui/views/result-view";

import ActionButtons from "../ui/buttons/action-buttons";
import StudentInfoCard from "./cards/student-info-card";
import SummaryCard from "./cards/summary-card";
import RecommendedProgramCard from "./cards/recommended-prog-card";
import DetailedExplanationToggle from "../ui/toggle/detail-explenation-toggle";
import DetailedExplanationSection from "./section/detail-explenation-section";
import CompatibilityChart from "./chart/compatibility-chart";
import CompatibilityLegend from "../ui/legend/compatibility-legend";

import { useNormalizedPercentages } from "../../hooks/useNormalizePercentage";
import { saveResultsAsPDF } from "../../hooks/saveResultsAsDocument"; 
import { useAssessmentState } from "../../hooks/useAssessmentState";
import { useEvaluationStore } from "../../../store/useEvaluationStore";

import "./result-page.css";
import type { AssessmentResult } from "../../types";
import { useResultsHydration } from "../../hooks/useResultHydaration";
import RadarChart from "./chart/radar-chart";
import ProgramBreakdownChart from "./chart/program-breakdown-chart";
import FoundationalExamCard from "./cards/foundational-exam-card";
import PreparationAndRoadmapCard from "./cards/preparation-needed-card";
import { useAssessmentQuestions } from "../../hooks/useAssessmentQuestions";

interface ResultsPageProps {
  result?: AssessmentResult;
}

const ResultsPage = ({ result: propResult }: ResultsPageProps) => {
  const { user: authUser } = useAuth();
  const [showDetailed, setShowDetailed] = useState(false);
  const [savingDocument, setSavingDocument] = useState<boolean>(false);

  const { assessmentResult } = useAssessmentState();
  const { result: storeResult } = useEvaluationStore();
  const { questions: dbQuestion } = useAssessmentQuestions();

  const result = propResult || storeResult || assessmentResult;

  const normalizedPercent = useNormalizedPercentages(result?.percent);
  useResultsHydration();

  if (!result) {
    console.log("❌ No result found from any source - showing NoResultsView");
    return <NoResultsView />;
  }

  const handleSaveAsDocument = async (): Promise<void> => {
    if (!result || !authUser) return;

    setSavingDocument(true);
    try {
      await saveResultsAsPDF(result, authUser as User);
    } catch (error) {
      console.error("Error saving document:", error);
    } finally {
      setSavingDocument(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
     
      <div className="container-fluid py-5 flex-grow-1 d-flex justify-content-center align-items-start">
        <div className="row w-100 justify-content-center mx-0">
          <div className="col-xxl-10 col-xl-11 col-lg-12 col-md-12 col-sm-12 px-3 px-md-4">
            {/* 📄 Main Content Card */}
            <div
              className="card border-0 shadow-lg mx-auto"
              style={{
                background: "white",
                borderRadius: "20px",
                overflow: "hidden",
                minHeight: "70vh",
                maxWidth: "100%",
              }}
            >
              <div className="card-body p-4 p-md-5">
                {/* Action Buttons — still outside main content flow */}
                <ActionButtons
                  onSave={handleSaveAsDocument}
                  saving={savingDocument}
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
                {result.preparationNeeded && (
                  <PreparationAndRoadmapCard
                    preparationNeeded={result.preparationNeeded}
                    successRoadmap={result.successRoadmap}
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
                    userAnswers={result?.answers.foundationalAssessment || {}}
                    result={result}
                    questions={dbQuestion?.foundationalAssessment}
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
