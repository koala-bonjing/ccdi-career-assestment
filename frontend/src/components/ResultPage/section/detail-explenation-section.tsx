// src/pages/ResultsPage/components/DetailedExplanationSection.tsx
import React from "react";
import { BarChart3, Target } from "lucide-react";

interface DetailedExplanationSectionProps {
  evaluation: string;
  recommendations: string;
}

const DetailedExplanationSection: React.FC<DetailedExplanationSectionProps> = ({
  evaluation,
  recommendations,
}) => {
  return (
    <div className="row g-4 animate-fadeIn mb-5">
      {/* Evaluation */}
      <div className="col-lg-6">
        <div className="card border-0 h-100 shadow-sm">
          <div
            className="card-header py-3 text-white fw-bold"
            style={{
              background: "linear-gradient(135deg, #2B3176 0%, #1C6CB3 100%)",
              borderBottom: "3px solid #A41D31",
            }}
          >
            <BarChart3 size={20} className="me-2" />
            Detailed Evaluation
          </div>
          <div className="card-body p-4">
            <p className="text-dark mb-0" style={{ lineHeight: "1.6" }}>
              {evaluation}
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="col-lg-6">
        <div className="card border-0 h-100 shadow-sm">
          <div
            className="card-header py-3 text-white fw-bold"
            style={{
              background: "linear-gradient(135deg, #A41D31 0%, #EC2326 100%)",
              borderBottom: "3px solid #2B3176",
            }}
          >
            <Target size={20} className="me-2" />
            Personalized Recommendations
          </div>
          <div className="card-body p-4">
            <p className="text-dark mb-0" style={{ lineHeight: "1.6" }}>
              {recommendations}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedExplanationSection;