// src/pages/ResultsPage/components/RecommendedProgramCard.tsx
import React, { useEffect, useState } from "react";
import { Target } from "lucide-react";
import { ProgramLabels, type ProgramType } from "../types";

interface RecommendedProgramCardProps {
  program: ProgramType;
}

const RecommendedProgramCard: React.FC<RecommendedProgramCardProps> = ({
  program,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 992);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ Safe: `program` is of type `ProgramType`, so key exists in `ProgramLabels`
  const programName = ProgramLabels[program] || program;

  return (
    <div className={`text-center ${isMobile ? "mb-4 px-3" : "mb-5"}`}>
      <h3 
        className={`mb-3 fw-bold ${isMobile ? "fs-4" : ""}`} 
        style={{ color: "#6c0909ff" }}
      >
        <Target size={isMobile ? 20 : 24} className="me-2" />
        Recommended Program
      </h3>
      
      <div
        className={`d-inline-block text-white rounded-pill shadow-lg ${
          isMobile ? "px-4 py-2" : "px-5 py-3"
        }`}
        style={{
          background: "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)",
          border: "3px solid #2B3176",
          maxWidth: "100%", // Ensures it doesn't overflow screen width on very small mobiles
        }}
      >
        <span className={`fw-bold ${isMobile ? "fs-4" : "fs-2"}`}>
          {programName}
        </span>
      </div>

      <p 
        className={`mt-3 ${isMobile ? "fs-6 px-2" : "fs-5"}`} 
        style={{ color: "#171f73ff" }}
      >
        Best match based on your skills, interests, and learning style
      </p>
    </div>
  );
};

export default RecommendedProgramCard;