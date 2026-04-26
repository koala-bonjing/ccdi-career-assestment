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
  Palette,
  Code2,
  Network,
} from "lucide-react";
import {
  ProgramLabels,
  type ProgramType,
  type ProgramPercentages,
} from "../types";

const getStatusDetails = (percentage: number) => {
  if (percentage >= 80)
    return {
      label: "Excellent Match",
      color: "#EC2326",
      icon: <CheckCircle2 size={18} />,
      desc: "Excellent match with your profile and career goals.",
    };
  if (percentage >= 60)
    return {
      label: "Strong Fit",
      color: "#1C6CB3",
      icon: <ShieldCheck size={18} />,
      desc: "Strong fit for your skills and interests.",
    };
  if (percentage >= 40)
    return {
      label: "Moderate Fit",
      color: "#F59E0B",
      icon: <AlertCircle size={18} />,
      desc: "Moderate alignment with your current assessment.",
    };
  return {
    label: "Limited Fit",
    color: "#9CA3AF",
    icon: <XCircle size={18} />,
    desc: "Limited compatibility based on current results.",
  };
};

const getProgramIcon = (
  programType: string,
  color: string,
): React.ReactNode => {
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
    case "ACT - Multimedia & Animation":
      return <Palette {...iconProps} />;
    case "ACT - Programming":
      return <Code2 {...iconProps} />;
    case "ACT - Networking":
      return <Network {...iconProps} />;
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
    const checkMobile = () => window.innerWidth < 768;
    const handleResize = () => setIsMobile(checkMobile());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rankedPrograms = Object.entries(ProgramLabels)
    .map(([programType, programLabel]) => ({
      programType,
      programLabel,
      percentage: percentages[programType as keyof ProgramPercentages] || 0,
      isRecommended: programType === recommendedProgram,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const topThree = rankedPrograms.slice(0, 3);

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bg: "linear-gradient(135deg, #A41D31, #EC2326)",
          border: "#EC2326",
          label: "1st",
        };
      case 2:
        return {
          bg: "linear-gradient(135deg, #2B3176, #1C6CB3)",
          border: "#1C6CB3",
          label: "2nd",
        };
      case 3:
        return {
          bg: "linear-gradient(135deg, #1C6CB3, #2B3176)",
          border: "#1C6CB3",
          label: "3rd",
        };
      default:
        return {
          bg: "#6c757d",
          border: "#9CA3AF",
          label: `${rank}th`,
        };
    }
  };

  return (
    <div className="mt-5">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="d-inline-flex align-items-center gap-2 mb-2">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "44px",
              height: "44px",
              background: "linear-gradient(135deg, #2B3176, #1C6CB3)",
              boxShadow: "0 4px 12px rgba(43, 49, 118, 0.25)",
            }}
          >
            <BarChart3 size={22} color="white" />
          </div>
        </div>
        <h3
          className="fw-bold mb-1"
          style={{
            color: "#2B3176",
            fontSize: isMobile ? "1.3rem" : "1.5rem",
          }}
        >
          Program Compatibility
        </h3>
        <div
          style={{
            width: "50px",
            height: "3px",
            background: "linear-gradient(135deg, #A41D31, #EC2326)",
            borderRadius: "2px",
            margin: "6px auto 0",
          }}
        />
        <p className="text-muted small mt-2 mb-0">
          Based on your assessment results
        </p>
      </div>

      {/* Top 3 Section */}
      <div
        className="mb-4 p-3 p-md-4 rounded-4"
        style={{
          background: "linear-gradient(135deg, #f8f9ff 0%, #e8f0fe 100%)",
          border: "2px solid rgba(43, 49, 118, 0.15)",
        }}
      >
        <div className="d-flex align-items-center mb-4">
          <div
            className="d-flex align-items-center justify-content-center me-3 rounded-circle"
            style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg, #A41D31, #EC2326)",
              boxShadow: "0 3px 10px rgba(236, 35, 38, 0.3)",
            }}
          >
            <Trophy size={20} color="white" />
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
                  className="h-100 rounded-4 overflow-hidden"
                  style={{
                    background: "white",
                    border: `2px solid ${rankStyle.border}30`,
                    position: "relative",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 8px 24px ${rankStyle.border}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Rank Badge */}
                  <div
                    className="position-absolute d-flex align-items-center justify-content-center"
                    style={{
                      top: "-1px",
                      left: "-1px",
                      background: rankStyle.bg,
                      color: "white",
                      fontSize: "0.7rem",
                      fontWeight: "700",
                      padding: "4px 14px",
                      borderRadius: "0 0 12px 0",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    }}
                  >
                    {rankStyle.label}
                  </div>

                  <div
                    className="p-3 text-center"
                    style={{ paddingTop: "36px" }}
                  >
                    {/* Program Icon */}
                    <div className="mb-3 d-flex justify-content-center">
                      <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          width: "48px",
                          height: "48px",
                          background: program.isRecommended
                            ? "linear-gradient(135deg, #A41D31, #EC2326)"
                            : `${status.color}15`,
                        }}
                      >
                        {getProgramIcon(
                          program.programType,
                          program.isRecommended ? "white" : status.color,
                        )}
                      </div>
                    </div>

                    {/* Program Name */}
                    <h6
                      className="fw-bold mb-2"
                      style={{
                        fontSize: isMobile ? "0.85rem" : "0.9rem",
                        color: "#2B3176",
                        minHeight: "36px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: "1.3",
                      }}
                    >
                      {program.programLabel}
                    </h6>

                    {/* Percentage */}
                    <div className="mb-2">
                      <span
                        className="fw-bold"
                        style={{
                          fontSize: "1.6rem",
                          color: program.isRecommended
                            ? "#EC2326"
                            : status.color,
                        }}
                      >
                        {program.percentage}%
                      </span>
                    </div>

                    {/* Badges */}
                    <div className="d-flex flex-wrap gap-1 justify-content-center">
                      {program.isRecommended && (
                        <span
                          className="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill"
                          style={{
                            background:
                              "linear-gradient(135deg, #A41D31, #EC2326)",
                            color: "white",
                            fontSize: "0.65rem",
                            fontWeight: "600",
                          }}
                        >
                          <Star size={10} fill="white" />
                          Recommended
                        </span>
                      )}
                      <span
                        className="px-2 py-1 rounded-pill"
                        style={{
                          background: `${status.color}15`,
                          color: status.color,
                          fontSize: "0.65rem",
                          fontWeight: "600",
                          border: `1px solid ${status.color}30`,
                        }}
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

      {/* All Programs Section */}
      <div className="mb-3">
        <h5
          className="fw-bold"
          style={{ color: "#2B3176", fontSize: isMobile ? "1rem" : "1.15rem" }}
        >
          All Programs
        </h5>
      </div>

      <div className="row g-3">
        {rankedPrograms.map(
          ({ programType, programLabel, percentage, isRecommended }) => {
            const status = getStatusDetails(percentage);

            return (
              <div key={programType} className="col-12 col-lg-6">
                <div
                  className="h-100 rounded-4 p-3 p-md-4"
                  style={{
                    background: "white",
                    border: isRecommended
                      ? "2px solid rgba(236, 35, 38, 0.3)"
                      : "1px solid rgba(43, 49, 118, 0.1)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = isRecommended
                      ? "#EC2326"
                      : "rgba(43, 49, 118, 0.25)";
                    e.currentTarget.style.boxShadow = isRecommended
                      ? "0 4px 16px rgba(236, 35, 38, 0.1)"
                      : "0 4px 12px rgba(43, 49, 118, 0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isRecommended
                      ? "rgba(236, 35, 38, 0.3)"
                      : "rgba(43, 49, 118, 0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
                    <div className="d-flex align-items-center min-w-0">
                      <div
                        className="d-inline-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                        style={{
                          width: "40px",
                          height: "40px",
                          background: isRecommended
                            ? "linear-gradient(135deg, #A41D31, #EC2326)"
                            : `${status.color}15`,
                        }}
                      >
                        {getProgramIcon(
                          programType,
                          isRecommended ? "white" : status.color,
                        )}
                      </div>

                      <div className="min-w-0">
                        <h6
                          className="mb-0 fw-bold"
                          style={{
                            fontSize: isMobile ? "0.9rem" : "0.95rem",
                            color: "#2B3176",
                          }}
                        >
                          {programLabel}
                        </h6>
                        {isRecommended && (
                          <span
                            className="d-inline-flex align-items-center gap-1 mt-1 px-2 py-1 rounded-pill"
                            style={{
                              background:
                                "linear-gradient(135deg, #A41D31, #EC2326)",
                              color: "white",
                              fontSize: "0.6rem",
                              fontWeight: "600",
                            }}
                          >
                            <Star size={8} fill="white" />
                            TOP PICK
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-end">
                      <span
                        className="fw-bold"
                        style={{
                          fontSize: "1.2rem",
                          color: isRecommended ? "#EC2326" : status.color,
                        }}
                      >
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div
                    className="w-100 rounded-pill overflow-hidden mb-3"
                    style={{ height: "8px", background: "#e5e7eb" }}
                  >
                    <div
                      className="h-100 rounded-pill"
                      style={{
                        width: `${percentage}%`,
                        background: isRecommended
                          ? "linear-gradient(135deg, #A41D31, #EC2326)"
                          : status.color,
                        transition: "width 0.6s ease",
                        boxShadow: isRecommended
                          ? "0 0 6px rgba(236, 35, 38, 0.3)"
                          : "none",
                      }}
                    />
                  </div>

                  {/* Status */}
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ color: status.color }}>{status.icon}</span>
                    <p
                      className="mb-0"
                      style={{
                        color: "#6b7280",
                        fontSize: "0.8rem",
                        lineHeight: "1.4",
                      }}
                    >
                      {status.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
};

export default CompatibilityChart;
