// src/pages/ResultsPage/components/CompatibilityChart.tsx
import React from "react";
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

const getBgClass = (programType: string): string => {
  switch (programType) {
    case "BSCS":
      return "bg-primary";
    case "BSIT":
      return "bg-warning";
    case "BSIS":
      return "bg-info";
    case "BSET Electronics Technology":
      return "bg-success";
    case "BSET Electrical Technology":
      return "bg-danger";
    default:
      return "bg-secondary";
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

const CompatibilityChart: React.FC<CompatibilityChartProps> = ({
  percentages,
  recommendedProgram,
}) => {
  return (
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
          This chart shows how well your profile aligns with each CCDI program
        </p>

        {/* 🔹 Responsive grid: full width on mobile, 2 columns on desktop */}
        <div className="row g-4">
          {Object.entries(ProgramLabels).map(([programType, programLabel]) => {
            const percentage = getPercentage(percentages, programType);
            const isRecommended = programType === recommendedProgram;

            return (
              <div
                key={programType}
                className="col-12 col-md-6" // ✅ Full width on mobile, half on tablet+
              >
                <div
                  className="card border-0 h-100 shadow-sm"
                  style={{
                    borderLeft: `4px solid ${getBorderColor(programType)}`,
                  }}
                >
                  <div
                    className="card-body p-3 p-md-4 "
                    style={{
                      border: "3px solid #2B3176",
                      borderRadius: "15px",
                    }}
                  >
                    {" "}
                    {/* ✅ Smaller padding on mobile */}
                    <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                      <div className="d-flex align-items-center flex-shrink-1">
                        <span className="me-2">
                          {getProgramIcon(programType)}
                        </span>
                        <h5
                          className={`mb-0 fw-bold ${
                            isRecommended ? "text-success" : "text-dark"
                          }`}
                          style={{ fontSize: "1.1rem" }} // Prevent oversized text on mobile
                        >
                          {programLabel}
                        </h5>
                      </div>
                      <div className="text-end ms-auto">
                        <span
                          className={`fw-bold ${
                            isRecommended ? "text-success" : "text-dark"
                          }`}
                          style={{ fontSize: "1.25rem" }}
                        >
                          {percentage}%
                        </span>
                        {isRecommended && (
                          <div
                            className="badge mt-1 m-2"
                            style={{
                              background:
                                "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)",
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
                      className="progress mb-2"
                      style={{ height: "10px", borderRadius: "8px" }}
                    >
                      <div
                        className={`progress-bar ${getBgClass(programType)}`}
                        style={{
                          width: `${percentage}%`,
                          borderRadius: "8px",
                          transition: "width 1s ease-in-out",
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
