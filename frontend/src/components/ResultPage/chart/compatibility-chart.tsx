// src/pages/ResultsPage/components/CompatibilityChart.tsx
import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Cpu,
  Zap,
  Users,
  Wifi,
  Battery,
  Star,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import {
  ProgramLabels,
  type ProgramType,
  type ProgramPercentages,
} from "../types";

const RECOMMENDED_GREEN = "#08CB00";

const getStatusDetails = (percentage: number) => {
  if (percentage >= 80)
    return {
      label: "Excellent Match",
      color: "#08CB00",
      icon: <CheckCircle2 size={18} />,
      desc: "Excellent match with your profile and career goals.",
    };
  if (percentage >= 60)
    return {
      label: "Strong Fit",
      color: "#1E90FF",
      icon: <ShieldCheck size={18} />,
      desc: "Strong fit for your skills and interests.",
    };
  if (percentage >= 40)
    return {
      label: "Moderate Fit",
      color: "#FFB100",
      icon: <AlertCircle size={18} />,
      desc: "Moderate alignment with your current assessment.",
    };
  return {
    label: "Limited Fit",
    color: "#dc3545",
    icon: <XCircle size={18} />,
    desc: "Limited compatibility based on current results.",
  };
};

const getProgramIcon = (programType: string, color: string): React.ReactNode => {
  const iconProps = { size: 20, color: color, strokeWidth: 2 };
  switch (programType) {
    case "BSCS":
      return <Cpu {...iconProps} />;
    case "BSIT":
      return <Zap {...iconProps} />;
    case "BSIS":
      return <Users {...iconProps} />;
    case "BSET Electronics Technology":
      return <Wifi {...iconProps} />;
    case "BSET Electrical Technology":
      return <Battery {...iconProps} />;
    default:
      return <BarChart3 {...iconProps} />;
  }
};

interface CompatibilityChartProps {
  percentages: ProgramPercentages;
  recommendedProgram: ProgramType;
}

