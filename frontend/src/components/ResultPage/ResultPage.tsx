import React, { useState } from "react";
import { useEvaluationStore } from "../../../store/useEvaluationStore";
import { ProgramLabels } from "../../types";
import NavigationBar from "../NavigationBarComponents/NavigationBar";
import { useAuth } from "../../context/AuthContext";
import {
  Award,
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Target,
  Users,
  Cpu,
  Zap,
  Download,
  FileText,
} from "lucide-react";
import { saveResultsAsDocument } from "../../hooks/saveResultsAsDocument";
import "./ResultPage.css";

// Define proper interfaces for the result data
interface ProgramPercentages {
  BSCS: number;
  BSIT: number;
  BSIS: number;
  EE: number;
}

interface EvaluationResult {
  recommendedProgram: string;
  evaluation: string;
  recommendations: string;
  summary?: string;
  percent?: ProgramPercentages;
}

interface AuthUser {
  _id: string,
  name: string,
  fullName?: string;
  preferredCourse?: string;
  email?: string;
  // Add other user properties as needed
}

const ResultsPage: React.FC = () => {
  const { result, loading, error } = useEvaluationStore();
  const [showDetailedExplanation, setShowDetailedExplanation] = useState<boolean>(false);
  const [savingDocument, setSavingDocument] = useState<boolean>(false);
  const { user: authUser } = useAuth();

  const handleSaveAsDocument = async (): Promise<void> => {
    if (!result || !authUser) return;

    setSavingDocument(true);
    try {
      await saveResultsAsDocument(result, authUser as AuthUser);
      // Optional: Show success toast
    } catch (error) {
      console.error("Error saving document:", error);
      // Optional: Show error toast
    } finally {
      setSavingDocument(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-vh-100"
        style={{
          background: "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)",
          minHeight: "100vh",
        }}
      >
        <NavigationBar />
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center text-white">
            <div className="spinner-border mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h3>Loading your results...</h3>
            <p className="text-white-50">
              Please wait while we analyze your assessment
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-vh-100"
        style={{
          background: "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)",
          minHeight: "100vh",
        }}
      >
        <NavigationBar />
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center text-white">
            <div className="alert alert-danger">
              <h4>Error Loading Results</h4>
              <p>{error}</p>
              <button
                className="btn btn-outline-light"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Type guard to check if result is valid
  const isValidResult = (result: unknown): result is EvaluationResult => {
    return (
      !!result &&
      typeof result === 'object' &&
      'recommendedProgram' in result &&
      'evaluation' in result &&
      'recommendations' in result &&
      typeof (result as EvaluationResult).recommendedProgram === 'string' &&
      typeof (result as EvaluationResult).evaluation === 'string' &&
      typeof (result as EvaluationResult).recommendations === 'string'
    );
  };

  if (!result || !isValidResult(result)) {
    return (
      <div
        className="min-vh-100"
        style={{
          background: "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)",
          minHeight: "100vh",
        }}
      >
        <NavigationBar />
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center text-white">
            <div className="card bg-white bg-opacity-10 border-0 p-5">
              <div className="card-body">
                <h3 className="text-white mb-3">No Results Available</h3>
                <p className="text-white-50 mb-4">
                  {!result 
                    ? "Please complete the assessment to see your personalized results."
                    : "The assessment results are incomplete or invalid. Please try the assessment again."
                  }
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => window.history.back()}
                >
                  Go Back to Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to get color classes for progress bars
  const getColorClass = (programType: string): string => {
    const colorMap: Record<string, string> = {
      BSCS: "bg-primary",
      BSIT: "bg-warning",
      BSIS: "bg-info",
      EE: "bg-success",
    };
    return colorMap[programType] || "bg-secondary";
  };

  // Helper function to get program icons
  const getProgramIcon = (programType: string): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
      BSCS: <Cpu size={20} />,
      BSIT: <Zap size={20} />,
      BSIS: <Users size={20} />,
      EE: <Target size={20} />,
    };
    return iconMap[programType] || <BookOpen size={20} />;
  };

  // Safe percentage calculation with proper typing
  const getPercentage = (programType: string): number => {
    if (!result.percent) return 0;
    
    // Use type assertion to safely access the percentage
    const programKey = programType as keyof ProgramPercentages;
    const percentage = result.percent[programKey];
    
    return typeof percentage === 'number' ? Math.max(0, Math.min(100, percentage)) : 0;
  };

  // Get compatibility description
  const getCompatibilityDescription = (percentage: number): string => {
    if (percentage >= 80) return "🎯 Excellent match with your profile and career goals";
    if (percentage >= 60) return "✅ Strong compatibility with your skills and interests";
    if (percentage >= 40) return "📊 Moderate alignment with your assessment results";
    if (percentage >= 20) return "ℹ️ Some relevant aspects match your profile";
    return "💡 Limited compatibility based on current assessment";
  };

  // Type-safe program type checker
  const isValidProgramType = (programType: string): programType is keyof typeof ProgramLabels => {
    return programType in ProgramLabels;
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <NavigationBar />

      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-xxl-10 col-xl-12 col-lg-12">
            {/* Action Buttons */}
            <div className="text-center mb-4">
              <button
                onClick={handleSaveAsDocument}
                disabled={savingDocument}
                className="btn btn-lg px-5 py-3 fw-bold me-3"
                style={{
                  background:
                    "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(164, 29, 49, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {savingDocument ? (
                  <>
                    <div
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    >
                      <span className="visually-hidden">Saving...</span>
                    </div>
                    Saving Document...
                  </>
                ) : (
                  <>
                    <Download size={20} className="me-2" />
                    Save as Document
                  </>
                )}
              </button>

              <button
                onClick={() => window.print()}
                className="btn btn-lg px-5 py-3 fw-bold"
                style={{
                  background:
                    "linear-gradient(135deg, #1C6CB3 0%, #2B3176 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(28, 108, 179, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <FileText size={20} className="me-2" />
                Print Results
              </button>
            </div>

            {/* Main Results Card */}
            <div
              className="card border-0 shadow-lg mb-4"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
              }}
            >
              <div className="card-body p-4 p-lg-5">
                {/* Student Information */}
                <div className="text-center mb-5">
                  <div className="d-flex align-items-center justify-content-center mb-3">
                    <Award size={40} className="text-primary me-3" />
                    <h2
                      className="card-title mb-0 fw-bold"
                      style={{ color: "#2B3176", fontSize: "2.5rem" }}
                    >
                      Assessment Results
                    </h2>
                  </div>
                  <div className="row justify-content-center g-3">
                    <div className="col-md-6">
                      <div className="bg-light rounded p-3">
                        <strong style={{ color: "#2B3176" }}>
                          Student Name:
                        </strong>
                        <br />
                        <span className="fs-5" style={{ color: "#A41D31" }}>
                          {(authUser as AuthUser)?.fullName || "Not specified"}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="bg-light rounded p-3">
                        <strong style={{ color: "#2B3176" }}>
                          Preferred Course:
                        </strong>
                        <br />
                        <span className="fs-5" style={{ color: "#1C6CB3" }}>
                          {(authUser as AuthUser)?.preferredCourse || "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="mb-5">
                  <h3
                    className="text-center mb-4 fw-bold"
                    style={{ color: "#2B3176" }}
                  >
                    <BookOpen size={28} className="me-2" />
                    Assessment Summary
                  </h3>
                  <div
                    className="p-4 rounded"
                    style={{
                      background:
                        "linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)",
                      border: "2px solid #2B3176",
                    }}
                  >
                    <p className="fs-5 mb-0 text-dark text-center">
                      {result.summary ||
                        "Based on your comprehensive assessment, here are your personalized results and program recommendations..."}
                    </p>
                  </div>
                </div>

                {/* Recommended Program */}
                <div className="text-center mb-5">
                  <h3 className="mb-3" style={{ color: "#2B3176" }}>
                    <Target size={24} className="me-2" />
                    Recommended Program
                  </h3>
                  <div
                    className="d-inline-block text-white px-5 py-3 rounded-pill shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)",
                      border: "3px solid #2B3176",
                    }}
                  >
                    <span className="fw-bold fs-2">
                      {isValidProgramType(result.recommendedProgram) 
                        ? ProgramLabels[result.recommendedProgram] 
                        : result.recommendedProgram
                      }
                    </span>
                  </div>
                  <p className="text-muted mt-3 fs-5">
                    Best match based on your skills, interests, and learning style
                  </p>
                </div>

                {/* Toggle Detailed Explanation */}
                <div className="text-center mb-4">
                  <button
                    onClick={() =>
                      setShowDetailedExplanation(!showDetailedExplanation)
                    }
                    className="btn btn-lg px-5 py-3 fw-bold"
                    style={{
                      background:
                        "linear-gradient(135deg, #1C6CB3 0%, #2B3176 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 25px rgba(28, 108, 179, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {showDetailedExplanation ? (
                      <>
                        <ChevronUp size={20} className="me-2" />
                        Hide Detailed Analysis
                      </>
                    ) : (
                      <>
                        <ChevronDown size={20} className="me-2" />
                        Show Detailed Analysis
                      </>
                    )}
                  </button>
                </div>

                {/* Detailed Explanation (Collapsible) */}
                {showDetailedExplanation && (
                  <div className="row g-4 animate-fadeIn">
                    {/* Evaluation */}
                    <div className="col-lg-6">
                      <div className="card border-0 h-100 shadow-sm">
                        <div
                          className="card-header py-3 text-white fw-bold"
                          style={{
                            background:
                              "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)",
                            borderBottom: "3px solid #A41D31",
                          }}
                        >
                          <BarChart3 size={20} className="me-2" />
                          Detailed Evaluation
                        </div>
                        <div className="card-body p-4">
                          <p
                            className="text-dark mb-0"
                            style={{ lineHeight: "1.6" }}
                          >
                            {result.evaluation}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="col-lg-6">
                      <div className="card border-0 h-100 shadow-sm">
                        <div
                          className="card-header py-3 text-white fw-bold"
                          style={{
                            background:
                              "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)",
                            borderBottom: "3px solid #2B3176",
                          }}
                        >
                          <Target size={20} className="me-2" />
                          Personalized Recommendations
                        </div>
                        <div className="card-body p-4">
                          <p
                            className="text-dark mb-0"
                            style={{ lineHeight: "1.6" }}
                          >
                            {result.recommendations}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Program Compatibility Chart */}
            {result.percent && (
              <div
                className="card border-0 shadow-lg"
                style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                }}
              >
                <div className="card-body p-4 p-lg-5">
                  <h3
                    className="text-center mb-1 fw-bold"
                    style={{ color: "#2B3176", fontSize: "2rem" }}
                  >
                    <BarChart3 size={32} className="me-3" />
                    Program Compatibility
                  </h3>
                  <p className="text-center text-muted mb-4 fs-5">
                    This chart shows how well your skills and interests align
                    with each CCDI program
                  </p>

                  <div className="row g-4">
                    {Object.entries(ProgramLabels).map(
                      ([programType, programLabel]) => {
                        const percentage = getPercentage(programType);
                        const isRecommended =
                          programType === result.recommendedProgram;

                        return (
                          <div key={programType} className="col-lg-6">
                            <div
                              className="card border-0 h-100 shadow-sm"
                              style={{
                                borderLeft: `4px solid ${
                                  programType === "BSCS"
                                    ? "#2B3176"
                                    : programType === "BSIT"
                                    ? "#EC2326"
                                    : programType === "BSIS"
                                    ? "#1C6CB3"
                                    : "#A41D31"
                                }`,
                              }}
                            >
                              <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <div className="d-flex align-items-center">
                                    <span
                                      className="me-2"
                                      style={{
                                        color:
                                          programType === "BSCS"
                                            ? "#2B3176"
                                            : programType === "BSIT"
                                            ? "#EC2326"
                                            : programType === "BSIS"
                                            ? "#1C6CB3"
                                            : "#A41D31",
                                      }}
                                    >
                                      {getProgramIcon(programType)}
                                    </span>
                                    <h5
                                      className={`mb-0 fw-bold ${
                                        isRecommended
                                          ? "text-success"
                                          : "text-dark"
                                      }`}
                                    >
                                      {programLabel}
                                    </h5>
                                  </div>
                                  <div className="text-end">
                                    <span
                                      className={`fw-bold fs-4 ${
                                        isRecommended
                                          ? "text-success"
                                          : "text-dark"
                                      }`}
                                    >
                                      {percentage}%
                                    </span>
                                    {isRecommended && (
                                      <div
                                        className="badge mt-1"
                                        style={{
                                          background:
                                            "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)",
                                          color: "white",
                                        }}
                                      >
                                        RECOMMENDED
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                <div
                                  className="progress mb-3"
                                  style={{
                                    height: "12px",
                                    borderRadius: "10px",
                                  }}
                                >
                                  <div
                                    className={`progress-bar ${getColorClass(
                                      programType
                                    )}`}
                                    style={{
                                      width: `${percentage}%`,
                                      borderRadius: "10px",
                                      transition: "width 1s ease-in-out",
                                    }}
                                  ></div>
                                </div>

                                {/* Compatibility Description */}
                                <p className="text-muted mb-0 small">
                                  {getCompatibilityDescription(percentage)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>

                  {/* Legend */}
                  <div
                    className="mt-5 p-4 rounded"
                    style={{
                      background:
                        "linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)",
                      border: "2px solid #2B3176",
                    }}
                  >
                    <h5
                      className="text-center mb-3 fw-bold"
                      style={{ color: "#2B3176" }}
                    >
                      Compatibility Guide
                    </h5>
                    <div className="row text-center g-3">
                      <div className="col-md-3">
                        <div className="fw-bold text-success">80-100%</div>
                        <small className="text-muted">Excellent Match</small>
                      </div>
                      <div className="col-md-3">
                        <div className="fw-bold text-primary">60-79%</div>
                        <small className="text-muted">Strong Fit</small>
                      </div>
                      <div className="col-md-3">
                        <div className="fw-bold text-warning">40-59%</div>
                        <small className="text-muted">Moderate Fit</small>
                      </div>
                      <div className="col-md-3">
                        <div className="fw-bold text-secondary">0-39%</div>
                        <small className="text-muted">Limited Fit</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;