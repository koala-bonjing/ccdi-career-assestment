// src/pages/ResultsPage/components/CompatibilityChart.tsx
import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Cpu, // 🔹 BSCS
  Zap, // 🔹 BSIT
  Users, // 🔹 BSIS
  Wifi, // 🔹 BSET Electronics
  Battery, // 🔹 BSET Electrical
} from "lucide-react";
import {
  ProgramLabels,
  type ProgramType,
  type ProgramPercentages,
} from "../types";
import { getCompatibilityDescription } from "../utils/compatibilityUtils";

const getProgramIcon = (programType: string): React.ReactNode => {
  switch (programType) {
    case "BSCS":
      return <Cpu size={20} />;
    case "BSIT":
      return <Zap size={20} />;
    case "BSIS":
      return <Users size={20} />;
    case "BSET Electronics Technology":
      return <Wifi size={20} />;
    case "BSET Electrical Technology":
      return <Battery size={20} />;
    default:
      return <BarChart3 size={20} />;
  }
};

const getBorderColor = (programType: string): string => {
  switch (programType) {
    case "BSCS":
      return "#2B3176";
    case "BSIT":
      return "#EC2326";
    case "BSIS":
      return "#1C6CB3";
    case "BSET Electronics Technology":
      return "#28a745";
    case "BSET Electrical Technology":
      return "#dc3545";
    default:
      return "#6c757d";
  }
};

interface CompatibilityChartProps {
  percentages: ProgramPercentages;
  recommendedProgram: ProgramType;
}

const getPercentage = (
  normalizedPercent: ProgramPercentages,
  programType: string
): number => {
  const key = programType as keyof ProgramPercentages;
  const value = normalizedPercent[key];
  return typeof value === "number" ? Math.max(0, Math.min(100, value)) : 0;
};

const getProgressBarColor = (percentage: number): string => {
  if (percentage >= 80) {
    return "#08CB00"; // Vibrant green — matches "Excellent Match"
  } else if (percentage >= 60) {
    return "#1E90FF"; // Dodger blue or Bootstrap primary — for "Strong Fit"
  } else if (percentage >= 40) {
    return "#dc3545"; // Orange/amber — for "Moderate Fit"
  } else {
    return "#dc3545"; // Red — for "Limited Fit"
  }
};

const CompatibilityChart: React.FC<CompatibilityChartProps> = ({
  percentages,
  recommendedProgram,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const maxPercentage = Math.max(...Object.values(percentages));

  return (
    <div
      className="card border-0 shadow-lg"
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderRadius: "20px",
      }}
    >
      <div className={`card-body ${isMobile ? "p-3" : "p-5"}`}>
        <h3
          className="text-center mb-1 fw-bold"
          style={{ 
            color: "#2B3176", 
            fontSize: isMobile ? "1.5rem" : "2rem" 
          }}
        >
          <BarChart3 size={isMobile ? 24 : 32} className="me-3" />
          Program Compatibility
        </h3>
        <p className={`text-center text-muted mb-4 ${isMobile ? "fs-6" : "fs-5"}`}>
          This chart shows how well your profile aligns with each CCDI program
        </p>

        {/* 🔹 Responsive grid: col-lg-6 ensures stacking happens exactly at 992px */}
        <div className="row g-4">
          {Object.entries(ProgramLabels).map(([programType, programLabel]) => {
            const percentage = getPercentage(percentages, programType);
            const isRecommended = programType === recommendedProgram;

            return (
              <div
                key={programType}
                className="col-12 col-lg-6" 
              >
                <div
                  className="card border-0 h-100 shadow-sm"
                  style={{
                    borderLeft: `4px solid ${getBorderColor(programType)}`,
                  }}
                >
                  <div
                    className={`card-body ${isMobile ? "p-3" : "p-4"}`}
                    style={{
                      border: "3px solid #2B3176",
                      borderRadius: "15px",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                      <div className="d-flex align-items-center flex-shrink-1">
                        <span className="me-2">
                          {getProgramIcon(programType)}
                        </span>
                        <h5
                          className={`mb-0 fw-bold ${
                            isRecommended ? "text-primary" : "text-dark"
                          }`}
                          style={{ 
                            fontSize: isMobile ? "1rem" : "1.1rem" 
                          }} 
                        >
                          {programLabel}
                        </h5>
                      </div>
                      <div className="text-end ms-auto">
                        <span
                          className={`fw-bold ${
                            isRecommended ? "text-success" : "text-dark"
                          }`}
                          style={{ 
                            fontSize: isMobile ? "1.1rem" : "1.25rem" 
                          }}
                        >
                          {percentage}%
                        </span>
                        {isRecommended && (
                          <div
                            className="badge mt-1 m-2"
                            style={{
                              background:
                                "linear-gradient(135deg, #08CB00 0%, #08CB00 100%)",
                              color: "white",
                              fontSize: "0.75rem",
                              padding: "0.25em 0.5em",
                            }}
                          >
                            RECOMMENDED
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div
                      className="progress mb-2 "
                      style={{ height: "10px", borderRadius: "8px" }}
                    >
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor:
                            percentage === maxPercentage
                              ? "#08CB00"
                              : getProgressBarColor(percentage),
                          borderRadius: "8px",
                          transition:
                            "width 1s ease-in-out, background-color 0.3s ease",
                        }}
                      ></div>
                    </div>
                    {/* Compatibility Description */}
                    <p
                      className="text-muted mb-0 small"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {getCompatibilityDescription(percentage)}
                    </p>
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