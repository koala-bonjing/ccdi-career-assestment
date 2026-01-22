// src/pages/ResultsPage/components/SummaryCard.tsx
import React, { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

interface SummaryCardProps {
  summary?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={isMobile ? "mb-4 px-2" : "mb-5"}>
      <h3 
        className={`text-center fw-bold ${isMobile ? "mb-3 fs-4" : "mb-4"}`} 
        style={{ color: "#741111ff" }}
      >
        <BookOpen size={isMobile ? 24 : 28} className="me-2" />
        Assessment Summary
      </h3>
      
      <div
        className={`rounded ${isMobile ? "p-3" : "p-4"}`}
        style={{
          background: "linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)",
          border: "2px solid #2B3176",
        }}
      >
        <p 
          className={`summary-p mb-0 text-dark text-center ${isMobile ? "fs-6" : "fs-5"}`}
        >
          {summary ||
            "Based on your comprehensive assessment, here are your personalized results and program recommendations..."}
        </p>
      </div>
    </div>
  );
};

export default SummaryCard;