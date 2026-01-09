// src/pages/ResultsPage/components/StudentInfoCard.tsx
import React from "react";
import { Award } from "lucide-react";

interface StudentInfoCardProps {
  fullName?: string;
  preferredCourse?: string;
}

const StudentInfoCard: React.FC<StudentInfoCardProps> = ({
  fullName,
  preferredCourse,
}) => {
  return (
    <div className="text-center mb-5 ">
      <div className="d-flex align-items-center justify-content-center mb-3">
        <Award size={40} className="text-primary me-3" />
        <h2
          className="card-title mb-0 fw-bold"
          style={{ color: "#183184ff", fontSize: "2.5rem" }}
        >
          Assessment Results
        </h2>
      </div>
      <div className="row justify-content-center g-3">
        <div className="col-md-6">
          <div
            className="bg-light rounded p-3 "
            style={{ border: "2px solid #2B3176" }}
          >
            <strong style={{ color: "#2B3176" }}>Student Name:</strong>
            <br />
            <span
              className="fs-5"
              style={{ color: "#A41D31", fontSize: "2.25rem" }}
            >
              {fullName || "Not specified"}
            </span>
          </div>
        </div>
        <div className="col-md-6">
          <div
            className="bg-light rounded p-3 "
            style={{ border: "2px solid #2B3176" }}
          >
            <strong style={{ color: "#2B3176" }}>Preferred Course:</strong>
            <br />
            <span className="fs-5" style={{ color: "#1C6CB3" }}>
              {preferredCourse || "Not specified"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInfoCard;
