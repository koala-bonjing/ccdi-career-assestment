import { useState, useRef, useEffect } from "react";
import { useAuth, type User } from "../../context/AuthContext";
import { Modal, Button, Spinner } from "react-bootstrap";
import { Eye, Printer, Download } from "lucide-react";

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
import { saveResultsAsPDF, generateResultsDocument } from "../../hooks/saveResultsAsDocument"; 
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

  const [showPreview, setShowPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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
      setShowPreview(true);
    } catch (error) {
      console.error("Error generating document preview:", error);
    } finally {
      setSavingDocument(false);
    }
  };

  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.print();
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

      {/* Document Preview Modal */}
      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        size="lg"
        centered
        dialogClassName="modal-90w"
      >
        <Modal.Header
          closeButton
          style={{ background: "#f8f9ff", borderBottom: "2px solid #2B3176" }}
        >
          <Modal.Title style={{ color: "#2B3176", fontWeight: "bold" }}>
            <Eye size={24} className="me-2 mb-1" />
            Document Preview
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0" style={{ background: "#e9ecef" }}>
          {pdfUrl ? (
            <iframe
              ref={iframeRef}
              src={pdfUrl || undefined}
              style={{ width: "100%", height: "70vh", border: "none" }}
              title="PDF Preview"
            />
          ) : (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "70vh", color: "#6c757d" }}
            >
              <Spinner animation="border" className="me-2" />
              Loading Preview...
            </div>
          )}
        </Modal.Body>
        <Modal.Footer
          style={{ background: "#f8f9ff", borderTop: "1px solid #dee2e6" }}
        >
          <Button
            variant="outline-secondary"
            onClick={() => setShowPreview(false)}
          >
            Close
          </Button>
          <Button
            variant="outline-primary"
            onClick={handlePrint}
            className="d-flex align-items-center"
            style={{ borderColor: "#2B3176", color: "#2B3176" }}
          >
            <Printer size={18} className="me-2" />
            Print Form
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (result && activeUser) saveResultsAsPDF(result, activeUser);
            }}
            className="d-flex align-items-center"
            style={{
              background:
                "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
              border: "none",
            }}
          >
            <Download size={18} className="me-2" />
            Download PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ResultsPage;
