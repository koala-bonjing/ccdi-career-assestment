// src/pages/ResultsPage/components/DetailedExplanationToggle.tsx
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DetailedExplanationToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

const DetailedExplanationToggle: React.FC<DetailedExplanationToggleProps> = ({
  isOpen,
  onToggle,
}) => {
  return (
    <div className="text-center mb-4">
      <button
        onClick={onToggle}
        className="btn btn-lg px-5 py-3 fw-bold"
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