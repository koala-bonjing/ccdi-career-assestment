import React from "react";
import { Award, MapPin, GraduationCap } from "lucide-react";

interface StudentInfoCardProps {
  fullName?: string;
  preferredCourse?: string;
  address?: string;
  school?: string;
}

const StudentInfoCard: React.FC<StudentInfoCardProps> = ({
  fullName,
  preferredCourse,
  address,
  school,
}) => {
  return (
    <div className="text-center mb-5">
      <div className="d-flex align-items-center justify-content-center mb-3">
        <Award size={40} className="text-primary me-3" />
        <h2
          className="card-title mb-0 fw-bold"
          style={{ color: "#2B3176", fontSize: "2rem" }}
        >
          Assessment Results
        </h2>
      </div>
      <div className="row justify-content-center g-3">
        <div className="col-md-6">
          <div
            className="bg-light rounded p-3"
            style={{ border: "2px solid rgba(43, 49, 118, 0.2)", borderRadius: "12px" }}
          >
            <strong style={{ color: "#2B3176", fontSize: "0.85rem" }}>
              Student Name:
            </strong>
            <br />
            <span
              className="fs-5 fw-bold"
              style={{ color: "#A41D31", fontSize: "1.5rem" }}
            >
              {fullName || "Not specified"}
            </span>
          </div>
        </div>
        <div className="col-md-6">
          <div
            className="bg-light rounded p-3"
            style={{ border: "2px solid rgba(43, 49, 118, 0.2)", borderRadius: "12px" }}
          >
            <strong style={{ color: "#2B3176", fontSize: "0.85rem" }}>
              Preferred Course:
            </strong>
            <br />
            <span className="fs-5 fw-bold" style={{ color: "#1C6CB3", fontSize: "1.25rem" }}>
              {preferredCourse || "Not specified"}
            </span>
          </div>
        </div>
        {address && (
          <div className="col-md-6">
            <div
              className="bg-light rounded p-3"
              style={{ border: "2px solid rgba(43, 49, 118, 0.2)", borderRadius: "12px" }}
            >
              <strong
                style={{ color: "#2B3176", fontSize: "0.85rem" }}
                className="d-flex align-items-center justify-content-center gap-1"
              >
                <MapPin size={14} />
                Address:
              </strong>
              <br />
              <span className="fs-6 fw-bold" style={{ color: "#374151", fontSize: "1rem" }}>
                {address}
              </span>
            </div>
          </div>
        )}
        {school && (
          <div className="col-md-6">
            <div
              className="bg-light rounded p-3"
              style={{ border: "2px solid rgba(43, 49, 118, 0.2)", borderRadius: "12px" }}
            >
              <strong
                style={{ color: "#2B3176", fontSize: "0.85rem" }}
                className="d-flex align-items-center justify-content-center gap-1"
              >
                <GraduationCap size={14} />
                School:
              </strong>
              <br />
              <span className="fs-6 fw-bold" style={{ color: "#374151", fontSize: "1rem" }}>
                {school}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentInfoCard;