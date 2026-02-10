// src/pages/ResultsPage/components/CompatibilityLegend.tsx
import React, { useEffect, useState } from "react";
import { 
  Info, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  XCircle 
} from "lucide-react";

const CompatibilityLegend: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const legendItems = [
    {
      range: "80-100%",
      label: "Excellent Match",
      color: "#08CB00",
      icon: <CheckCircle2 size={16} />
    },
    {
      range: "60-79%",
      label: "Strong Fit",
      color: "#1E90FF",
      icon: <ShieldCheck size={16} />
    },
    {
      range: "40-59%",
      label: "Moderate Fit",
      color: "#FFB100",
      icon: <AlertCircle size={16} />
    },
    {
      range: "0-39%",
      label: "Limited Fit",
      color: "#dc3545",
      icon: <XCircle size={16} />
    }
  ];

  return (
    <div
      className={`rounded-4 shadow-sm ${isMobile ? "mt-3 p-2" : "mt-4 p-3"}`}
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
      }}
    >
      {/* Header & Note Section - More Compact */}
      <div className="d-flex flex-column align-items-center mb-2">
        <div
          className="w-100 py-1 px-3 text-center rounded-pill d-flex align-items-center justify-content-center mb-2"
          style={{
            fontSize: "0.7rem",
            backgroundColor: "#f1f5f9",
            color: "#64748b",
            maxWidth: "500px"
          }}
        >
          <Info size={12} className="me-2 text-primary" />
          <span>
            Scores represent independent confidence levels and <strong>do not sum to 100%</strong>.
          </span>
        </div>
      </div>

      {/* Grid: 2x2 on Mobile, 1x4 on Desktop - Fixed 'g-13' to 'g-2' */}
      <div className="row g-2"> 
        {legendItems.map((item, index) => (
          <div key={index} className="col-6 col-md-3">
            <div 
              className="d-flex align-items-center p-2 rounded-3 h-100"
              style={{ 
                backgroundColor: `${item.color}08`,
                border: `1px solid ${item.color}15` 
              }}
            >
              <div 
                className="me-2 d-flex align-items-center justify-content-center"
                style={{ color: item.color }}
              >
                {item.icon}
              </div>
              <div className="d-flex flex-column">
                <span
                  className="fw-bold"
                  style={{ color: item.color, fontSize: "0.85rem", lineHeight: "1" }}
                >
                  {item.range}
                </span>
                <span className="text-muted" style={{ fontSize: "0.65rem", fontWeight: "600" }}>
                  {item.label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompatibilityLegend;