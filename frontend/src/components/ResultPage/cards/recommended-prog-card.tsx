// src/pages/ResultsPage/components/RecommendedProgramCard.tsx
import React from "react";
import { Target } from "lucide-react";
import { ProgramLabels, type ProgramType } from "../types";

interface RecommendedProgramCardProps {
  program: ProgramType;
}

const RecommendedProgramCard: React.FC<RecommendedProgramCardProps> = ({
  program,
}) => {
  // ✅ Safe: `program` is of type `ProgramType`, so key exists in `ProgramLabels`
  const programName = ProgramLabels[program] || program;

  return (
    <div className="text-center mb-5">
      <h3 className="mb-3" style={{ color: "#6c0909ff" }}>
        <Target size={24} className="me-2" />
        Recommended Program
      </h3>
      <div
        className="d-inline-block text-white px-5 py-3 rounded-pill shadow-lg"
        style={{
          background: "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)",
          border: "3px solid #2B3176",
        }}
      >
        <span className="fw-bold fs-2">{programName}</span>
      </div>
      <p className="mt-3 fs-5" style={{ color: "#171f73ff" }}>
        Best match based on your skills, interests, and learning style
      </p>
    </div>
  );
};

export default RecommendedProgramCard;