const CompatibilityChart: React.FC<CompatibilityChartProps> = ({
  percentages,
  recommendedProgram,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => window.innerWidth < 992;
    const handleResize = () => setIsMobile(checkMobile());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate rankings
  const rankedPrograms = Object.entries(ProgramLabels)
    .map(([programType, programLabel]) => ({
      programType,
      programLabel,
      percentage: percentages[programType as keyof ProgramPercentages] || 0,
      isRecommended: programType === recommendedProgram,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const topThree = rankedPrograms.slice(0, 3);

  // Rank styling configuration
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          badgeBg: "#FFD700",
          badgeText: "#000",
          borderColor: "#FFD700",
          label: "1st",
        };
      case 2:
        return {
          badgeBg: "#C0C0C0",
          badgeText: "#000",
          borderColor: "#C0C0C0",
          label: "2nd",
        };
      case 3:
        return {
          badgeBg: "#CD7F32",
          badgeText: "#fff",
          borderColor: "#CD7F32",
          label: "3rd",
        };
      default:
        return {
          badgeBg: "#6c757d",
          badgeText: "#fff",
          borderColor: "#e9ecef",
          label: `${rank}th`,
        };
    }
  };

  return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
      <div className={`card-body ${isMobile ? "p-3" : "p-4"}`}>
        {/* Header */}
        <div className="text-center mb-4">
          <h3
            className="fw-bold"
            style={{ color: "#2B3176", fontSize: isMobile ? "1.25rem" : "1.5rem" }}
          >
            <BarChart3 size={24} className="me-2 mb-1" />
            Program Compatibility
          </h3>
          <p className="text-muted small mb-0">
            Based on your assessment results
          </p>
        </div>

        {/* 🏆 TOP 3 SECTION WITH BORDER */}
        <div
          className="mb-5 p-3 p-md-4 rounded-4"
          style={{
            background: "#fff",
            border: "2px solid #2B3176",
            boxShadow: "0 4px 12px rgba(43, 49, 118, 0.1)",
          }}
        >
          <div className="d-flex align-items-center mb-4">
            <div
              className="d-flex align-items-center justify-content-center me-2"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
              }}
            >
              <Trophy size={20} color="#fff" fill="#fff" />
            </div>
            <div>
              <h5
                className="fw-bold mb-0"
                style={{ color: "#2B3176", fontSize: "1.1rem" }}
              >
                Top 3 Recommendations
              </h5>
              <p className="text-muted small mb-0">
                Ranked by compatibility score
              </p>
            </div>
          </div>

          <div className="row g-3">
            {topThree.map((program, index) => {
              const rank = index + 1;
              const rankStyle = getRankStyle(rank);
              const status = getStatusDetails(program.percentage);

              return (
                <div key={program.programType} className="col-12 col-md-4">
                  <div
                    className="card h-100 border-0"
                    style={{
                      background: "#f8f9fa",
                      borderRadius: "12px",
                      border: `2px solid ${rankStyle.borderColor}`,
                      position: "relative",
                    }}
                  >
                    <div className="card-body p-3 text-center">
                      {/* Rank Badge */}
                      <div
                        className="position-absolute"
                        style={{ top: "10px", left: "10px" }}
                      >
                        <span
                          className="badge fw-bold"
                          style={{
                            backgroundColor: rankStyle.badgeBg,
                            color: rankStyle.badgeText,
                            fontSize: "0.7rem",
                            padding: "4px 10px",
                            borderRadius: "20px",
                          }}
                        >
                          {rankStyle.label}
                        </span>
                      </div>

                      {/* Program Icon */}
                      <div className="mb-2 d-flex justify-content-center" style={{ marginTop: "20px" }}>
                        {getProgramIcon(
                          program.programType,
                          program.isRecommended ? RECOMMENDED_GREEN : "#6c757d"
                        )}
                      </div>

                      {/* Program Name */}
                      <h6
                        className="fw-bold mb-2"
                        style={{
                          fontSize: isMobile ? "0.85rem" : "0.95rem",
                          color: "#2B3176",
                          minHeight: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {program.programLabel}
                      </h6>

                      {/* Percentage */}
                      <div className="mb-2">
                        <span
                          className="fw-bold"
                          style={{
                            fontSize: "1.5rem",
                            color: program.isRecommended ? RECOMMENDED_GREEN : status.color,
                          }}
                        >
                          {program.percentage}%
                        </span>
                      </div>

                      {/* Badges */}
                      <div className="d-flex flex-wrap gap-2 justify-content-center">
                        {program.isRecommended && (
                          <span
                            className="badge"
                            style={{
                              backgroundColor: RECOMMENDED_GREEN,
                              fontSize: "0.6rem",
                              padding: "3px 8px",
                            }}
                          >
                            <Star size={8} fill="white" className="me-1" />
                            Recommended
                          </span>
                        )}
                        <span
                          className="badge bg-light text-dark border"
                          style={{ fontSize: "0.6rem", padding: "3px 8px" }}
                        >
                          {status.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 📊 DETAILED LIST */}
        <div className="mb-3">
          <h5
            className="fw-bold"
            style={{ color: "#2B3176", fontSize: isMobile ? "1.1rem" : "1.25rem" }}
          >
            All Programs
          </h5>
        </div>

        <div className="row g-3">
          {rankedPrograms.map(({ programType, programLabel, percentage, isRecommended }) => {
            const status = getStatusDetails(percentage);

            return (
              <div key={programType} className="col-12 col-lg-6">
                <div
                  className="card h-100 border-0"
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    border: isRecommended
                      ? `2px solid ${RECOMMENDED_GREEN}`
                      : "1px solid #e9ecef",
                  }}
                >
                  <div className="card-body p-3 p-md-4">
                    <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
                      <div className="d-flex align-items-center min-w-0">
                        <div
                          className="p-2 rounded-3 me-3 flex-shrink-0"
                          style={{
                            backgroundColor: isRecommended
                              ? `${RECOMMENDED_GREEN}10`
                              : `${status.color}10`,
                          }}
                        >
                          {getProgramIcon(
                            programType,
                            isRecommended ? RECOMMENDED_GREEN : status.color
                          )}
                        </div>

                        <div className="min-w-0">
                          <h6
                            className="mb-0 fw-bold"
                            style={{
                              fontSize: isMobile ? "0.95rem" : "1rem",
                              color: "#2B3176",
                            }}
                          >
                            {programLabel}
                          </h6>
                          {isRecommended && (
                            <div
                              className="badge d-inline-flex align-items-center mt-1"
                              style={{
                                backgroundColor: RECOMMENDED_GREEN,
                                fontSize: "0.6rem",
                                padding: "3px 8px",
                              }}
                            >
                              <Star size={8} fill="white" className="me-1" />
                              TOP PICK
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-end">
                        <span
                          className="fw-bold"
                          style={{
                            fontSize: "1.25rem",
                            color: isRecommended ? RECOMMENDED_GREEN : status.color,
                          }}
                        >
                          {percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div
                      className="progress mb-3"
                      style={{ height: "8px", borderRadius: "8px", backgroundColor: "#e9ecef" }}
                    >
                      <div
                        className="progress-bar"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: isRecommended
                            ? RECOMMENDED_GREEN
                            : status.color,
                          borderRadius: "8px",
                        }}
                      />
                    </div>

                    {/* Status Text */}
                    <div className="d-flex align-items-center">
                      <span
                        className="me-2"
                        style={{ color: isRecommended ? RECOMMENDED_GREEN : status.color }}
                      >
                        {isRecommended ? <CheckCircle2 size={16} /> : status.icon}
                      </span>
                      <p
                        className="mb-0 text-muted"
                        style={{ fontSize: "0.8rem", lineHeight: "1.4" }}
                      >
                        {status.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompatibilityChart;