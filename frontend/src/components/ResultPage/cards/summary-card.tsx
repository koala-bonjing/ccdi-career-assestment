// src/pages/ResultsPage/components/SummaryCard.tsx
import React from "react";
import { BookOpen } from "lucide-react";

interface SummaryCardProps {
  summary?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  return (
    <div className="mb-5">
      <h3 className="text-center mb-4 fw-bold" style={{ color: "#741111ff" }}>
        <BookOpen size={28} className="me-2" />
        Assessment Summary
      </h3>
      <div
        className="p-4 rounded"
        style={{
          background: "linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)",
          border: "2px solid #2B3176",
        }}
      >
        <p className="summary-p fs-5 mb-0 text-dark text-center">
          {summary ||
            "Based on your comprehensive assessment, here are your personalized results and program recommendations..."}
        </p>
      </div>
    </div>
  );
};

export default SummaryCard;