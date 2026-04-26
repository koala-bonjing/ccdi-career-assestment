import React, { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

interface SummaryCardProps {
  summary?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={isMobile ? "mb-4" : "mb-5"}>
      {/* Header */}
      <div className="text-center mb-3">
        <div className="d-inline-flex align-items-center gap-2 mb-2">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: isMobile ? "40px" : "48px",
              height: isMobile ? "40px" : "48px",
              background: "linear-gradient(135deg, #2B3176, #1C6CB3)",
              boxShadow: "0 4px 12px rgba(43, 49, 118, 0.25)",
            }}
          >
            <BookOpen size={isMobile ? 20 : 24} color="white" />
          </div>
        </div>
        <h3
          className="fw-bold mb-0"
          style={{
            color: "#2B3176",
            fontSize: isMobile ? "1.2rem" : "1.5rem",
            letterSpacing: "-0.3px",
          }}
        >
          Assessment Summary
        </h3>
        <div
          style={{
            width: "60px",
            height: "3px",
            background: "linear-gradient(135deg, #A41D31, #EC2326)",
            borderRadius: "2px",
            margin: "8px auto 0",
          }}
        />
      </div>

      {/* Content Card */}
      <div
        className="rounded-4"
        style={{
          background: "linear-gradient(135deg, #f8f9ff 0%, #e8f0fe 100%)",
          border: "2px solid rgba(43, 49, 118, 0.15)",
          padding: isMobile ? "20px" : "28px 32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative quote mark */}
        <div
          style={{
            position: "absolute",
            top: "-10px",
            left: "16px",
            fontSize: "60px",
            color: "rgba(43, 49, 118, 0.06)",
            fontWeight: "bold",
            lineHeight: "1",
            fontFamily: "serif",
            pointerEvents: "none",
          }}
        >
          "
        </div>

        <p
          className="mb-0 text-center"
          style={{
            color: "#374151",
            fontSize: isMobile ? "0.95rem" : "1.1rem",
            lineHeight: "1.7",
            fontWeight: "400",
            position: "relative",
            zIndex: 1,
          }}
        >
          {summary ||
            "Based on your comprehensive assessment, here are your personalized results and program recommendations tailored to your unique strengths, interests, and career goals."}
        </p>

        {/* Decorative quote mark - closing */}
        <div
          style={{
            position: "absolute",
            bottom: "-20px",
            right: "16px",
            fontSize: "60px",
            color: "rgba(43, 49, 118, 0.06)",
            fontWeight: "bold",
            lineHeight: "1",
            fontFamily: "serif",
            pointerEvents: "none",
            transform: "rotate(180deg)",
          }}
        >
          "
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
