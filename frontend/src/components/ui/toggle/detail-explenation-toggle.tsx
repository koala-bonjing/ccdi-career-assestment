// src/pages/ResultsPage/components/DetailedExplanationToggle.tsx
import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DetailedExplanationToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

const DetailedExplanationToggle: React.FC<DetailedExplanationToggleProps> = ({
  isOpen,
  onToggle,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={`text-center mb-4 ${isMobile ? "px-3" : ""}`}>
      <button
        onClick={onToggle}
        className={`btn btn-lg fw-bold ${isMobile ? "w-100 py-3" : "px-5 py-3"}`}
        style={{
          background: "linear-gradient(135deg, #1C6CB3 0%, #2B3176 100%)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(28, 108, 179, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {isOpen ? (
          <>
            <ChevronUp size={20} className="me-2" />
            Hide Detailed Analysis
          </>
        ) : (
          <>
            <ChevronDown size={20} className="me-2" />
            Show Detailed Analysis
          </>
        )}
      </button>
    </div>
  );
};

export default DetailedExplanationToggle;