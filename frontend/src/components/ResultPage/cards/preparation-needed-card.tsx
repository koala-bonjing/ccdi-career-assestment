import React from "react";
import { CheckCircle2, Map, BookOpen, ChevronRight } from "lucide-react";

interface PreparationAndRoadmapCardProps {
  preparationNeeded?: string[];
  successRoadmap?: string;
}

const PreparationAndRoadmapCard: React.FC<PreparationAndRoadmapCardProps> = ({
  preparationNeeded,
  successRoadmap,
}) => {
  const roadmapSteps = successRoadmap
    ? successRoadmap
        .split(/\d+\.\s/)
        .filter((step) => step.trim().length > 0)
        .map((step) => step.trim())
    : [];

  if (
    (!preparationNeeded || preparationNeeded.length === 0) &&
    roadmapSteps.length === 0
  ) {
    return null;
  }

  return (
    <div className="mt-4 mb-4">
      <div
        className="rounded-4 overflow-hidden"
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
            fontSize: "1.05rem",
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
            <Map size={16} />
          </div>
          Your Path to Success
        </div>

        {/* Body */}
        <div
          className="p-4"
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%)",
          }}
        >
          {/* Preparation Needed Section */}
          {preparationNeeded && preparationNeeded.length > 0 && (
            <div className="mb-4">
              <h5
                className="fw-bold mb-3 d-flex align-items-center gap-2"
                style={{ color: "#2B3176", fontSize: "1rem" }}
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "28px",
                    height: "28px",
                    background: "linear-gradient(135deg, #2B3176, #1C6CB3)",
                  }}
                >
                  <BookOpen size={14} color="white" />
                </div>
                Preparation Needed
              </h5>
              <p className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
                Build these foundational skills to excel in your program:
              </p>
              <div className="d-flex flex-column gap-2">
                {preparationNeeded.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-start p-3 rounded-3"
                    style={{
                      background: "rgba(43, 49, 118, 0.03)",
                      border: "1px solid rgba(43, 49, 118, 0.1)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(43, 49, 118, 0.06)";
                      e.currentTarget.style.borderColor =
                        "rgba(43, 49, 118, 0.2)";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(43, 49, 118, 0.03)";
                      e.currentTarget.style.borderColor =
                        "rgba(43, 49, 118, 0.1)";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <CheckCircle2
                      size={18}
                      className="me-2 mt-1 flex-shrink-0"
                      style={{ color: "#EC2326" }}
                    />
                    <span
                      style={{
                        color: "#374151",
                        fontSize: "0.95rem",
                        lineHeight: "1.5",
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Roadmap Section */}
          {roadmapSteps.length > 0 && (
            <div>
              <h5
                className="fw-bold mb-3 d-flex align-items-center gap-2"
                style={{ color: "#A41D31", fontSize: "1rem" }}
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "28px",
                    height: "28px",
                    background: "linear-gradient(135deg, #A41D31, #EC2326)",
                  }}
                >
                  <Map size={14} color="white" />
                </div>
                Your Success Roadmap
              </h5>
              <p className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
                Follow these steps to build momentum and achieve your goals:
              </p>
              <div className="position-relative">
                {roadmapSteps.map((step, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-start mb-0 position-relative"
                  >
                    {/* Step Number Circle */}
                    <div
                      className="flex-shrink-0 me-3 d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: "38px",
                        height: "38px",
                        background:
                          index === 0
                            ? "linear-gradient(135deg, #A41D31, #EC2326)"
                            : "linear-gradient(135deg, #2B3176, #1C6CB3)",
                        fontWeight: "bold",
                        color: "white",
                        fontSize: "0.9rem",
                        boxShadow:
                          index === 0
                            ? "0 3px 10px rgba(236, 35, 38, 0.3)"
                            : "0 3px 10px rgba(43, 49, 118, 0.2)",
                        zIndex: 2,
                      }}
                    >
                      {index + 1}
                    </div>

                    {/* Connecting Line */}
                    {index < roadmapSteps.length - 1 && (
                      <div
                        style={{
                          position: "absolute",
                          left: "18px",
                          top: "38px",
                          width: "2px",
                          height: "calc(100% - 8px)",
                          background:
                            "linear-gradient(180deg, #1C6CB3 0%, rgba(28, 108, 179, 0.1) 100%)",
                          zIndex: 1,
                        }}
                      />
                    )}

                    {/* Step Content */}
                    <div
                      className="flex-grow-1 pb-4"
                      style={{ paddingTop: "6px" }}
                    >
                      <div
                        className="p-3 rounded-3"
                        style={{
                          background: "rgba(43, 49, 118, 0.02)",
                          border: "1px solid rgba(43, 49, 118, 0.08)",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "rgba(43, 49, 118, 0.05)";
                          e.currentTarget.style.borderColor =
                            "rgba(43, 49, 118, 0.15)";
                          e.currentTarget.style.boxShadow =
                            "0 2px 8px rgba(43, 49, 118, 0.08)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            "rgba(43, 49, 118, 0.02)";
                          e.currentTarget.style.borderColor =
                            "rgba(43, 49, 118, 0.08)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div className="d-flex align-items-start gap-2">
                          <ChevronRight
                            size={14}
                            className="mt-1 flex-shrink-0"
                            style={{ color: "#1C6CB3" }}
                          />
                          <p
                            className="mb-0"
                            style={{
                              color: "#374151",
                              fontSize: "0.9rem",
                              lineHeight: "1.6",
                            }}
                          >
                            {step}
                          </p>
                        </div>
                      </div>
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
