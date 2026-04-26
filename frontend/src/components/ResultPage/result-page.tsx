import { useState, useEffect } from "react";
import { useAuth, type User } from "../../context/AuthContext";
import {
  FileText,
  Target,
  BarChart3,
  Brain,
  Lightbulb,
  ChevronDown,
  Award,
  TrendingUp,
  User as UserIcon,
  ChartColumn,
} from "lucide-react";

import NoResultsView from "../ui/views/result-view";
import ActionButtons from "../ui/buttons/action-buttons";
import StudentInfoCard from "./cards/student-info-card";
import SummaryCard from "./cards/summary-card";
import RecommendedProgramCard from "./cards/recommended-prog-card";
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
import ProgramBreakdownChart from "./chart/program-breakdown-chart";
import FoundationalExamCard from "./cards/foundational-exam-card";
import PreparationAndRoadmapCard from "./cards/preparation-needed-card";
import { useAssessmentQuestions } from "../../hooks/useAssessmentQuestions";

// ── Accordion Section Component ──────────────────────────────────────
interface AccordionSectionProps {
  id: string;
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  onToggle: (id: string) => void;
  badge?: string;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  id,
  title,
  icon: Icon,
  isOpen,
  onToggle,
  badge,
  children,
}) => {
  return (
    <div
      className="mb-3 rounded-4 overflow-hidden"
      style={{
        border: "2px solid rgba(43, 49, 118, 0.1)",
      }}
    >
      <button
        onClick={() => onToggle(id)}
        className="w-100 d-flex align-items-center justify-content-between p-3 border-0"
        style={{
          background: isOpen ? "rgba(43, 49, 118, 0.03)" : "white",
          cursor: "pointer",
          transition: "background 0.2s ease",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "36px",
              height: "36px",
              background: isOpen
                ? "linear-gradient(135deg, #2B3176, #1C6CB3)"
                : "rgba(43, 49, 118, 0.08)",
              transition: "all 0.3s ease",
            }}
          >
            <Icon size={18} color={isOpen ? "white" : "#2B3176"} />
          </div>
          <h6
            className="mb-0 fw-bold"
            style={{
              color: isOpen ? "#2B3176" : "#6b7280",
              fontSize: "0.95rem",
            }}
          >
            {title}
          </h6>
          {badge && (
            <span
              className="badge rounded-pill px-2 py-1"
              style={{
                background: "rgba(236, 35, 38, 0.1)",
                color: "#EC2326",
                fontSize: "0.7rem",
                fontWeight: "600",
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          size={20}
          style={{
            color: isOpen ? "#2B3176" : "#9ca3af",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        />
      </button>

      {isOpen && <div className="px-3 pb-3 pt-2">{children}</div>}
    </div>
  );
};

// ── Quick Stats Card (Desktop Only) ──────────────────────────────────
const QuickStatsCard: React.FC<{ result: AssessmentResult }> = ({ result }) => {
  const stats = [
    {
      label: "Foundational Score",
      value: `${result.foundationalScore || 0}%`,
      icon: Target,
      color: "#EC2326",
    },
    {
      label: "Program Match",
      value: result.recommendedProgram ? result.recommendedProgram : "—",
      icon: Award,
      color: "#1C6CB3",
    },
    {
      label: "Readiness Breakdown Score",
      value: `${result.prereqAnalysis?.overallScore} / 5`,
      icon: ChartColumn,
      color: "#1C6CB3",
    },
  ];

  if (!result.foundationalScore && !result.recommendedProgram) return null;

  return (
    <div
      className="rounded-4 p-4 d-none d-lg-block"
      style={{
        background: "linear-gradient(135deg, #f8f9ff 0%, #e8f0fe 100%)",
        border: "1px solid rgba(43, 49, 118, 0.1)",
      }}
    >
      <h6 className="fw-bold mb-3" style={{ color: "#2B3176" }}>
        Quick Stats
      </h6>
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="d-flex align-items-center gap-3 mb-3">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: 36,
                height: 36,
                background: `${stat.color}15`,
              }}
            >
              <Icon size={18} style={{ color: stat.color }} />
            </div>
            <div>
              <div className="small text-muted">{stat.label}</div>
              <div className="fw-bold" style={{ color: "#2B3176" }}>
                {stat.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Survey Card ──────────────────────────────────────────────────────
const SurveyCard: React.FC = () => {
  return (
    <div
      className="text-center mt-4 pt-4"
      style={{ borderTop: "1px solid rgba(43, 49, 118, 0.1)" }}
    >
      <h6 className="fw-bold mb-2" style={{ color: "#2B3176" }}>
        📋 Research Survey
      </h6>
      <p className="small text-muted mb-3">
        Help improve career guidance for future students
      </p>
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSdAHz1wrTS3XI88OqVTgbS7nVBicm2w0oUl0PDYJyw9GmCXMg/viewform?usp=publish-editor"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm rounded-pill px-4 fw-bold text-white"
        style={{
          background: "linear-gradient(135deg, #2B3176, #1C6CB3)",
          fontSize: "0.85rem",
        }}
      >
        Participate
      </a>
    </div>
  );
};

// ─── Main ResultsPage Component ──────────────────────────────────────
interface ResultsPageProps {
  result?: AssessmentResult;
}

const ResultsPage = ({ result: propResult }: ResultsPageProps) => {
  const { user: authUser } = useAuth();
  const [savingDocument, setSavingDocument] = useState<boolean>(false);

  const { assessmentResult } = useAssessmentState();
  const { result: storeResult } = useEvaluationStore();
  const { questions: dbQuestion } = useAssessmentQuestions();

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const result = propResult || storeResult || assessmentResult;
  const activeUser = (authUser as User) || result?.user;
  const normalizedPercent = useNormalizedPercentages(result?.percent);

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    studentInfo: true,
    summary: true,
    recommended: false,
    nextSteps: true,
    evaluation: false,
    compatibility: false,
    breakdown: false,
    foundational: false,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  if (!result) {
    return <NoResultsView />;
  }

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
                {/* Action Buttons */}
                <ActionButtons
                  onSave={handlePreviewDocument}
                  saving={savingDocument}
                  pdfUrl={pdfUrl}
                  onDownload={() => {
                    if (result && activeUser)
                      saveResultsAsPDF(result, activeUser);
                  }}
                />

                {/* Main Layout */}
                <div className="row g-4">
                  {/* LEFT COLUMN */}
                  <div className="col-lg-8">
                    <AccordionSection
                      id="studentInfo"
                      title="Student Information"
                      icon={UserIcon}
                      isOpen={expandedSections.studentInfo}
                      onToggle={toggleSection}
                    >
                      <StudentInfoCard
                        fullName={activeUser?.fullName || activeUser?.name}
                        preferredCourse={activeUser?.preferredCourse}
                        address={activeUser?.address}
                        school={activeUser?.school}
                      />
                    </AccordionSection>

                    <AccordionSection
                      id="summary"
                      title="Assessment Summary"
                      icon={FileText}
                      isOpen={expandedSections.summary}
                      onToggle={toggleSection}
                    >
                      <SummaryCard summary={result.summary} />
                    </AccordionSection>

                    <AccordionSection
                      id="recommended"
                      title="Recommended Program"
                      icon={Award}
                      isOpen={expandedSections.recommended}
                      onToggle={toggleSection}
                      badge={result.recommendedProgram?.split(" ")[0]}
                    >
                      <RecommendedProgramCard
                        program={result.recommendedProgram}
                      />
                    </AccordionSection>

                    <AccordionSection
                      id="evaluation"
                      title="Detailed Evaluation & Recommendations"
                      icon={Brain}
                      isOpen={expandedSections.evaluation}
                      onToggle={toggleSection}
                    >
                      <DetailedExplanationSection
                        evaluation={result.detailedEvaluation}
                        recommendations={result.evaluation}
                      />
                    </AccordionSection>

                    <AccordionSection
                      id="compatibility"
                      title="Program Compatibility"
                      icon={Target}
                      isOpen={expandedSections.compatibility}
                      onToggle={toggleSection}
                    >
                      <CompatibilityChart
                        percentages={normalizedPercent}
                        recommendedProgram={result.recommendedProgram}
                      />
                      <CompatibilityLegend />
                    </AccordionSection>

                    {result.categoryScores && (
                      <AccordionSection
                        id="breakdown"
                        title="Why This Program Fits You"
                        icon={TrendingUp}
                        isOpen={expandedSections.breakdown}
                        onToggle={toggleSection}
                      >
                        <ProgramBreakdownChart
                          programName={result.recommendedProgram}
                          academic={result.categoryScores.academic}
                          technical={result.categoryScores.technical}
                          career={result.categoryScores.career}
                          logistics={result.categoryScores.logistics}
                          categoryExplanations={result.categoryExplanations}
                        />
                      </AccordionSection>
                    )}

                    {(result.answers?.foundationalAssessment ||
                      result.foundationalScore !== undefined) && (
                      <AccordionSection
                        id="foundational"
                        title="Foundational Readiness"
                        icon={BarChart3}
                        isOpen={expandedSections.foundational}
                        onToggle={toggleSection}
                      >
                        <FoundationalExamCard
                          userAnswers={
                            result?.answers?.foundationalAssessment || {}
                          }
                          result={result}
                          questions={dbQuestion?.foundationalAssessment}
                        />
                      </AccordionSection>
                    )}
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="col-lg-4">
                    <AccordionSection
                      id="nextSteps"
                      title="Next Steps & Preparation"
                      icon={Lightbulb}
                      isOpen={expandedSections.nextSteps}
                      onToggle={toggleSection}
                    >
                      {/* Quick Stats - Desktop Only */}
                      <QuickStatsCard result={result} />
                      {result.preparationNeeded && (
                        <PreparationAndRoadmapCard
                          preparationNeeded={result.preparationNeeded}
                          successRoadmap={result.successRoadmap}
                        />
                      )}
                    </AccordionSection>
                  </div>
                </div>

                {/* Survey - Always at bottom */}
                <SurveyCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
