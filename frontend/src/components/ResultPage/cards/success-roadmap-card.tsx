// src/pages/ResultsPage/cards/success-roadmap-card.tsx
import React from "react";

interface SuccessRoadmapCardProps {
  successRoadmap: string ;
}

const SuccessRoadmapCard: React.FC<SuccessRoadmapCardProps> = ({
  successRoadmap,
}) => {
  // Handle both string and array formats
  const roadmapSteps = Array.isArray(successRoadmap)
    ? successRoadmap
    : typeof successRoadmap === "string"
      ? successRoadmap
          .split(/\d+\.\s/)
          .filter((step) => step.trim().length > 0)
      : [];

  if (roadmapSteps.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <div
        className="card border-0 shadow-sm"
        style={{
          borderRadius: "15px",
          background: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
        }}
      >
        <div className="card-body p-4">
          <h4
            className="fw-bold mb-3 d-flex align-items-center"
            style={{ color: "#2B3176" }}
          >
            <i
              className="bi bi-map me-2"
              style={{ fontSize: "1.5rem" }}
            ></i>
            Your Success Roadmap
          </h4>
          <p className="text-muted mb-3">
            Follow these steps to build a strong foundation and achieve success
            in your program:
          </p>
          <div className="position-relative">
            {roadmapSteps.map((step, index) => (
              <div
                key={index}
                className="d-flex align-items-start mb-3 position-relative"
              >
                {/* Step Number Circle */}
                <div
                  className="flex-shrink-0 me-3"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #4CAF50 0%, #45A049 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    color: "white",
                    fontSize: "1.1rem",
                    boxShadow: "0 2px 6px rgba(76, 175, 80, 0.3)",
                    zIndex: 2,
                  }}
                >
                  {index + 1}
                </div>
                
                {/* Connecting Line (except for last item) */}
                {index < roadmapSteps.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      left: "19px",
                      top: "40px",
                      width: "2px",
                      height: "calc(100% + 12px)",
                      background: "linear-gradient(180deg, #4CAF50 0%, #C8E6C9 100%)",
                      zIndex: 1,
                    }}
                  ></div>
                )}

                {/* Step Content */}
                <div
                  className="flex-grow-1"
                  style={{
                    paddingTop: "8px",
                  }}
                >
                  <p
                    className="mb-0"
                    style={{
                      color: "#333",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                    }}
                  >
                    {step.trim()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessRoadmapCard;