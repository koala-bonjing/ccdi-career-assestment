import { useState, useEffect } from "react";
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
import {
  saveResultsAsPDF,
  generateResultsDocument,
} from "../../hooks/saveResultsAsDocument";
import { useAssessmentState } from "../../hooks/useAssessmentState";
import { useEvaluationStore } from "../../../store/useEvaluationStore";

import "./result-page.css";
import type { AssessmentResult } from "../../types";
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

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const result = propResult || storeResult || assessmentResult;
  const activeUser = (authUser as User) || result?.user;
  const normalizedPercent = useNormalizedPercentages(result?.percent);

  const handlePreviewDocument = async (): Promise<void> => {
    if (!result || !activeUser) return;

    setSavingDocument(true);
    try {
      const blob = await generateResultsDocument(result, activeUser);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error generating document preview:", error);
    } finally {
      setSavingDocument(false);
    }
  };

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  if (!result) {
    return <NoResultsView />;
  }

  return (
    <>
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
                  <ActionButtons
                    onSave={handlePreviewDocument}
                    saving={savingDocument}
                    pdfUrl={pdfUrl}
                    onDownload={() => {
                      if (result && activeUser)
                        saveResultsAsPDF(result, activeUser);
                    }}
                  />
                  <StudentInfoCard
                    fullName={activeUser?.fullName || activeUser?.name}
                    preferredCourse={activeUser?.preferredCourse}
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
                  {(result.answers?.foundationalAssessment ||
                    result.foundationalScore !== undefined) && (
                    <FoundationalExamCard
                      userAnswers={
                        result?.answers?.foundationalAssessment || {}
                      }
                      result={result}
                      questions={dbQuestion?.foundationalAssessment}
                    />
                  )}

                  {/* Thesis Research Survey Section */}
                  <div className="mt-5 pt-4 border-top">
                    <div
                      className="text-center p-4"
                      style={{
                        background:
                          "linear-gradient(135deg, #f8f9ff 0%, #e8f0fe 100%)",
                        borderRadius: "16px",
                        border: "2px solid #2B3176",
                      }}
                    >
                      <h4 className="mb-3 fw-bold" style={{ color: "#2B3176" }}>
                        📋 Thesis Research Survey
                      </h4>
                      <p
                        className="mb-4"
                        style={{
                          color: "#4a5568",
                          fontSize: "1.1rem",
                          maxWidth: "600px",
                          margin: "0 auto",
                        }}
                      >
                        This assessment is part of an undergraduate thesis
                        project. Your feedback is essential to our research and
                        would greatly contribute to the study's success.
                      </p>
                      <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSdAHz1wrTS3XI88OqVTgbS7nVBicm2w0oUl0PDYJyw9GmCXMg/viewform?usp=publish-editor"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-lg"
                        style={{
                          background:
                            "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "12px",
                          padding: "12px 32px",
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          transition: "all 0.3s ease",
                          boxShadow: "0 4px 15px rgba(43, 49, 118, 0.3)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 20px rgba(43, 49, 118, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 15px rgba(43, 49, 118, 0.3)";
                        }}
                      >
                        📝 Participate in Research Survey
                      </a>
                      <p
                        className="mt-3 mb-0"
                        style={{
                          color: "#718096",
                          fontSize: "0.9rem",
                        }}
                      >
                        Your response will help improve career guidance tools
                        for future students
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsPage;
