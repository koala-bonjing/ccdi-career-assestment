// src/pages/ResultsPage/cards/preparation-roadmap-card.tsx
import React from "react";

interface PreparationAndRoadmapCardProps {
  preparationNeeded?: string[];
  successRoadmap?: string;
}

const PreparationAndRoadmapCard: React.FC<PreparationAndRoadmapCardProps> = ({
  preparationNeeded,
  successRoadmap,
}) => {
  // Parse the roadmap string into steps
  const roadmapSteps = successRoadmap
    ? successRoadmap
        .split(/\d+\.\s/)
        .filter((step) => step.trim().length > 0)
        .map((step) => step.trim())
    : [];

  // Don't render if both are empty
  if (
    (!preparationNeeded || preparationNeeded.length === 0) &&
    roadmapSteps.length === 0
  ) {
    return null;
  }

  return (
    <div className="mt-4 mb-9">
      <div
        className="card border-0 shadow-sm"
        style={{
          borderRadius: "15px",
          background: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
        }}
      >
        <div className="card-body p-4">
          {/* Header */}
          <h4
            className="fw-bold mb-3 d-flex align-items-center"
            style={{ color: "#2B3176" }}
          >
            <i className="bi bi-signpost me-2" style={{ fontSize: "1.5rem" }}></i>
            Your Path to Success
          </h4>

          {/* Preparation Needed Section */}
          {preparationNeeded && preparationNeeded.length > 0 && (
            <div className="mb-4">
              <h5
                className="fw-semibold mb-3 d-flex align-items-center"
                style={{ color: "#388E3C" }}
              >
                <i className="bi bi-list-check me-2"></i>
                Preparation Needed
              </h5>
              <p className="text-muted mb-3" style={{ fontSize: "0.95rem" }}>
                Build these foundational skills to excel in your program:
              </p>
              <ul className="list-unstyled ps-3 font-bold">
                {preparationNeeded.map((item, index) => (
                  <li
                    key={index}
                    className="mb-2 d-flex align-items-start"
                    style={{ fontSize: "1rem" }}
                  >
                    <i
                      className="bi bi-check-circle-fill me-2 mt-1 flex-shrink-0 "
                      style={{ color: "#66BB6A", fontSize: "1.1rem" }}
                    ></i>
                    <span style={{ color: "#333" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Success Roadmap Section */}
          {roadmapSteps.length > 0 && (
            <div>
              <h5
                className="fw-semibold mb-3 d-flex align-items-center"
                style={{ color: "#388E3C" }}
              >
                <i className="bi bi-map me-2"></i>
                Your Success Roadmap
              </h5>
              <p className="text-muted mb-3" style={{ fontSize: "0.95rem" }}>
                Follow these steps to build momentum and achieve your goals:
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
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #4CAF50 0%, #45A049 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        color: "white",
                        fontSize: "1rem",
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
                          left: "17px",
                          top: "36px",
                          width: "2px",
                          height: "calc(100% + 12px)",
                          background:
                            "linear-gradient(180deg, #4CAF50 0%, #C8E6C9 100%)",
                          zIndex: 1,
                        }}
                      ></div>
                    )}

                    {/* Step Content */}
                    <div
                      className="flex-grow-1"
                      style={{
                        paddingTop: "6px",
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
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreparationAndRoadmapCard;