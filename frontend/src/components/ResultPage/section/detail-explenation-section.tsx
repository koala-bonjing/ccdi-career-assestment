import React, { useEffect, useState } from "react";
import { BarChart3, Target } from "lucide-react";

interface DetailedExplanationSectionProps {
  evaluation: string;
  recommendations: string;
}

const DetailedExplanationSection: React.FC<DetailedExplanationSectionProps> = ({
  evaluation,
  recommendations,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={`row g-4 ${isMobile ? "mb-4" : "mb-5"}`}>
      {/* Evaluation */}
      <div className="col-lg-6">
        <div
          className="h-100 rounded-4 overflow-hidden"
          style={{
            border: "2px solid rgba(43, 49, 118, 0.15)",
            boxShadow: "0 2px 12px rgba(43, 49, 118, 0.06)",
          }}
        >
          {/* Header */}
          <div
            className="d-flex align-items-center gap-2 py-3 px-4 text-white fw-bold"
            style={{
              background: "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)",
              fontSize: isMobile ? "0.95rem" : "1.05rem",
            }}
          >
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: "32px",
                height: "32px",
                background: "rgba(255, 255, 255, 0.15)",
              }}
            >
              <BarChart3 size={16} />
            </div>
            Detailed Evaluation
          </div>

          {/* Body */}
          <div
            style={{
              padding: isMobile ? "16px" : "24px",
              background: "linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%)",
            }}
          >
            <div className="d-flex gap-3">
              {/* Decorative line */}
              <div
                className="d-none d-md-block flex-shrink-0"
                style={{
                  width: "3px",
                  minHeight: "60px",
                  background: "linear-gradient(180deg, #2B3176, #1C6CB3)",
                  borderRadius: "2px",
                  alignSelf: "stretch",
                }}
              />
              <p
                className="mb-0"
                style={{
                  color: "#374151",
                  fontSize: isMobile ? "0.9rem" : "0.95rem",
                  lineHeight: "1.8",
                }}
              >
                {evaluation || "No detailed evaluation available."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="col-lg-6">
        <div
          className="h-100 rounded-4 overflow-hidden"
          style={{
            border: "2px solid rgba(236, 35, 38, 0.15)",
            boxShadow: "0 2px 12px rgba(236, 35, 38, 0.06)",
          }}
        >
          {/* Header */}
          <div
            className="d-flex align-items-center gap-2 py-3 px-4 text-white fw-bold"
            style={{
              background: "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)",
              fontSize: isMobile ? "0.95rem" : "1.05rem",
            }}
          >
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: "32px",
                height: "32px",
                background: "rgba(255, 255, 255, 0.15)",
              }}
            >
              <Target size={16} />
            </div>
            Recommendations
          </div>

          {/* Body */}
          <div
            style={{
              padding: isMobile ? "16px" : "24px",
              background: "linear-gradient(180deg, #ffffff 0%, #fef8f8 100%)",
            }}
          >
            <div className="d-flex gap-3">
              {/* Decorative line */}
              <div
                className="d-none d-md-block flex-shrink-0"
                style={{
                  width: "3px",
                  minHeight: "60px",
                  background: "linear-gradient(180deg, #A41D31, #EC2326)",
                  borderRadius: "2px",
                  alignSelf: "stretch",
                }}
              />
              <p
                className="mb-0"
                style={{
                  color: "#374151",
                  fontSize: isMobile ? "0.9rem" : "0.95rem",
                  lineHeight: "1.8",
                }}
              >
                {recommendations || "No recommendations available."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedExplanationSection;
