// src/pages/ResultsPage/components/CompatibilityChart.tsx
import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Cpu, Zap, Users, Wifi, Battery, Star,
  CheckCircle2, ShieldCheck, AlertCircle, XCircle
} from "lucide-react";
import {
  ProgramLabels,
  type ProgramType,
  type ProgramPercentages,
} from "../types";

const RECOMMENDED_GREEN = "#08CB00";

const getStatusDetails = (percentage: number) => {
  if (percentage >= 80) return { 
    label: "Excellent Match", 
    color: "#08CB00", 
    icon: <CheckCircle2 size={20} />,
    desc: "Excellent match with your profile and career goals." 
  };
  if (percentage >= 60) return { 
    label: "Strong Fit", 
    color: "#1E90FF", 
    icon: <ShieldCheck size={20} />,
    desc: "Strong fit for your skills and interests." 
  };
  if (percentage >= 40) return { 
    label: "Moderate Fit", 
    color: "#FFB100", 
    icon: <AlertCircle size={20} />,
    desc: "Moderate alignment with your current assessment." 
  };
  return { 
    label: "Limited Fit", 
    color: "#dc3545", 
    icon: <XCircle size={20} />,
    desc: "Limited compatibility based on current results." 
  };
};

const getProgramIcon = (programType: string, color: string): React.ReactNode => {
  const iconProps = { size: 22, color: color, strokeWidth: 2.5 };
  switch (programType) {
    case "BSCS": return <Cpu {...iconProps} />;
    case "BSIT": return <Zap {...iconProps} />;
    case "BSIS": return <Users {...iconProps} />;
    case "BSET Electronics Technology": return <Wifi {...iconProps} />;
    case "BSET Electrical Technology": return <Battery {...iconProps} />;
    default: return <BarChart3 {...iconProps} />;
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

  return (
    <div className="card border-0 shadow-lg" style={{ borderRadius: "20px" }}>
      <div className={`card-body ${isMobile ? "p-3" : "p-5"}`}>
        <div className="text-center mb-4">
          <h3 className="fw-bold" style={{ color: "#2B3176", fontSize: isMobile ? "1.4rem" : "2rem" }}>
            <BarChart3 size={isMobile ? 24 : 32} className="me-2" />
            Program Compatibility
          </h3>
        </div>

        <div className="row g-3">
          {Object.entries(ProgramLabels).map(([programType, programLabel]) => {
            const percentage = percentages[programType as keyof ProgramPercentages] || 0;
            const isRecommended = programType === recommendedProgram;
            const status = getStatusDetails(percentage);

            return (
              <div key={programType} className="col-12 col-lg-6">
                <div 
                  className="card h-100 border-0 transition-all" 
                  style={{ 
                    borderRadius: "15px", 
                    // 🔹 Make Recommended Card have a Green shadow and border
                    boxShadow: isRecommended 
                      ? `0 0 15px ${RECOMMENDED_GREEN}40` 
                      : "0 4px 6px rgba(0,0,0,0.05)",
                    border: isRecommended 
                      ? `2px solid ${RECOMMENDED_GREEN}` 
                      : "1px solid #eee",
                    transform: isRecommended && !isMobile ? "scale(1.02)" : "none",
                    zIndex: isRecommended ? 1 : 0
                  }}
                >
                  {/* Top Accent Bar */}
                  <div style={{ 
                    height: "6px", 
                    backgroundColor: isRecommended ? RECOMMENDED_GREEN : status.color, 
                    width: "100%", 
                    borderRadius: "15px 15px 0 0" 
                  }} />
                  
                  <div className="card-body p-3 p-md-4">
                    <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
                      <div className="d-flex align-items-center min-w-0">
                        <div 
                          className="p-2 rounded-3 me-2 flex-shrink-0" 
                          style={{ backgroundColor: isRecommended ? `${RECOMMENDED_GREEN}15` : `${status.color}15` }}
                        >
                          {getProgramIcon(programType, isRecommended ? RECOMMENDED_GREEN : status.color)}
                        </div>
                        
                        <div className="min-w-0">
                          <h5
                            className="mb-0 fw-bold"
                            style={{ 
                              fontSize: isMobile ? "0.95rem" : "1.1rem",
                              color: isRecommended ? RECOMMENDED_GREEN : "#2B3176",
                              lineHeight: "1.2"
                            }}
                          >
                            {programLabel}
                          </h5>
                          {isRecommended && (
                            <div 
                              className="badge d-inline-flex align-items-center mt-1" 
                              style={{ 
                                backgroundColor: RECOMMENDED_GREEN, 
                                fontSize: "0.65rem", 
                                padding: "5px 10px",
                                borderRadius: "20px"
                              }}
                            >
                              <Star size={10} fill="white" className="me-1" /> RECOMMENDED
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-end">
                        <span className="fw-bold" style={{ 
                          fontSize: isMobile ? "0.9rem" : "1.5rem", 
                          color: isRecommended ? RECOMMENDED_GREEN : status.color 
                        }}>
                          {percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress mb-3" style={{ height: "10px", borderRadius: "10px", backgroundColor: "#f0f0f0" }}>
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${percentage}%`, 
                          backgroundColor: isRecommended ? RECOMMENDED_GREEN : status.color,
                          borderRadius: "10px"
                        }} 
                      />
                    </div>

                    {/* Description Footer */}
                    <div 
                      className="d-flex align-items-center p-2 rounded-3" 
                      style={{ 
                        backgroundColor: isRecommended ? `${RECOMMENDED_GREEN}08` : `${status.color}08`, 
                        border: `1px solid ${isRecommended ? RECOMMENDED_GREEN : status.color}20` 
                      }}
                    >
                      <span className="me-2 mt-1" style={{ color: isRecommended ? RECOMMENDED_GREEN : status.color }}>
                        {isRecommended ? <CheckCircle2 size={25} /> : status.icon}
                      </span>
                      <p className="mb-0 text-muted" style={{ fontSize: "0.8rem", lineHeight: "1.4" }}>
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